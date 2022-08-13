
####  为什么要nextTick

如果没有 nextTick 更新机制，那么 num 每次更新值都会触发视图更新，有了nextTick机制，只需要更新一次。


```js
{{num}}
for(let i=0; i<100000; i++){
	num = i
}
```

nextTick是 vue 中的更新策略，也是性能优化手段，基于JS执行机制实现
vue 中我们改变数据时不会立即触发视图，如果需要实时获取到最新的DOM，可以手动调用 nextTick。


#### js执行顺序

同步任务：指排队在主线程上依次执行的任务
异步任务：不进入主线程，而进入任务队列的任务，又分为宏任务和微任务
宏任务： 渲染事件、请求、script、setTimeout、setInterval、Node中的setImmediate 等
微任务： Promise.then、MutationObserver(监听DOM)、Node 中的 Process.nextTick等

执行机制

> （1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
> （2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
> （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
> （4）主线程不断重复上面的第三步。
只要主线程空了，就会去读取"任务队列"，这就是JavaScript的运行机制。

当执行栈中的同步任务执行完后，就会去任务队列中拿一个宏任务放到执行栈中执行，执行完该宏任务中的所有微任务，再到任务队列中拿宏任务，即一个宏任务、所有微任务、渲染、一个宏任务、所有微任务、渲染…(不是所有微任务之后都会执行渲染)，如此形成循环，即事件循环(EventLoop)。

nextTick 就是创建一个异步任务，那么它自然要等到同步任务执行完成后才执行。


####  异步更新策略

vue默认是使用异步执行DOM更新的，当我们对数据进行set的时候，watcher就会知道哪里依赖了这个属性，然后把watcher推到异步队列里面。
当某个响应式数据发生变化的时候，它的setter函数会通知闭包中的Dep，Dep则会调用它管理的所有Watch对象。触发Watch对象的update实现。

```js
update () {
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()            //  同步则执行run直接渲染视图
    } else {
        queueWatcher(this)   // 异步推送到观察者队列中，下一个tick时调用
    }
}
```

当异步执行update的时候，会调用queueWatcher函数。
queueWatcher的实现中，Watch对象并不是立即更新视图，而是被push进了一个队列queue，此时状态处于waiting的状态，
这时候会继续会有Watch对象被push进这个队列queue，等到下一个tick运行时，这些Watch对象才会被遍历取出，更新视图。
同时，id重复的Watcher不会被多次加入到queue中去。



```js
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
    nextTick(flushSchedulerQueue); // flushSchedulerQueue 调用渲染watcher
  }
}
```


#### nextTick代码实现

https://blog.csdn.net/qq_42072086/article/details/106987202


observer里的 scheduler文件


- 当调用nextTick方法时会传入两个参数，回调函数和执行回调函数的上下文环境，如果没有提供回调函数，那么将返回promise对象。
- 首先将拿到的回调函数存放到数组中，判断是否正在执行回调函数，如果当前没有在pending的时候，就会执行timeFunc，多次执行nextTick只会执行一次timerFunc，

timeFunc是执行异步的方法，在timeFunc方法中选择一个异步方法.
主要是判断用哪个宏任务或微任务，因为宏任务耗费的时间是大于微任务的，所以成先使用微任务，
判断尝试顺序--> Promise、MutationObserver、setImmediate、setTimeout

>先判断是否支持promise，如果支持就将flushCallbacks放在promise中异步执行，并且标记使用微任务。
> 如果不支持promise就看是否支持MutationObserver方法，如果支持就new了一个MutationObserver类，创建一个文本节点进行监听，当数据发生变化了就会异步执行flushCallbacks方法。
> 如果以上两个都不支持就看是否支持setImmediate方法，如果支持setImmediate 就去异步执行flushCallbacks方法。如果以上三种方法都不支持，就使用setTimeout

- 最后异步去执行flushCallbacks方法，flushCallbacks中就是将传递的函数依次执行。


![nextTick](https://img-blog.csdnimg.cn/20200627201207279.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyMDcyMDg2,size_16,color_FFFFFF,t_70)



nextTick多次调用会维持一个数组，之后会异步的把数组中的方法以此执行，这样的话用户就会在视图更新之后再获取到真实的dom元素。






