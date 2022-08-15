import Dep from "./dep.js";

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.vm = vm;
        this.value = this.get();
    }

    get() {
        Dep.target = this;
        const value = this.vm.$data[this.expOrFn];
        Dep.target = null;
        return value;
    }

    update() {
        this.run();
    }

    addDep(dep) {
        dep.addSub(this);
    }

    run() {
        const value = this.get();
        if (value !== this.value) {
            this.value = value;
            this.cb.call(this.vm);
        }
    }
}