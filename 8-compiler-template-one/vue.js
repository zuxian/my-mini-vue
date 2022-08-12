class Vue {
    constructor(options) {
        // 储存数据到实例  options为HTML中new Vue({})时传入的配置对象
        this.$options = options;
        this.$data = options.data;
        this.$el = options.el;
        if (this.$el) {
            //1. 实现一个数据观察者
              // 暂时跳过
            //2. 实现一个指令解析器
            new Compile(this.$el, this);
        }
    }
}

class Compile {
    constructor(el, vm) {
        // 判断传入el是否为节点,若不是节点则获取
        this.el = this.isElementNode(el) ? el : document.querySelector('#app');
        this.vm = vm;
        // 1. 获取文档碎片节点，放入内存中减少页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        // 2. 编译模板
        this.compile(fragment);
        // 3. 追加子元素到根元素
        this.el.appendChild(fragment);
    }
    compile(fragment) {
        // 1. 获取所有的子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                // 元素节点
                this.compileElement(child);
            } else {
                // 文本节点
                this.compileText(child);
            }
                // 判断子节点中是否还有节点 递归调用
            if (child.childNodes && child.childNodes.length) {
                this.compile(child);
            }
        });

    }
    // 解析元素节点
    compileElement(node) {
        const attributes = node.attributes;
        [...attributes].forEach((attr) => {
            const { name, value } = attr;
            if (!this.isDirective(name)) return;
            const [, directive] = name.split('-');
            const [dirName, eventName] = directive.split(':');
            // 更新数据 数据驱动视图（compileUtil为下个模块定义了更新数据的方法）
            compileUtil[dirName](node, value, this.vm, eventName);
            // 删除指令属性
            node.removeAttribute('v-' + directive);
        });
    }
    
    // 解析文本节点 
    compileText(node) {
        const content = node.textContent;
        // 匹配插值语法
        if (/\{\{.+?\}\}/.test(content)) {
        //（compileUtil为下个模块定义了更新数据的方法）
            compileUtil['text'](node, content, this.vm);
        }

    }
    // 判断是否是vue指令
    isDirective(name) {
        return name.startsWith('v-');
    }
    // 判断是否是节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
    // 把#app下所有的子节点放入文档碎片
    node2Fragment(el) {
        let firstChild;
        const f = document.createDocumentFragment();
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild);
        }
        return f;
    }

}


const compileUtil = {
    // 获取点式调用语法中的值    例如 a.b.c
    getVal(expr, vm) {
        return expr.split('.').reduce((p, c) => {
            return p[c];
        }, vm.$data);
    },
    // 处理v-text指令
    text(node, expr, vm) {
        let value;
        if (expr.indexOf('{{') !== -1) {
            value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                return this.getVal(args[1], vm);
            });
        } else {
            value = this.getVal(expr, vm);
        }
        this.updater.textUpdater(node, value);
    },
    // 处理v-html指令
    html(node, expr, vm) {
        const value = this.getVal(expr, vm);
        this.updater.htmlUpdater(node, value);
    },
    // 处理v-model指令
    model(node, expr, vm) {
        const value = this.getVal(expr, vm);
        this.updater.modelUpdater(node, value);
    },
    // 处理v-on指令
    on(node, expr, vm, eventName) {
        const value = this.getVal(expr, vm);
        this.updater.onUpdater(node, value, eventName);
    },
    // 处理v-bind指令
    bind(node, expr, vm, eventName) {
        const value = this.getVal(expr, vm);
        this.updater.bindUpdater(node, value, eventName);
    },
    
    // 操作原生dom的更新方法
    updater: {
        textUpdater(node, value) {
            node.textContent = value;
        },
        htmlUpdater(node, value) {
            node.innerHTML = value;
        },
        modelUpdater(node, value) {
            node.value = value;
        },
        onUpdater(node, value, eventName) {
            node.addevent;
        },
        bindUpdater(node, value, attrName) {
            node.setAttribute(attrName, value);
        },
    }
};



