// 初步实现Dep和effectWatch  ----------  Vue3的refAPI
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