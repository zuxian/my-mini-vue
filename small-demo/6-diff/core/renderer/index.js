

// diff 简要版
// n1和n2节点是相同的节点---tag情况：
// 处理props的情况：
//    先将新节点的props全部挂载到el上；
//    判断旧节点的props是否不需要在新节点上，如果不需要，那么删除对应的属性；

// 处理children的情况：
//    如果新节点是一个字符串类型，那么直接调用 el.textContent = newChildren；
//    如果新节点不同一个字符串类型：
//        旧节点是一个字符串类型
//            将el的textContent设置为空字符串；
//            旧节点是一个字符串类型，那么直接遍历新节点，挂载到el上；
//        旧节点也是一个数组类型
//            取出数组的最小长度；
//            遍历所有的节点，新节点和旧节点进行pacth操作；
//            如果新节点的length更长，那么剩余的新节点进行挂载操作；
//            如果旧节点的length更长，那么剩余的旧节点进行卸载操作；

// n1: oldVnode, n2: newVnode
export function diff(n1, n2) {
  // 1. tag 如果标签都不一样，直接替换了
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag))
  } else {
    // 标签一样的话，处理props和children
    // 2. props
    const el = (n2.el = n1.el)    
    const { props: newProps = {} } = n1
    const { props: oldProps = {} } = n2
    if (newProps && oldProps) {
      // 2.1 新的和旧的不一样 old: {id: 'a', class: 'b'} new: {id: 'a', class: 'b1'}
      // 2.2 新的比旧的多 old: {id: 'a', class: 'b'} new: {id: 'a', class: 'b', c}
      // 这两种情况，当属性值不一致时，都用新的去设置就好了
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key]
        const oldVal = oldProps[key]
        if (newVal !== oldVal) {
          el.setAttribute(key, newVal)
        }
      })
    }
    if (oldProps) {
      // 2.3 新的比旧的少 old: {id: 'a', class: 'b', c} new: {id: 'a', class: 'b'}
      // 这种情况，需要把旧的中有的新的没有的key，移除出去
      Object.keys(newProps).forEach((key) => {
        if (!newProps[key]) {
          el.removeAttribute(key)
        }
      })
    }

    // 3. children 情况可能很复杂，这里直接暴力解法
    const { children: newChildren } = n2
    const { children: oldChildren } = n1
    if (typeof newChildren === 'string') {
      // 3.1 newChildren是string
      if (typeof oldChildren === 'string') {
        // 3.1.1 oldChildren是string
        if (newChildren !== oldChildren) {
          el.textContent = newChildren
        }
      } else if (Array.isArray(oldChildren)) {
        // 3.1.2 oldChildren是array
        el.textContent = newChildren
      }
    } else if (Array.isArray(newChildren)) {
      // 3.2 newChildren是array
      if (typeof oldChildren === 'string') {
        // 3.2.1 oldChildren是string
        el.innerText = ''
        // mountElement(newChildren, el)
        mountElement(n2, el)
      } else if (Array.isArray(oldChildren)) {
        // 3.2.2 oldChildren是array
        const length = Math.min(newChildren.length, oldChildren.length)        
        for (let index = 0; index < length; i++) {
          // 3.2.2.1 新旧有不一样的 old: [a, b, c] new: [a, b, d]
          // 公共length部分遍历，然后暴力diff
          diff(oldChildren[index], newChildren[index])
        }
        if (newChildren.length > length) {
          // 3.2.2.2 新的比旧的多 old: [a, b, c] new: [a, b, c, d]
          // 公共length开始遍历至新的尾，逐一mountElement
          for (let index = length; index < newChildren.length; index++) {
            mountElement(newChildren[index], el)
          }
        }
        if (oldChildren.length > length) {
          // 3.2.2.3 新的比旧的少 old: [a, b, c] new: [a, b]
          // 公共length开始遍历至旧的尾，逐一从父节点移除
          for (let index = length; index < oldChildren.length; index++) {            
            el.parentNode.removeChild(oldChildren[index].el)
          }
        }
      }
    }
  }
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode

  // 根据tag创建element
  const el = vnode.el = document.createElement(tag)

  if (props) {
    // 如果有props，则遍历props，设置attribute
    for (const key in props) {
      const val = props[key]
      el.setAttribute(key, val)
    }
  }

  if (Array.isArray(children)) {
    // 1. 如果children是数组，则递归
    children.forEach(v => {
      mountElement(v, el)
    })
  } else {
    // 2. 否则，创建文本节点并插入
    const textNode = document.createTextNode(children)
    el.appendChild(textNode)
  }

  container.appendChild(el)
}