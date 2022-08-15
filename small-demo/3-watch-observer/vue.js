import Watcher from "./Watcher.js";
import {observe} from "./functions.js";

export default class Vue {
    constructor(options = {}) {
        this.$options = options;
        let data = this.$data = this.$options.data;
        Object.keys(data).forEach(key => this._proxy(key));
        observe(data);
    }

    $watch(expOrFn, cb) {
        new Watcher(this, expOrFn, cb);
    }

    _proxy(key) {
        const self = this;
        Object.defineProperty(self, key, {
            enumerable: true,
            configurable: true,
            get: function proxyGetter() {
                return self.$data[key];
            },
            set: function proxySetter(newVal) {
                self.$data[key] = newVal;
            }
        })
    }
}