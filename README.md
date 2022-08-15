

天天拧螺丝钉，看着网上的大神都在造火箭，于是偶尔突破下尝试造轮子吧！!

##  Vue源码学习


以最简单的代码实现一些功能，最后将这些小功能串起来，

最后加上打包，实现一个属于自己的简易版Vue框架。


small-demo文件夹包含如下文件夹：

- 1-effectWatch   初步实现Dep和effectWatch，类似Vue3的ref API
- 2-reactivity    实现reactive API
- 4-setup-render 初步实现setup与render
- 5-render-mountElement  h函数、render函数、挂载Dom
- 6-diff         虚拟Dom入门版
- 7-virtualDOM   虚拟Dom进阶版 -- 包含创建虚拟DOM（createElement.js）、创建真实Dom（createDom.js）、diff算法（diff.js）、patch方法（patch.js）
- 7-compiler-template-second   模板编译第一版
- 8-compiler-template-second   模板编译第二版
- 9-eventBus  订阅发布
-  10-nextTick  Vue源码实现异步加载






## 组合简易版Vue框架

*src文件夹*

模板编译，然后执行render函数， render函数会触发响应式的getter ，进行依赖收集（在模板里触发了哪个变量的getter就对其进行watcher）。在修改data的时候，触发setter ，通知（notify）watcher去 重新触发re-reder进行重新渲染



####   new Vue()都干了什么



- initMixin

 把Vue实例赋值给变量vm，并且把用户传递的options选项与当前构造函数的options属性及其父级构造函数的options属性进行合并，得到一个新的options选项赋值给$options属性，并将$options属性挂载到Vue实例上 .



 在所有的初始化工作都完成以后，最后，会判断用户是否传入了el选项，如果传入了则调用$mount函数进入模板编译与挂载阶段，如果没有传入el选项，则不进入下一个生命周期阶段，需要用户手动执行vm.$mount方法才进入下一个生命周期阶段。 

```js
// 数据响应式 outerHTML文本转换成render函数 mountComponent挂载页面
export function initMixin (Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options || {}, options)     // 合并options
    callHook(vm, 'beforeCreate')    // 调用生命周期钩子函数
    initState(vm)           // 初始化状态
    callHook(vm, 'created')   // 调用生命周期钩子函数
    if (vm.$options.el) {     // 在根节点渲染页面
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = vm.$el = document.querySelector(el)
    const opts = vm.$options;      //遵循源码 render > template > el 渲染机制
    if (!opts.render) {
      let template = opts.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      opts.render = render
    }
    // 走到这用户传入是render函数不需编译 --initMixin初始化结束
    mountComponent(vm); // 组件的挂载流程
  }
}
```

- renderMixin方法

给Vue原型挂载渲染方法：
_c对应createElement创建一个元素
_v是创建一个文本节点
_s是返回参数中的字符串

用element ASTs去递归，拼出这样的_c(‘div’,[_c(‘p’,[_v(_s(name))])])字符串。

```js
export function renderMixin(Vue) {
  Vue.prototype._v = function (text) {  //创建文本节点
    return createTextVNode(text)
  }
  Vue.prototype._c = function () {      //创建标签节点
    return createElement(...arguments)
  }
  Vue.prototype._s = function (val) {   // 判断当前这个值是不是对象 ，如果是对象 直接转换成字符串 ，防止页面出现[object Object]
    return val == null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  }
  Vue.prototype._render = function () { //字符串实现的render方法
    const vm = this
    const { render } = vm.$options
    let vnode = render.call(vm)         //方法存在Vue原型上 this指向Vue _v _c  _s
    return vnode
  }
}
```

- lifeCycleMixin方法

页面挂载时使用Watcher监听redner函数 
因为页面第一次挂载render函数内有很多属性调用get 此时便可给这些属性添加该Watcher

```js
export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    // 将虚拟节点 变成 真实节点 替换掉$el 后续 dom diff 也会执行此方法
    vm.$el = patch(vm.$el, vnode)
  }
}
```

- initGlobalApi方法： 给构造函数来扩展全局的方法

```js
export function initGlobalAPI(Vue) { //全局api
  Vue.options = {}
  Vue.mixin = function (mixin) {  //公共方法 合并options
    this.options = mergeOptions(this.options, mixin)
  }
}
```

-  index.js --- Vue类

```js
// import { initMixin } from './init'
// import { renderMixin } from './render.js'
// import { lifeCycleMixin } from './lifecycle.js'
// import { initGlobalAPI } from './global-api/index.js'
import { nextTick } from './observer/scheduler'
class Vue {
  constructor(options) {
    this._init(options); // 初始化操作
  }
}
initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)
initGlobalAPI(Vue)  // initGlobalApi 给构造函数来扩展全局的方法
Vue.prototype.$nextTick = nextTick
export default Vue
```



参考

https://juejin.cn/post/7068532458349658119

https://github.com/shunyue1320/vue-resolve
