export function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        enumerable: !!enumerable,
        value,
        writable: true,
        configurable: true
    })
}

export function define(obj, key, value) {
    Object.defineProperty(obj, key, {
        enumerable: false,
        value,
        writable: true,
        configurable: true
    })
}

export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}