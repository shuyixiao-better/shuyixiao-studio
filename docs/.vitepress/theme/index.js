// .vitepress/theme/index.js
import { h } from 'vue'
import { onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import './custom.css'
import NotFound from './NotFound.vue'
import RecentPosts from './components/RecentPosts.vue'
import ArticleList from './components/ArticleList.vue'
import JobsQuotes from './components/JobsQuotes.vue'

export default {
  extends: DefaultTheme,
  // 通过 Layout 的 not-found 插槽接管 404
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('RecentPosts', RecentPosts)
    app.component('ArticleList', ArticleList)
    app.component('JobsQuotes', JobsQuotes)
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
          const zoom = mediumZoom('.main img:not(.no-zoom)', {
            background: 'rgba(0, 0, 0, 0.8)',
            margin: 48,
            scrollOffset: 40
          })
          
          // 强制设置光标样式的辅助函数
          const setCursor = (img, cursorType) => {
            if (img) {
              img.style.cursor = cursorType
              img.style.setProperty('cursor', cursorType, 'important')
            }
          }
          
          // 监听缩放事件，确保光标样式正确
          zoom.on('open', (event) => {
            // 图片放大时，设置缩小光标
            const img = event.target
            setCursor(img, 'zoom-out')
            img.classList.add('medium-zoom-image--opened')
          })
          
          zoom.on('close', (event) => {
            // 图片关闭时，恢复放大光标
            const img = event.target
            img.classList.remove('medium-zoom-image--opened')
            setCursor(img, 'zoom-in')
          })
          
          // 监听缩放状态变化，确保光标始终正确
          zoom.on('opened', (event) => {
            const img = event.target
            setCursor(img, 'zoom-out')
            img.classList.add('medium-zoom-image--opened')
          })
          
          zoom.on('closed', (event) => {
            const img = event.target
            img.classList.remove('medium-zoom-image--opened')
            // 使用 setTimeout 确保在 DOM 更新后应用样式
            setTimeout(() => {
              setCursor(img, 'zoom-in')
            }, 10)
          })
          
          // 添加鼠标悬停事件监听，确保光标状态正确
          document.addEventListener('mouseover', (event) => {
            if (event.target && event.target.matches('.main img:not(.no-zoom)')) {
              const img = event.target
              if (!img.classList.contains('medium-zoom-image--opened')) {
                setCursor(img, 'zoom-in')
              }
            }
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
