

export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

export function createElement(tag, data = {}, ...children) {
  //vue 中的 key 不会作为属性传递给组件
  return vnode(tag, data, data.key, children)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}