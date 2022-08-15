import Vue from './vue.js';

const vm = new Vue({
    data: {
        a: 1,
        b: {
            c: 2
        }
    }
});

vm.$watch('a', () => console.log(`a当前的值为:${vm.a}`));

setTimeout(() => {
    vm.a = 3;
}, 2000);


setTimeout(() => {
    vm.a = 15;
}, 5000);


// var obj = {};
// Object.defineProperty(obj, 'name', {
//     get: function() {
//         return '获取值：zhangsan';
//     },
//     set: function (newVal) {
//         console.log('设置值:' + newVal);
//         return newVal;
//     }
// });
// obj.name = 'lisi';

