import { reactive } from './core/reactivity/index.js'
import { h } from './core/h.js'

export default {
  render(context) {
    // const div = document.createElement('div')
    // div.innerText = context.state.count
    // return div
    return h('div', {
      class: 'red'
    }, [
      h('p', null, context.state.count),
      h('p', null, context.state.count * 2)
    ])
  },

  setup() {
    const state = reactive({
      count: 0
    })
    window.state = state
    return {
      state
    }
  }
}