export class Dep {
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

  // 收集依赖
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }

  // 触发依赖
  notice() {
    this.effects.forEach(effect => {
      effect()
    })
  }
}

let currentEffect
export function effectWatch(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}

let targetMap = new Map()
export function reactive(raw) {
  // target是对象，key是对象的key
  // targetMap是以对象为key，depsMap为值的Map
  // depsMap是以对象的key为key，dep实例为值的Map
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
      // 在getter中 收集依赖
      dep.depend()
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const dep = getDep(target, key)
      const result = Reflect.set(target, key, value)
      // 在setter中 通知更新
      dep.notice()
      return result
    }
  })
}