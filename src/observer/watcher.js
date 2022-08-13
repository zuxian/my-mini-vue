import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0; // 做一个watcher 的id 每次创建watcher时 都有一个序号

class Watcher {
  constructor(vm, expoOrFn, cb, options) {
    this.vm = vm
    this.expoOrFn = expoOrFn
    this.cb = cb
    this.options = options
    this.deps = []  //这个watcher会存放所有的dep
    this.depsId = new Set()
    if (typeof expoOrFn == 'function') {
      this.getter = expoOrFn
    }

    this.id = id++
    this.get()
  }

  run() {
    this.get() //重新渲染
  }

  get() {
    // 1.是先把渲染watcher 放到了 Dep.target上
    // 2.this.getter()  是不是去页面取值渲染  就是调用defineProperty的取值操作
    // 3.我就获取当前全局的Dep.target,每个属性都有一个dep 取值是就将Dep.target 保留到当前的dep中
    // 4.数据变化 通知watcher 更新 
    pushTarget(this); // 在取值之前 将watcher先保存起来
    this.getter(); // 这句话就实现了视图的渲染  -> 操作是取值 
    popTarget(); // 删掉watcher
    // Vue是组件级别更新的
  }

  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)   //存储有该watcher的所有dep.id
      this.deps.push(dep)   //存储有该watcher的所有dep
      dep.addSub(this)      //让当前dep 订阅这个watcher
    }
  }

  //视图更新
  update() {
    queueWatcher(this); // 将watcher存储起来
  }
}

export default Watcher