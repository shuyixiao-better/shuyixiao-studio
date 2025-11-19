// .vitepress/theme/index.js
import { h, createApp } from 'vue'
import { onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import './custom.css'
import fontLoader from './font-loader'  // 切换回本地方案（解决 CORS 问题）
import NotFound from './NotFound.vue'
import RecentPosts from './components/RecentPosts.vue'
import ArticleList from './components/ArticleList.vue'
import JobsQuotes from './components/JobsQuotes.vue'
import SiteRuntime from './components/SiteRuntime.vue'
import FeaturedTools from './components/FeaturedTools.vue'
import PasswordProtect from './components/PasswordProtect.vue'
import ArticleStats from './components/ArticleStats.vue'
import SiteVisits from './components/SiteVisits.vue'
import BilibiliVideo from './components/BilibiliVideo.vue'
import WinningMindset from './components/WinningMindset.vue'
import PremiumRecommend from './components/PremiumRecommend.vue'
import FeedbackWidget from './components/FeedbackWidget.vue'
import ConsumerCopilot from './components/ConsumerCopilot.vue'
import RSSFeedCard from './components/RSSFeedCard.vue'
import UpdateNotification from './components/UpdateNotification.vue'
import TechPhilosophy from './components/TechPhilosophy.vue'
import Comments from './components/Comments.vue'
import CommentsPlaceholder from './components/CommentsPlaceholder.vue'
import EasterEgg from './components/EasterEgg.vue'

export default {
  extends: DefaultTheme,
  // 通过 Layout 插槽自定义布局
  Layout() {
    // 检测是否为 Netlify 环境（支持评论功能）
    const isNetlify = typeof window !== 'undefined' && 
      (window.location.hostname.includes('netlify') || 
       window.location.hostname === 'www.poeticcoder.com' ||
       window.location.hostname === 'localhost');
    
    return h(DefaultTheme.Layout, null, {
      // 404 页面
      'not-found': () => h(NotFound),
      // 文档内容顶部（标题后，目录前）自动插入统计组件
      'doc-top': () => h(ArticleStats),
      // 文档内容底部添加评论组件（根据环境选择）
      'doc-after': () => isNetlify ? h(Comments) : h(CommentsPlaceholder),
      // 在布局底部添加反馈组件和彩蛋（全局可见）
      'layout-bottom': () => [h(FeedbackWidget), h(EasterEgg)],
      // 在布局顶部添加更新通知组件（全局可见）
      'layout-top': () => h(UpdateNotification)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('RecentPosts', RecentPosts)
    app.component('ArticleList', ArticleList)
    app.component('JobsQuotes', JobsQuotes)
    app.component('SiteRuntime', SiteRuntime)
    app.component('FeaturedTools', FeaturedTools)
    app.component('PasswordProtect', PasswordProtect)
    app.component('ArticleStats', ArticleStats)
    app.component('SiteVisits', SiteVisits)
    app.component('BilibiliVideo', BilibiliVideo)
    app.component('WinningMindset', WinningMindset)
    app.component('PremiumRecommend', PremiumRecommend)
    app.component('FeedbackWidget', FeedbackWidget)
    app.component('ConsumerCopilot', ConsumerCopilot)
    app.component('RSSFeedCard', RSSFeedCard)
    app.component('UpdateNotification', UpdateNotification)
    app.component('TechPhilosophy', TechPhilosophy)
    app.component('Comments', Comments)
    app.component('CommentsPlaceholder', CommentsPlaceholder)
    app.component('EasterEgg', EasterEgg)
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
    
    const initMermaidZoom = () => {
      // 确保只在客户端运行
      if (typeof window === 'undefined') return
      
      nextTick(() => {
        // 等待 Mermaid 图表渲染完成
        setTimeout(() => {
          // 查找所有 Mermaid 图表的 SVG 元素
          const mermaidContainers = document.querySelectorAll('.vp-doc [class*="mermaid"]')
          
          mermaidContainers.forEach(container => {
            const svg = container.querySelector('svg')
            if (!svg || svg.classList.contains('mermaid-zoom-enabled')) return
            
            // 标记已处理
            svg.classList.add('mermaid-zoom-enabled')
            
            // 设置初始样式
            svg.style.cursor = 'zoom-in'
            svg.style.maxWidth = '100%'
            svg.style.height = 'auto'
            svg.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'
            
            // 点击事件 - 创建自定义全屏查看器
            svg.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()
              
              // 创建遮罩层
              const overlay = document.createElement('div')
              overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: zoom-out;
                padding: 48px;
              `
              
              // 克隆 SVG
              const svgClone = svg.cloneNode(true)
              svgClone.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                width: auto;
                height: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                cursor: zoom-out;
              `
              
              // 添加到遮罩层
              overlay.appendChild(svgClone)
              document.body.appendChild(overlay)
              
              // 禁止body滚动
              document.body.style.overflow = 'hidden'
              
              // 关闭函数
              const closeOverlay = () => {
                if (document.body.contains(overlay)) {
                  document.body.removeChild(overlay)
                  document.body.style.overflow = ''
                }
              }
              
              // 点击关闭
              overlay.addEventListener('click', closeOverlay)
              
              // ESC键关闭
              const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                  closeOverlay()
                  document.removeEventListener('keydown', handleKeyDown)
                }
              }
              document.addEventListener('keydown', handleKeyDown)
            })
            
            // 悬停效果
            svg.addEventListener('mouseenter', () => {
              svg.style.transform = 'scale(1.02)'
              svg.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
            })
            
            svg.addEventListener('mouseleave', () => {
              svg.style.transform = 'scale(1)'
              svg.style.boxShadow = 'none'
            })
          })
          
          console.log('Mermaid zoom initialized, found containers:', mermaidContainers.length)
        }, 1000)
      })
    }
    
    // 初始化网站运行时间统计
    let runtimeTimer = null
    const initSiteRuntime = () => {
      if (typeof window === 'undefined') return
      
      const startDate = new Date('2025-09-17T00:00:00')
      
      const updateRuntime = () => {
        const element = document.getElementById('site-runtime')
        if (!element) return
        
        const now = new Date()
        const diff = now - startDate
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        element.textContent = `| 本站运行：${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`
      }
      
      // 避免重复创建定时器
      if (!runtimeTimer) {
        // 初始更新
        setTimeout(() => {
          updateRuntime()
          // 每秒更新一次
          runtimeTimer = setInterval(updateRuntime, 1000)
        }, 100)
      }
    }
    
    // 初始化访问量统计显示
    let siteVisitsApp = null
    const initSiteVisitsDisplay = () => {
      if (typeof window === 'undefined') return
      
      nextTick(() => {
        const container = document.getElementById('site-visits-container')
        if (!container) return
        
        // 避免重复挂载
        if (siteVisitsApp) {
          siteVisitsApp.unmount()
        }
        
        // 清空容器
        container.innerHTML = ''
        
        // 创建并挂载 SiteVisits 组件
        siteVisitsApp = createApp(SiteVisits)
        siteVisitsApp.mount(container)
      })
    }
    
    onMounted(() => {
      initZoom()
      initMermaidZoom()
      initSiteRuntime()
      initSiteVisitsDisplay()
      
      // 初始化字体加载器（已在 font-loader.ts 中自动初始化）
      // 可选：在控制台显示字体加载状态
      if (import.meta.env.DEV) {
        setTimeout(() => {
          const status = fontLoader.getLoadStatus()
          console.log('🎨 HarmonyOS Fonts Status:', status)
        }, 2000)
      }
    })
    
    // 监听路由变化，重新初始化缩放功能和运行时间
    watch(
      () => route.path,
      () => nextTick(() => {
        initZoom()
        initMermaidZoom()
        initSiteRuntime()
        initSiteVisitsDisplay()
      }),
      { immediate: true }
    )
  }
}
