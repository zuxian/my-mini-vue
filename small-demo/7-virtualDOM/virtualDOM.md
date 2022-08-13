
##  virtual DOM


虚拟DOM用原生的JavaScript模拟实现了DOM结构, 我们通过操作这个虚拟DOM树来实现对页面的渲染和维护。

其实就是一个JS的对象。React的createElement函数, Vue的render或“h”函数

https://www.jianshu.com/p/35130273cf86


- virtual DOM算法

> 用原生JavaScript对象结构模拟出DOM树结构,利用这个树构建一个真正的DOM树,并渲染到页面中
> 当状态变更时, 重新构建一个新的虚拟DOM树,然后用新的树和旧的树进行对比,记录并保存出两棵树的差异,
> 当步骤二记录的差异应用到步骤一中所构建的真正的DOM树上,视图就更新了.


####  用JavaScript对象模拟DOM树


- 构建出虚拟DOM树

```js
// 构造虚拟DOM对象类
export class Element {
    constructor(tagName, props, children) {
    	this.tagName = tagName;
    	this.props = props;
    	this.children = children;
    }
}
// 创建虚拟DOM
function createElement(tagName, props, children) {
    return new Element(tagName, props, children)
}
// 例子---使用createElement函数
export const VDOM = createElement("ul", { class: "ul-wrap" }, [
    createElement("li", { class: "li-item" }, ["1"]),
    createElement("li", { class: "li-item" }, ["2"]),
    createElement("li", { class: "li-item" }, ["3"]),
]);
```

- 虚拟DOM-->真实DOM, 并渲染到页面上

```js
function createDom(vDom) {
    const {tagName, props={}, children=[]} = vDom;
    // 创建DOM元素
    let ele = document.createElement(tagName);
    // 遍历props并给DOM节点设置相应的属性
    for (let [key, val] of Object.entries(props)) {
        setAttribute(ele, key, val)
    }
    (children || []).forEach(child => {
        // 如果子节点是虚拟DOM就递归构建DOM节点, 如果为字符串只构建文本节点
        const childEle = (child instanceof Element) ? createDom(child) : document.createTextNode(child)
        // 将节点追加到根元素上
        ele.appendChild(childEle)
    })
    return ele
}
// 设置DOM元素的相对应的属性键值对
function setAttribute(ele, key, val) {
    // 针对给textarea设置value时候的特殊情况
    if (ele.tagName === "TEXTAREA" && key === "value") {
        ele.value = val
        return
    }
    // 判断key为style时的特殊情况
    key === "style" ? ele.style.cssText = val : ele.setAttribute(key, val);
}
// 将利用虚拟DOM构建的真实DOM渲染到视图上
function render(Dom, root) {
    return root.appendChild(Dom)
}
//将第一步的虚拟DOM利用createDom进行构建,并渲染到页面上
let DOM = createDom(VDOM);
render(DOM, document.getElementById("app"))
```


#### 比较两棵虚拟DOM树的差异


一个很复杂的视图, 对它进行更新视图的操作, 只需要更新视图中的很小的一部分, 如果更新整个DOM树才能完成渲染, 这是很浪费性能和资源的。



diff算法，节点的差异变化最主要的的有以下几种

> 文本变化, 元素文本内容发生了改变.
> 属性变化, 修改了节点的属性.
> 删除节点, 把之前的节点从DOM中移除看。
> 替换节点, 例如把上面的ul节点替换为div节点。



只在同一个层级的元素进行对比。深度优先遍历, 记录差异 每一个节点都会有一个唯一的标记.


1. 创建一个补丁对象和全局index索引，用于记录当前遍历的节点标志

2. 深度优先遍历两个DOM树: `diffWalk(oldTree, newTree, index, patches);`

2-1. 当新节点不存在时, 说明此时节点被删除了，直接`patch.push({ type: REMOVE, index }) `

2-2.  当两个节点的类型都为文本是比较文本变化, 如果新老节点的文本不一样就追加补丁上

2-3. 当两个节点的标签类型相同时, 对比两者的属性是否反生了变化. `attrs = diffAttr(oldTree.props, newTree.props);` . 
     当老节点或新节点的children存在时则 递归遍历节点的子节点. `diffChildren(oldTree.children, newTree.children, index, patches);`

2-4. 检测节点替换变化


####  将差异应用到真正的DOM树上


patch 根据补丁对象更改真实的DOM

- `walkPath`方法： 
获取第一个节点的补丁, 获取当前DOM的所有子元素, 
如果children和patch同时存在值则遍历子节点, 递归调用`walkPath`打补丁
如果patch存在，则调用`doPath(DOM, patch)`, 进行DOM操作。


- `doPath`方法：

遍历patch取出对应的补丁, 通过type（TEXT、ATTR、REMOVE、REPLACE）来判断需要进行的DOM操作类型




