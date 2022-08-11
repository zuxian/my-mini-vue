
const TEXT = 0; // 文本
const ATTR = 1; // 属性
const REMOVE = 2; // 删除
const REPLACE = 3; // 替换


// 创建diff方法比较两者差异
export function diff(oldTree, newTree) {
    // 创建一个补丁对象和全局index索引
    let patches = {};
    let index = 0;// 用于记录当前遍历的节点标志
    diffWalk(oldTree, newTree, index, patches);
    return patches
}

// 深度优先遍历两个DOM树
function diffWalk(oldTree, newTree, index, patches) {
    let patch = [];// 记录两个节点差异的数组
    // 当新节点不存在时, 说明此时节点被删除了
    if (!newTree) {
        patch.push({
            type: REMOVE,
            index,
        }) //当两个节点的类型都为文本是比较文本变化, 如果新老节点的文本不一样就追加补丁上
    } else if (typeof oldTree === "string" && typeof newTree === "string") {
        if (oldTree !== newTree) {
            patch.push({
                type: TEXT,
                text: newTree
            })
        } //当两个节点的tagName即标签类型相同时, 对比两者的属性是否反生了变化
    } else if (oldTree.tagName === newTree.tagName) {
        // 获取新老节点属性的差异
        let attrs = diffAttr(oldTree.props, newTree.props);
        // 判断attr是否为空, 当attr为空对象是, Object.keys(attr).length返回为0
        if (Object.keys(attrs).length) {
            patch.push({
                type: ATTR,
                attrs,
            })
        }
        // 当老节点或新节点的children存在时则 递归遍历节点的子节点
        if (oldTree.children || newTree.children) {
            diffChildren(oldTree.children, newTree.children, index, patches);
        } // 检测节点替换变化
    } else {
        patch.push({
            type: REPLACE,
            newTree,
        })
    }
    // 检测patch数组里面的值是否为空, 不为空时才会将差异记录到patches上
    if (patch.length) {
        patches[index] = patch
    }
}

// 对比老节点和新节点的属性变化
function diffAttr(oldProps, newProps) {
    // 记录并保存老节点和新节点的属性变化
    let attr = {};
    // 遍历老节点的props 检测老节点的属性所对应的值是否发生了改变
    for (let key in oldProps) {
        if (oldProps[key] !== newProps[key]) {
            attr[key] = newProps[key]
        }
    }
    // 遍历新节点的key, 检测老节点是否存在key属性, 如果不存在则记录到attr上
    for (let key in newProps) {
        if (!Reflect.has(oldProps, key)) {
            attr[key] = newProps[key]
        }
    }
    return attr
}

// 遍历子节点, 并给参数添加默认值, 防止参数不为数组时,使用forEach会报错的可能
function diffChildren(oldChildren = [], newChildren = [], index, patches) {
    // 遍历children 找出区别
    oldChildren.forEach((child, i) => {
        // 深度遍历新老虚拟DOM树的差异
        diffWalk(child, newChildren[i], ++index, patches);
    })
}


