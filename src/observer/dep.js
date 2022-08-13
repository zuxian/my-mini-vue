let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }

  depend() {
    // 1. 让dep 记住watcher
    // 2. 让watcher 记住dep 双向记忆
    Dep.target.addDep(this) //让wacher 存储 dep
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null //默认为null
const stack = []  //先进后出
export function pushTarget(watcher) { //栈添加
  Dep.target = watcher
  //  stack.push(watcher) // []
}
export function popTarget() {         //栈删除
  Dep.target = null
  //   stack.pop();
  //   Dep.target = stack[stack.length-1];
}

export default Dep
// 双向记忆原理
// dep 和 watcher 是一个多对多的关系
// 每个组件一个diff的逻辑 也就是每个组件一个watcher 也就是组件页面内多个响应式属性指向一个watcher
// 每个属性对应一个dep 而dep内存储多个watcher 也就是该dep出现在多个watcher内 说明该属性存在多个组件页面内响应式显示