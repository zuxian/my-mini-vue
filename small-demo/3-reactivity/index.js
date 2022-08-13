// https://juejin.cn/post/7068532458349658119
class Dep {
    constructor(val) {
      this.effects = new Set()
      this._val = val
    } 
    get value() {
      this.depend()
      return this._val
    }
    set value (val) {
      this._val = val
      this.notice()
    }
    depend() {    // 收集依赖
      if (currentEffect) {
        this.effects.add(currentEffect)
      }
    }
    notice() {   // 触发依赖
      this.effects.forEach(item => item() )
    }
}

let targetMap = new Map()
export function reactive(raw) {
  // target是对象，key是对象的key; targetMap是以对象为key，depsMap为值的Map; depsMap是以对象的key为key，dep实例为值的Map
  const getDep = (target, key) => {
    // 先以对象为key获取targetMap上存储的depsMap
    let depsMap = targetMap.get(target)
    // 如果获取不到，需要初始化一个depsMap存储到targetMap上
    if (!targetMap.get(target)) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    // 以对象的key为key，获取depsMap上存储的dep实例
    let dep = depsMap.get(key)
    // 如果获取不到，需要初始化dep实例存储到depsMap上
    if (!depsMap.get(key)) {
      dep = new Dep()
      depsMap.set(key, dep)
    }
    return dep
  }
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key)
      dep.depend()           // 在getter中 收集依赖
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const dep = getDep(target, key)

      console.log(key, '---Proxy---dep---', dep)

      const result = Reflect.set(target, key, value)
      dep.notice()          // 在setter中 通知更新
      return result
    }
  })
}

let currentEffect
function effectWatch(effect) {
    currentEffect = effect
    effect()
    currentEffect = null
}


// 测试用例
const user = reactive({ age: 18, name: 'fuzuxian' })
effectWatch(() => {
//   console.log('-----effectWatch-----')
  const double = user.age * 2
  console.log(double)
//   const doubleName = user.name
//   console.log(doubleName)
})
user.age++
// user.name = 'baijingting'
