// Vue3宣布已不在内置 $on $emit $off $once API,  EventBus已经取消

// $on方法用来在vm实例上监听一个自定义事件，该事件可用$emit触发。
// $emit用来触发指定的自定义事件。
// $once监听一个只能触发一次的事件，在触发以后会自动移除该事件。
// $off用来移除自定义事件

class EventBus {
    constructor() {
        this.eventMap = new Map()
    }

    $on(key, cb) {
        let handlers = this.eventMap.get(key)
        if (!handlers) {
            handlers = []
        }
        handlers.push(cb)
        this.eventMap.set(key, handlers)
    }

    $off(key, cb) {
        const handlers = this.eventMap.get(key)
        
        if (!handlers) return
        if (cb) {
            const idx = handlers.indexOf(cb)
            console.log('----源码---$off--', idx)
            idx > -1 && handlers.splice(idx, 1)
            this.eventMap.set(key, handlers)
        } else {
            this.eventMap.delete(key)
        }
    }

    $once(key, cb) {
        const handlers = [(payload) => {
            cb(payload)
            this.$off(key)
        }]
        this.eventMap.set(key, handlers)
    }

    $emit(key, payload) {
        const handlers = this.eventMap.get(key)
        if (!Array.isArray(handlers)) return
        handlers.forEach(handler => {
            handler(payload)
        })
    }
}


//  ************************************************************************************************
//  ************************************************************************************************

// 事件总线，全局单例
const bus = new EventBus()

export function useEventBus() {
    let instance = {
        eventMap: new Map(),
        // 复用eventBus事件收集相关逻辑
        $on: bus.$on,
        $once: bus.$once,
        // 清空eventMap
        $clear() {
            this.eventMap.forEach((list, key) => {
                list.forEach(cb => {
                    bus.$off(key, cb)
                })
            })
            eventMap.clear()
        }
    }
    let eventMap = new Map()
    // 劫持两个监听方法，收集当前组件对应的事件
    const $on = (key, cb) => {
        instance.$on(key, cb)  // 如果这一行注释掉了，则Bus.$clear()则不起作用
        bus.$on(key, cb)
    }
    const $once = (key, cb) => {
        instance.$once(key, cb)
        bus.$once(key, cb)
    }
    const $clear = () => {
        instance.$clear()
    }

    // // 组件卸载时取消相关的事件
    // onUnmounted(() => {
    //     instance.$clear()
    // })

    return {
        $on,
        $once,
        $clear,
        $off: bus.$off.bind(bus),
        $emit: bus.$emit.bind(bus)
    }
}



//  ************************************************************************************************
//  ************************************************************************************************


// var eventStack = {};

// function $on(eventName, callBack) {
//   if (eventStack[eventName]) {
//     eventStack[eventName].callBacks.push(callBack);
//     callBack(eventStack[eventName].value);
//   } else {
//     console.error("该接口未注册,请先通过emit方法注册接口,再来监听");
//   }
// }

// function $emit(eventName, value) {
//   if (eventStack[eventName] && eventStack[eventName].callBacks.length) {
//     eventStack[eventName].value = value;
//     eventStack[eventName].callBacks.forEach(function (callBack) {
//       callBack(value);
//     });
//   } else {
//     eventStack[eventName] = {
//       value,
//       callBacks: [],
//     };
//   }
// }

// var eventBus = {
//   $emit,
//   $on,
// };

// export function useEventBus() {
//   return eventBus;
// }



