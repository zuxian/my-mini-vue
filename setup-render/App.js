import { reactive } from './core/reactivity/index.js'
export default {
  render(context) {
    const div = document.createElement('div')
    div.innerText = context.state.count
    return div
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