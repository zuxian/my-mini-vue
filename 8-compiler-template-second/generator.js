const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g



//作用： 'helloworld{{ msg}}aa{{bb}}aaa'  => _v('helloworld'+_s(msg)+"aa" + _s(bb))
function gen(node) {
  if (node.type === 1) {            //节点里面有children 继续遍历
    return generate(node)
  } else {                          //文本则处理
    let text = node.text

    if (!defaultTagRE.test(text)) { //没有有变量 {{}}
      return `_v(${JSON.stringify(text)})`
    } else {                        //存在变量
      let tokens = []
      let match, index
      let lastIndex = defaultTagRE.lastIndex = 0
      while (match = defaultTagRE.exec(text)) { //匹配出所有变量
        index = match.index
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        tokens.push(`_s(${match[1].trim()})`)   //获取变量名
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map(c => gen(c)).join(',')
  } else {
    return false
  }
}

//作用：[ {name:'id', value: 'divid'}, {name: 'style', value: 'color: aqua;font-size: 30px;'} ] 
//  => {id:'divid', style:{color: 'aqua', font-size: '30px'}}
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      });
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

export function generate(el) {
  let children = genChildren(el)
  let attrs = el.attrs.length ? genProps(el.attrs) : undefined
  let code = `_c("${el.tag}", ${attrs} ${children ? `,${children}` : ''})`

  return code
}