





###  视图与数据的绑定

###  setup与render



首先是App.js中定义了setup和render，render函数可以看成是我们实际App.vue中的模板部分，

先不考虑vdom的实现，我们这里直接简单的返回一个div，div的文本由setup函数返回的响应式数据提供上下文，这样App.render(App.setup())就返回了一个文本节点为响应式对象的div，后面我们会消费这个div。


接着我们来看createApp函数，与vue3的API保持一致，createApp(App)会返回一个有mount方法的对象，调用mount方法，会首先通过调用rootComponent.setup()获取到响应式对象上下文，然后调用rootComponent.render(context)获取到我们前面说过的创建的div，最后把div追加到根节点上。


当然上一步需要被包裹在effectWatch中才能触发依赖收集，并在响应式数据发生变更时更新视图。此时我们在浏览器控制台输入state.count++可以看到界面的数字会从0开始递增。


到目前为止我们简单地完成了响应式数据与视图的绑定，但是现在是直接销毁根容器内的dom并重新创建的，开销比较大，下面我们会实现vdom。



### vdom

h函数接收三个参数，分别是标签名tag、属性集合对象props、子元素children，最终返回的vdom，其实就是一个对象，用对象来表示真实的对象。

这样render函数内最终返回的就是由h()函数生成的vdom，然后在createApp函数内，我们再调用mountElement函数把vdom生成真实的dom插入到根容器中，

这个函数中需要注意的点是：如果children是一个数组，需要遍历这个数组，并递归调用mountElement来把vdom中的所有children都生成对应的真实dom。


### diff

core/index.js里的mountElement(subTree, rootContainer)这句代码。当数据发生变更时，rootContainer下的dom是被全量替换的，即使实际发生变更的可能只是其中某个节点或某个属性。在控制台Element面板中也可以看到整个节点销毁到生成一闪而过的现象。要解决这个问题就要用到diff算法了。



