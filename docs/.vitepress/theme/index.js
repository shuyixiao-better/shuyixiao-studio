// .vitepress/theme/index.js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import NotFound from './NotFound.vue'

export default {
  extends: DefaultTheme,
  // 通过 Layout 的 not-found 插槽接管 404
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 可在此注册全局组件
  }
}
