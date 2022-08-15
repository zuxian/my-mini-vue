


#### defineProperty


在defineProperty的第三个参数中，可以添加多个属性描述：

value：属性的值
writable：如果为false，属性的值就不能被重写,只能为只读了
configurable：总开关，一旦为false，就不能再设置（value，writable，configurable）

enumerable：是否能在for...in循环中遍历出来或在Object.keys中列举出来。

get：获取值时执行的函数

set：赋值是执行的函数



#### Proxy（代理）

`let pro = new Proxy(target,handler);`


new Proxy()表示生成一个Proxy实例
target参数表示所要拦截的目标对象
handler参数也是一个对象，用来定制拦截行为。有13种：apply 、construct、defineProperty、deleteProperty、get、getOwnPropertyDescriptor、getPrototypeOf、has、isExtensible
ownKeys、preventExtensions、set、setPrototypeOf






```
let hero = {
  name: "赵云",
  age: 25
}
let handler = {
  get: (hero, name, ) => {
    const heroName =`英雄名是${hero.name}`;
    return heroName;
  },
  set:(hero,name,value)=>{
    console.log(`${hero.name} change to ${value}`);
    hero[name] = value;
    return true;
  }
}
let heroProxy = new Proxy(hero, handler);
let obj = Object.create(heroProxy);

console.log(obj.name);
obj.name = '黄忠';
console.log(obj.name);
// --> 英雄名是赵云
// --> 赵云 change to 黄忠
// --> 英雄名是黄忠
```





#### Reflect（反射）

Reflect是一个内置的对象，它提供拦截 JavaScript 操作的方法。Reflect不是一个函数对象，因此它是不可构造的。Reflect的所有的方法都是静态的就和Math一样，目前它还没有静态属性。

Reflect对象的方法与Proxy对象的方法相同。Reflect 一共有13个静态方法


- 现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
- 修改某些Object方法的返回结果，让其变得更规范化。如Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
- 让Object操作都变成函数行为。
- Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。


```js
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true

// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);

// 旧写法
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});

// 新写法
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});

Reflect.get(1, 'foo') // 报错
Reflect.get(false, 'foo') // 报错
Reflect.set(1, 'foo', {}) // 报错
Reflect.set(false, 'foo', {}) // 报错

// ---------------

var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject) // 8
```




https://juejin.cn/post/6844903790739456013










####  with

with关键字的作用在于改变作用域

with 语句关联了 obj 对象，在 with 代码块内部，每个变量被认为是一个局部变量，如果局部变量与 obj 对象的某个属性同名，则这个局部变量会指向 obj 对象属性。


- 执行上下文和作用域链

在 js 中有三种代码运行环境：

- - 全局执行环境
- - 函数执行环境
- - Eval 执行环境

js 代码执行的时候，为了区分运行环境，会进入不同的执行上下文（Execution context，EC），这些执行上下文会构成一个执行上下文栈（Execution context stack，ECS）。

对于每个 EC 都有一个变量对象（Variable object，VO），作用域链（Scope chain）和 this 三个主要属性



