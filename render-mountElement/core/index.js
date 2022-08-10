import { effectWatch } from './reactivity/index.js'
import { mountElement } from './renderer/index.js'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup()
      effectWatch(() => {
        rootContainer.innerHTML = ''
        // const element = rootComponent.render(context)
        // rootContainer.appendChild(element)
        // 当数据发生变更时，rootContainer下的dom是被全量替换的，即使实际发生变更的可能只是其中某个节点或某个属性。
        // 在控制台Element面板中也可以看到整个节点销毁到生成一闪而过的现象。要解决这个问题就要用到diff算法了
        const subTree = rootComponent.render(context)
        mountElement(subTree, rootContainer)
      })
    }
  }
}