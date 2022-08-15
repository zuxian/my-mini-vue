### vue实现一个watcher和obesrver

当$watch的属性值变化时，让其触发watch中的回调。

在属性值set的时候，让其发送数据发生变化的通知给Watcher，然后Watcher触发$watch中设置的回调，当属性值get的时候，将属性值再返回回来。

- 实现一个Observer，让其为对象设置的每一个属性都添加上get和set方法，以便于我们获得控制权。
- - Observer，递归遍历对象，为属性添加set/get。在defineReactive中为属性添加set/get，当设置值时使用Dep的notify方法来通知Watcher，当获取值时，判断来源，如果属于watcher监听范围内的属性，将其Dep.target（即当前属性的Watcher对象）添加到Dep实例的订阅数组中，这个数组中维护着当前watch的Watcher对象集合。

- 实现一个Watcher，当数据发生变化时，立即通知Watcher，让Watcher进行相应的操作。
- - 在Watcher中，当获取属性值时，首先将Dep.target设置为当前watcher对象，那么可以在属性get的时候，可以判断这个属性值的获取来源是哪里，如果来自于Watcher，则会带有当前的watcher对象。

- 使用Dep来进行通知处理，它连接Watcher与Observer，当Observer监测到数据变化，使用Dep来通知Watcher。
- - 可以看做是服务于Observer的订阅系统。Watcher订阅某个Observer的Dep，当Observer观察的数据发生变化时，通过Dep通知各个已经订阅的Watcher





####  与nextTick有关


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


