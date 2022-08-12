// 字母a-zA-Z_ - . 数组小写字母 大写字母  
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;          // 标签名
// ?:匹配不捕获   <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)
const startTagOpen = new RegExp(`^<${qnameCapture}`);    // 标签开头的正则 捕获的内容是标签名
// 闭合标签 </xxx>  
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// <div aa="123" bb=123  cc='123'
// 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
// <div > | <br/>
const startTagClose = /^\s*(\/?)>/;                      // 匹配标签结束的 >
// 匹配动态变量的  +? 尽可能少匹配
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseHTML(html) {
  let root           //存储编译出来的ast树
  let currentParent  //存储当前编译标签的父级标签
  //借助栈型结构判断标签是否正常闭合<div>对应<div>
  //执行过程中匹配到标签处理后push入stack 以此类推 例如：当push入一个</div>时上一个push的肯定是<div>如果不是则报错，如果是则将他们出栈 等待校验下一个push的标签
  let stack = []

  //结构树结构 html = <div id='app'><span>{{name}}</span></div>
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTageMatch = parseStartTag() // { tagName: 'div', attrs: [] }
      //开始标签
      if (startTageMatch) {
        start(startTageMatch.tagName, startTageMatch.attrs)
      }
      //结束标签
      const endTagMatch = html.match(endTag) //[ "</div>", "div", index: 0 ]
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
      }
    }

    //如果不是0 说明是文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd) //截取标签前面的文本
      chars(text)
    }
    if (text) {
      advance(text.length)      //编译推进
    }
  }

  //匹配该标签内的所有属性 return { tagName: 'div', attrs: [] }
  function parseStartTag() {
    const start = html.match(startTagOpen) // ["<div", "div", index: 0, ...]
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []    //属性
      }
      advance(start[0].length)  //编译推进 html => id='app'><span>{{name}}</span></div>
      
      let end, attr  // !匹配开头是> && 匹配属性  意思：匹配该标签内的所有属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        //attr => [ 0: "id='app'", 1: "id", 2: "=", 3: undefined, 4: "app", 5: undefined ]
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length) //编译推进
      }
      if (end) {
        advance(end[0].length) //编译推进
        return match
      }
    }
  }

  //开始标签 每次解析开始标签 都会执行此方法
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element //只有第一次是根
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  //处理文本
  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      //加入currentParent的子元素内
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  //编译推进 将已编译完成的字符串去除
  function advance(n) {
    html = html.substring(n)
  }


  // 常见数据结构 栈 队列 数组 链表 集合 hash表 树
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1        //1:元素  3:文本
    }
  }

  return root
}


