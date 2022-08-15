import {defineReactive} from "./functions.js";

export default class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }

    walk(value) {
        Object.keys(value).forEach(key => {
            this.convert(key, value[key]);
        })
    }

    convert(key, val) {
        defineReactive(this.value, key, val);
    }
}