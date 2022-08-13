
// nextTick.js 基本实现
let callbacks = []
let waiting = false
function flushCallbacks() {
  callbacks.forEach(cb => cb())
  callbacks = []
  waiting = false
}

// timeFunc定义-尝试顺序--> Promise、MutationObserver、setImmediate、setTimeout

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

//  ********************************************************************************************
//  ********************************************************************************************

let has = {}; // vue源码里有的时候去重用的是set 有的时候用的是对象来实现的去重
let queue = [];

// 这个队列是否正在等待更新
function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run() // 执行 watcher 内部的 updateComponent 方法 更新页面
  }
  queue = []
  has = {}
}

//由于多个元素指向同一个 watcher 所以更新的时候需要把这些 watcher 集中起来 去重后一起执行
//原因：如果每匹配一个元素就执行一个 watcher 这样重复执行了许多相同的 watcher 性能大大下降
export function queueWatcher(watcher) {
  const id = watcher.id;

  if (has[id] == null) {
    has[id] = true // 如果没有注册过这个watcher，就注册这个watcher到队列中，并且标记为已经注册
    queue.push(watcher)  // watcher 存储了updateComponent方法 用来更新页面
    console.log("queuequeue---", queue);
    nextTick(flushSchedulerQueue); // flushSchedulerQueue 调用渲染watcher
  }
}

