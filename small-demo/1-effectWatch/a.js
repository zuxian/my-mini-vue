

//  ********************************************************
// 当a变更时，命令式的通过一个赋值表达式更新b的值

// let a = 10
// let b = a + 10
// console.log(b)
// a = 20
// b = a + 10
// console.log(b)


//  ********************************************************
//  每次变量变更都手动调用update()

// let a = 10
// let b
// function update() {
//     b = a + 10
//     console.log(b)
// }
// update()
// b = 20
// update()



//  ********************** reactivity响应式实现 **********************************

const { reactive, effect } = require('@vue/reactivity')

let a = reactive({
  value: 10
})
let b
effect(() => {
  b = a.value + 10
  console.log(b)
})
a.value = 20



