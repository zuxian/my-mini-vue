
###  compile: 从template到DOM


template是如何被编译成render function的呢？



   * 编译原理的3个步骤：
   * 1. template中的HTML    => ast树
   * 2. ast树        => render字符串
   * 3. render字符串 => render方法




















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






