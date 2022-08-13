import { parseHTML } from './parser.js'
import { generate } from './generator.js'
import { createDom } from '../7-virtualDOM/createDom.js'

export function compileToFunctions(template) {
  //1. 将outerHTML 转换成 ast树
  let ast = parseHTML(template) // { tag: 'div', attrs, parent, type, children: [...] }
  // console.log("AST:", ast)

  //2. ast树 => 拼接字符串
  let code = generate(ast) //return _c('div',{id:app,style:{color:red}}, ...children)
  // code = `with(this){ \r\n return ${code} \r\n }`
  // console.log("code:", code)
  
  //3. 字符串 => 可执行方法
  let render = new Function(code)
  return render
}


// const outHtml = `<ul class="ul-box"><li class="li-item">1</li><li class="li-item" style="color: red;">2</li></ul>`

// let render1 = compileToFunctions(outHtml)
// let realElement = createDom(render1);

// document.getElementById("app").appendChild(realElement);





// const ast = parseHTML(outHtml)
// console.log(ast)
// let code = generate(ast)
// // _c("ul", {class:"ul-box"} ,_c("li", {class:"li-item"} ,_v("1")),_c("li", {class:"li-item",style:{"color":" red"}} ,_v("2")))
// console.log(code) 










