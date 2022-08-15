import { effectWatch } from './reactivity/index.js'
import { mountElement, diff } from './renderer/index.js'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup()
      effectWatch(() => {
        rootContainer.innerHTML = ''
        // 标志位，初始化时是false，初始化完成变成true
        let isMounted = false
        // 初始化和后续每一次diff完成后都把这次的VNode记录下来作为下一次diff的oldVnode
        let prevSubTree
        if (!isMounted) {
          // 第一次,初始化
          isMounted = true
          const subTree = rootComponent.render(context)
          mountElement(subTree, rootContainer)
          prevSubTree = subTree
        } else {
          // 第一次以后的更新
          const subTree = rootComponent.render(context)
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        }
      })
    }
  }
}

// 在createApp的mount()阶段，通过维护一个标志位来判断是否是初始化，是就执行mountElement()，不是就执行diff()。
// 需要注意：不管是不是初始化，都把这一次的VNode保存下来，作为一下次diff()操作的老的VNode

// 浏览器打印  state.count++
