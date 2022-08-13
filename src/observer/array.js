//获取数组原型上的方法
const arrayProto = Array.prototype;
//克隆一个原型方法
export const arrayMethods = Object.create(arrayProto);

//7个改变数组的方法
const methods = [ 'push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice' ]

//封装7个改变数组的方法 原因：当改变数组数据时需要视图更新
methods.forEach(method => {
  //在vue内执行改变数组的方法 其实就是执行以下的方法
  arrayMethods[method] = function (...args) {
    const ob = this.__ob__
    const result = arrayProto[method].apply(this, args)

    //给增加的新数据进行响应式
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }
    inserted && ob.observeArray(inserted)

    // ob.dep.notify() //视图更新
    
    return result
  }
})