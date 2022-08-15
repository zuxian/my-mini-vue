import Observer from './observer.js'
import Dep from "./dep.js";

export function defineReactive(obj, key, val) {
    let childObj = observe(val);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set(newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            childObj = observe(newVal);
            dep.notify();
        }
    })
}

export function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return (new Observer(value));
}