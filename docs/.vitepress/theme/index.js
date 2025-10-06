// .vitepress/theme/index.js
import { h } from 'vue'
import { onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
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
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 确保只在客户端运行
      if (typeof window === 'undefined') return
      
      // 动态导入 medium-zoom，避免 SSR 问题
      import('medium-zoom').then(({ default: mediumZoom }) => {
        // 使用 nextTick 确保 DOM 已经更新
        nextTick(() => {
          // 为所有文档中的图片（排除首页的图片）添加缩放功能
          mediumZoom('.main img:not(.no-zoom)', {
            background: 'rgba(0, 0, 0, 0.8)',
            margin: 48,
            scrollOffset: 40
          })
        })
      }).catch(err => {
        console.warn('Failed to load medium-zoom:', err)
      })
    }
    
    onMounted(() => {
      initZoom()
    })
    
    // 监听路由变化，重新初始化缩放功能
    watch(
      () => route.path,
      () => nextTick(() => initZoom()),
      { immediate: true }
    )
  }
}
