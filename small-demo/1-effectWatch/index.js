// 初步实现Dep和effectWatch  ----------  类似Vue3的ref API
class Dep {
    constructor(val) {
      // 使用Set数据结构来收集依赖，就是为了防止重复收集
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
        console.log('-depend---currentEffect----', currentEffect)
        this.effects.add(currentEffect)
      }
    }
    // 触发依赖
    notice() {
      this.effects.forEach(item => {
        console.log('-notice---currentEffect---22-', currentEffect)
        item()
      })
    }
}
let currentEffect
function effectWatch(effect) {
    currentEffect = effect
    effect()
    // effect收集为依赖。当effect收集依赖完毕，重新把currentEffect置为null，方便下一次依赖收集的条件判断
    currentEffect = null
}

// 测试用例
let a = new Dep(10)
let b
effectWatch(() => {
  b = a.value + 10
  console.log(b)
})
a.value = 20
a.value = 202