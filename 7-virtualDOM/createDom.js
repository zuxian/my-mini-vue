import { Element } from './createElement.js'

export function createDom(vDom) {
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
export function setAttribute(ele, key, val) {
    // 针对给textarea设置value时候的特殊情况
    if (ele.tagName === "TEXTAREA" && key === "value") {
        ele.value = val
        return
    }
    // 判断key为style时的特殊情况
    key === "style" ? ele.style.cssText = val : ele.setAttribute(key, val);
}

// 将利用虚拟DOM构建的真实DOM渲染到视图上
export function render(Dom, root) {
    return root.appendChild(Dom)
}

