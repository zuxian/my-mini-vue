//diff算法核心文件 vnode比较得出最终dom


export function patch(oldVnode, newVnode) {
  const isRealElement = oldVnode.nodeType
  // 真实元素
  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode //body
    let el = createElm(newVnode);
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return newVnode
  } else {
    // dom diff 算法  同层比较 不需要跨级比较
    // 两棵树 要先比较树根一不一样，再去比儿子长的是否一样

    //1. 标签名不一致
    if (oldVnode.tag !== newVnode.tag) {
      oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
    }

    //2. 旧节点是文本节点 直接用新的文本替换掉老的文本
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text
      }
    }

    // 一定是标签了 而且标签一致
    // 需要复用老的节点 替换掉老的属性
    let el = newVnode.el = oldVnode.el
    // 更新属性  diff 属性
    updateProperties(newVnode, oldVnode.data)  //属性更新

    //对比children子元素
    let oldChildren = oldVnode.children || []
    let newChildren = newVnode.children || []
    
    /*** 下面3种核心比较 ***/
    //1. 新老都有子节点  vnode比较    diff核心
    //2. 老的有子节点   新的没子节点  直接删除
    //3. 新的有子节点   老的没子节点  直接插入

    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(el, oldChildren, newChildren)

    } else if (oldChildren.length > 0) {
      el.innerHTML = ''

    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        el.appendChild(createElm(child))
      }
    }

    return newVnode
  }
}

//判断两节点是否相同 (key + type 进行判断)
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.key == newVnode.key) && (oldVnode.tag === newVnode.tag)
}


//两子节点比对
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0                       // 老的开始的索引
  let oldStartVnode = oldChildren[0]          // 老的开始
  let oldEndIndex = oldChildren.length - 1    // 老的尾部索引
  let oldEndVnode = oldChildren[oldEndIndex]  // 获取老的孩子的最后一个

  let newStartIndex = 0                       // 老的开始的索引
  let newStartVnode = newChildren[0]          // 老的开始
  let newEndIndex = newChildren.length - 1    // 老的尾部索引
  let newEndVnode = newChildren[newEndIndex]  // 获取老的孩子的最后一个

  function makeIndexByKey(children) {         // 只需要创建一次 映射表
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)       // 根据老的孩子的key 创建一个映射表 

  //对应vue源码 src\core\vdom\patch.js  424行
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    //1与2解决数组塌陷时设置节点为null的问题

    //1. 旧开始节点是否存在 不存在下一个
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]

    //2. 旧结束节点是否存在 不存在前一个
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]

    //3. 新老 开始 节点是否相同 是递归patch比较子节点
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    
    //4. 新老 结束 节点是否相同 是递归patch比较子节点
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex]; // 移动尾部指针
      newEndVnode = newChildren[--newEndIndex];

    //5. 老开始 新结束 节点是否相同 是递归patch比较子节点
    } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 正序  和 倒叙  reverst sort
      // 3方案3 头不一样 尾不一样  头移尾  倒序操作
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 具备移动性
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];

    //6. 老结束 新开始 节点是否相同 是递归patch比较子节点
    } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 老的尾 和新的头比对
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 乱序比对  最终处理  map映射表起作用了 寻找key值对应的节点比对
      let moveIndex = map[newStartVnode.key]
      if (moveIndex == undefined) {    // 是一个新元素 在老节点之前插入新节点
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {                         // 此时说明两相同节点存在 但是位置不同
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined  // 占位 如果直接删除 可能会导致数组塌陷  [a,b,null,d]

        // 比对当前这两个元素属性和儿子
        patch(moveVnode, newStartVnode)
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex] // 移动新的指针 因为乱序这里只移动新Vnode指针
    }
  }

  //while之后
  //新 vNode两指针中间还有元素说明中间还需插入节点
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // appendChild   =  insertBefore null  js原生操作
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createElm(newChildren[i]), ele)
      // parent.appendChild(createElm(newChildren[i]))
    }
  }

  //旧 vNode两指针中间还有元素说明是多余的需要删除的节点
  if (oldStartIndex <= oldEndIndex) { // 说明新的已经循环完毕了 老的有剩余 剩余就是不要的
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }
  // 没有key 就直接比较类型，如果类型一样就复用 （隐藏的问题是儿子可能都需要重新创建）
  // 循环时尽量采用唯一的标识 作为key 如果用索引（例如倒叙 会采用索引来复用，不够准确）
}


export function createElm(vnode) { // 需要递归创建
  let { tag, children, data, key, text } = vnode;
  if (typeof tag == 'string') {
      // 元素 将虚拟节点和真实节点做一个映射关系 （后面diff时如果元素相同直接复用老元素 ）
      vnode.el = document.createElement(tag);
      updateProperties(vnode); // 跟新元素属性
      children.forEach(child => {
          // 递归渲染子节点 将子节点 渲染到父节点中
          vnode.el.appendChild(createElm(child));
      });
  } else {
      // 普通的文本
      vnode.el = document.createTextNode(text);
  }
  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  // 需要比较 vnode.data 和 oldProps 的差异
  let el = vnode.el
  let newProps = vnode.data || {}
  // 获取老的样式和新的样式的差异 如果新的上面丢失了属性 应该在老的元素上删除掉
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''; // 删除之前的样式
    }
  }

  for (let key in oldProps) {
    if (!newProps[key]) { // 此时的元素一是以前
      el.removeAttribute(key);
    }
  }


  // 其他情况直接用新的值覆盖掉老的值即可
  for (let key in newProps) {
    if (key == 'style') {
      for (let styleName in newProps.style) { // {color:red,background:green}
        el.style[styleName] = newProps.style[styleName]
      }
      // 浏览器重新渲染也会看值是否变化
    }
    // event 
    else {
      el.setAttribute(key, newProps[key]);
    }
  }
}