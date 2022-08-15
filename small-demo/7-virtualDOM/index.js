import { createElement } from './createElement.js'
import { createDom, render } from './createDom.js'
import { diff } from './diff.js'
import { patch } from './patch.js'

//  <ul class="ul-wrap">
//         <li class="li-item">1</li>
//         <li class="li-item">2</li>
//         <li class="li-item">3</li>
//  </ul>

// 假设我们有如上的DOM结构, 那我我们就可以利用虚拟DOM模拟出一个类似的DOM树结构
export const VDOM = createElement("ul", { class: "ul-wrap" }, [
    createElement("li", { class: "li-item" }, ["1"]),
    createElement("li", { class: "li-item" }, ["2"]),
    createElement("li", { class: "li-item" }, ["3"]),
]);

export const VOM1 = createElement("ul", { class: "ul-box" }, [
    createElement("li", {  class: "li-item" }, ["1"]),
    createElement("li", { class: "li-item", style:'color:red' }, ["我是diff之后的文本"]),
]);

console.log('11111111111111111', JSON.stringify(VDOM, null, 2));
console.log(VDOM);
// console.dir(JSON.stringify(VDOM,null,2));



//将第一步的虚拟DOM利用createDom进行构建,并渲染到页面上
let DOM = createDom(VDOM);
render(DOM,document.getElementById("app"))

console.log(DOM)

// // 比较两棵虚拟DOM树的差异,
let patches = diff(VDOM, VOM1);

console.log(patches)


// // 在真正的DOM元素应用变更
patch(DOM, patches);





