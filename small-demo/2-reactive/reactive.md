
###  Dep

Dep提供了几个接口：

addSub: 接收的参数为Watcher实例，并把Watcher实例存入记录依赖的数组中
removeSub: 与addSub对应，作用是将Watcher实例从记录依赖的数组中移除

depend: Dep.target上存放这当前需要操作的Watcher实例，调用depend会调用该Watcher实例的addDep方法，addDep的功能可以看下面对Watcher的介绍

notify: 通知依赖数组中所有的watcher进行更新操作



### reactive 

在vue3中reactive使用Proxy来代理对象实现响应式。首先明确代码中的几个概念：

> target: 被代理的对象
> key: 被代理的对象上的属性key
> targetMap: 一个全局的Map数据结构，用来保存被代理对象上的依赖集合，其key是被代理的对象target，值是depsMap
> depsMap: 一个Map数据结构，每个被代理的对象都有一个depsMap，用来保存其依赖dep实例，其key是对象的key，值是dep实例。

调用reactive()会返回一个被代理的响应式对象。
当触发对象上某个key的getter时，先获取这个key对应的dep实例，然后调用dep.depend()收集依赖。
当触发对象上某个key的setter时，先获取这个key对应的dep实例，然后调用dep.notice触发依赖通知更新。

上面**获取dep实例*的过程(getDep())是：先通过target获取到全局targetMap上存储的depsMap，
如果没有，就先创建depsMap在存储。然后通过key获取到depsMap上保存的dep实例，如果没有就先创建dep实例再存储。





