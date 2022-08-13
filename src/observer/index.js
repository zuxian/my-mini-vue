import { isObject } from "../utils";
import { arrayMethods } from './array'
import Dep from './dep.js';

class Observer {
  constructor(data) {
    //__ob__ 一个响应式标记 作用：将当前this'继承'给需响应的对象或数组
    Object.defineProperty(data, '__ob__', {
      value: this,         //指向this
      enumerable: false,   //不可枚举
      configurable: false
    })

    //判断数组响应式
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods //替换封装的原型方法
      this.observeArray(DataCue)
    } else {
      this.walk(data)
    }
  }

  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, value) {
    observe(value) //递归 所有数据响应式
    let dep = new Dep //每个属性一个
    Object.defineProperty(data, key, {
      get() {
        if (Dep.target) { //将Dep.target赋值后再调用get方法就可以给该属性添加一个wacher
          dep.depend()    //添加watcher
        }

        return value
      },
      set(newValue) {
        if (newValue === value) return
        observe(newValue) //给新数据响应式
        value = newValue

        //视图更新
        dep.notify()
      }
    })
  }
}



export function observe(data) {
  //不是对象或=null不监控
  if (!isObject(data)) {
    return
  }

  //对象已监控 则跳出
  if (data.__ob__ instanceof Observer) {
    return
  }

  return new Observer(data)
}