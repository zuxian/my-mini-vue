import {remove} from "./utils.js";

export default class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        remove(this.subs, sub);
    }

    depend() {
        if(Dep.target) {
            Dep.target.addDep(this);
        }
    }

    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

Dep.target = null;