
// nextTick.js 基本实现
let callbacks = []
let waiting = false
function flushCallbacks() {
  callbacks.forEach(cb => cb())
  callbacks = []
  waiting = false
}

let timeFunc
// 这里的 if 就是实现兼容性， 通过每个浏览器对js的支持程度，选择不同的微任务实现
if (typeof Promise !== 'undefined') {
  let p = Promise.resolve()
  timeFunc = () => {
    p.then(flushCallbacks)
  }
} else if (typeof MutationObserver !== 'undefined') {
  let observer = new MutationObserver(flushCallbacks) // mutationObserver放的回调是异步执行的
  let textNode = document.createTextNode(1) // 文本节点内容先是 1
  observer.observe(textNode,{ characterData: true })
  timeFunc = () => {
    textNode.textContent = 2 // 改成了2  就会触发更新了
  }
} else if (typeof setImmediate !== 'undefined') {
  timeFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timeFunc = () => {
    setTimeout(flushCallbacks, 0) // 所有浏览器都支持 setTimeout，所以最终都没有就使用 setTimeout
  }
}

export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    waiting = true
    timeFunc()
  }
}



