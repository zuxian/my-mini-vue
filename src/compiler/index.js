import { parseHTML } from './parser.js'
import { generate } from './generator.js'

export function compileToFunctions(template) {
  //1. 将outerHTML 转换成 ast树
  let ast = parseHTML(template) // { tag: 'div', attrs, parent, type, children: [...] }
  // console.log("AST:", ast)

  //2. ast树 => 拼接字符串
  let code = generate(ast) //return _c('div',{id:app,style:{color:red}}, ...children)
  code = `with(this){ \r\n return ${code} \r\n }`
  // console.log("code:", code)
  
  //3. 字符串 => 可执行方法
  let render = new Function(code)
  /**如下：
  * render(){ 
  *   with(this){
  *     return _c('div',{id:app,style:{color:red}},_c('span',undefined,_v("helloworld"+_s(msg)) ))
  *   }
  * }
  * 
  */

  return render
  /**
   * 编译原理的3个步骤：
   * 1. outerHTML    => ast树
   * 2. ast树        => render字符串
   * 3. render字符串 => render方法
   */
}