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

// 1. callbacks[0] 是flushSchedulerQueue函数 当监听组件data数据改变时会执行dep.notify()方法
// 2. dep.notify()方法将所有触发的 watcher 传递给 queueWatcher 方法
// 3. queueWatcher方法会对 watcher 进行去重 当所有组件data改变都监听完后 flushCallbacksQueue 开始工作
let callbacks = [];   // [flushSchedulerQueue,fn]
let pending = false
function flushCallbacksQueue() {
  callbacks.forEach(fn => fn())
  pending = false
}


//上面22行第一次进入nextTick就开启了一个定时器 执行 nextTick 进来的回调函数
//由于js定时器为宏观任务，定时器会等到所有微观任务都执行后才会执行定时器
//所以当组件内的nextTick回调都一个个添加 callbacks 内且页面完全渲染后会触发 flushCallbacksQueue 方法
export function nextTick(fn) {
  callbacks.push(fn)  // 防抖
  if (!pending) {     // true  事件环的概念 promise mutationObserver setTimeout setImmediate
    setTimeout(() => {
      flushCallbacksQueue() //清除回调队列
    }, 0)
    pending = true
  }
}