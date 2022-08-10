
//  https://juejin.cn/post/6890781300648017934

import { useEventBus } from './eventBus.js';
const Bus = useEventBus();

const watchOnFun = (val)=>{
    //此处监听 do some thing
    console.log('---EventBus--on---onefun---', val)
}

const watchOnFunTwo = (val)=>{
    //此处监听 do some thing
    console.log('---EventBus--on---twofun---', val)
}

const watchOffFun = (val)=>{
    //此处监听 do some thing
    console.log('---EventBus--off------', val)
}

Bus.$on('num', watchOnFun)

Bus.$on('num', watchOnFunTwo)

// Bus.$once('num',(val)=>{
//     //此处监听 do some thing
//     console.log('---EventBus--once------', val)
// })

Bus.$emit('num', 'fuzuxian');

Bus.$emit('num', 20);

Bus.$clear()

// Bus.$off('num', watchOnFun)

Bus.$emit('num', 30);


