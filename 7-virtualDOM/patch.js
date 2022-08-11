import { createDom, setAttribute } from './createDom.js'

const TEXT = 0; // 文本
const ATTR = 1; // 属性
const REMOVE = 2; // 删除
const REPLACE = 3; // 替换


// patch 根据补丁对象更改真实的DOM
export function patch(DOM, patches) {
    let patchIndex = 0;// 记录当前节点的标志
    walkPath(DOM, patches);
    function walkPath(DOM, patches) {
        // 获取第一个节点的补丁
        let patch = patches[patchIndex++];
        // 获取当前DOM的所有子元素
        let children = DOM.children;
        //如果children和patch同时存在值则遍历子节点 ,打补丁
         children.length  && patch && [...children].forEach(child => walkPath(child, patches));
        if (patch) {
            doPath(DOM, patch)
        }
    }
}

function doPath(node, patch) {
    // 遍历patch 取出对应的补丁,通过type来判断需要进行的DOM操作类型
    patch.forEach(item => {
        switch (item.type) {
            case TEXT:
                node.textContent = item.text;
                break;
            case ATTR:
                // 通过Object.entries取出atts对象的键值对并进行遍历
                for (let [key, val] of Object.entries(item.attrs)) {
                    setAttribute(node, key, val);
                }
                break;
            case REMOVE:
                //从老节点的父节点上删除老节点
                node.parentNode.removeChild(node);
                break;
            case REPLACE:
                let newTree = patch[0].newTree;
                // 如果新节点为虚拟DOM对象则创建为DOM对象,否者创建文本节点
                newTree = (newTree instanceof Element) ?
                    createDom(newTree) :
                    document.createTextNode(newTree);
                // 将老节点替换为新节点
                node.parentNode.replaceChild(newTree, node)
            default:
                break;
        }
    })
}


