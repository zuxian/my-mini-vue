export function mountElement(vnode, container) {
  const { tag, props, children } = vnode

  // 根据tag创建element
  const el = document.createElement(tag)

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