
###  compile: 从template到DOM


template是如何被编译成render function的呢？

   * 编译原理的3个步骤：
   * 1. template中的HTML    => ast树
   * 2. ast树        => render字符串
   * 3. render字符串 => render方法



template中的html内容：包含了v-text、v-bind、v-html等指令解析，以及v-on事件绑定、双大括号插值语法等。 

`new Vue(el, data, method, ...)`

创建一个Vue类

```js
class Vue {
    constructor(options) {
        // 储存数据到实例  options为HTML中new Vue({})时传入的配置对象
        this.$options = options;
        this.$data = options.data;
        this.$el = options.el;
        if (this.$el) {
			... ...
            new Compile(this.$el, this);
        }
    }
}
```

*实现一个指令解析器*  `new  Compile(this.$el, this) `

```js
class Compile {
    constructor(el, vm) {
        // 判断传入el是否为节点,若不是节点则获取
        this.el = node.nodeType === 1 ? el : document.querySelector('#app');
        this.vm = vm;
        // 1. 获取文档碎片节点，放入内存中减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        this.compile(fragment);   // 2. 编译模板
        this.el.appendChild(fragment);   // 3. 追加子元素到根元素
    }
}
```



把`#app`下所有的子节点放入文档碎片



`compile方法`： 获取所有的子节点，每个子节点如果是元素节点则解析元素节点`compileElement`，如果是文本节点则解析文本节点`compileText`，子节点中如果还有子节点节点则递归调用。



`compileElement`方法：获取所有属性，每个属性判断是否是Vue指令，进行对应的操作，最后删除指令属性。

`compileText`方法：匹配双大括号，获取值，更新text文本。



 `compileUtil`包含一些方法：处理v-text指令（node.textContent）、v-html指令（node.innerHTML）、v-model指令（node.value）、v-on指令（node.addevent）、v-bind指令（node.setAttribute(attrName, value)）





<hr />

<hr />



1.模板解析的关键对象: compile对象
2.模板解析的基本流程:
            1). 将el的所有子节点取出, 添加到一个新建的文档fragment对象中
            2). 对fragment中的所有层次子节点递归进行编译解析处理
                    * 对插值文本节点进行解析
                                        * 对元素节点的指令属性进行解析
                            * 事件指令解析
                            * 一般指令解析
                        3). 将解析后的fragment添加到el中显示

3.解析插值语法节点: textNode.textContent = value
      1). 根据正则对象得到匹配出的表达式字符串: 子匹配/RegExp.$1
      2). 从data中取出表达式对应的属性值
      3). 将属性值设置为文本节点的textContent

4.事件指令解析: elementNode.addEventListener('eventName', callback.bind(vm))
      1). 从指令名中取出事件名
      2). 根据指令属性值(表达式)从methods中得到对应的事件处理函数对象
      3). 给当前元素节点绑定指定事件名和回调函数的dom事件监听
      4). 指令解析完后, 移除此指令属性

5.一般指令解析: elementNode.xxx = value
      1). 得到指令名和指令值(表达式)
      2). 从data中根据表达式得到对应的值
      3). 根据指令名确定需要操作元素节点的什么属性
        * v-text---textContent属性
        * v-html---innerHTML属性
        * v-class--className属性
      4). 将得到的表达式的值设置到对应的属性上
      5). 移除元素的指令属性



<hr />

<hr />

<hr />

-  ==文档碎片==

当需要添加多个dom元素时，如果先将这些元素添加到DocumentFragment中，再统一将DocumentFragment添加到页面，会减少页面渲染dom的次数，效率会明显提升。放入内存中减少页面的回流和重绘

如果使用appendChid方法将原dom树中的节点添加到DocumentFragment中时，会删除原来的节点。 






