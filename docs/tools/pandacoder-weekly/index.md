---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
---

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const frontendUrl = ref('/api/pandacoder-proxy?type=frontend&path=/')
const showRedirect = ref(false)
const netlifyUrl = 'https://www.poeticcoder.com/tools/pandacoder-weekly/'

// 检测当前环境
const isGitHubPages = computed(() => {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname.includes('poeticcoder.cn') || hostname.includes('github.io')
})

// 隐藏页面中的遮罩元素
const hideAsideCurtain = () => {
  // 移除当前页面的遮罩元素
  const curtains = document.querySelectorAll('.aside-curtain, [class*="aside-curtain"], [data-v-3a82ddb3]')
  curtains.forEach(curtain => {
    if (curtain.classList.contains('aside-curtain') || 
        curtain.className.includes('aside-curtain')) {
      curtain.remove()
      console.log('✅ 已移除页面遮罩元素')
    }
  })
  
  // 尝试隐藏 iframe 中的遮罩元素
  const iframe = document.querySelector('.pandacoder-container iframe')
  if (iframe && iframe.contentWindow) {
    try {
      const iframeDoc = iframe.contentWindow.document
      const asideCurtain = iframeDoc.querySelector('.aside-curtain')
      if (asideCurtain) {
        asideCurtain.style.display = 'none'
        asideCurtain.style.visibility = 'hidden'
        asideCurtain.style.opacity = '0'
        console.log('✅ 已隐藏 iframe 中的遮罩元素')
      }
    } catch (e) {
      // 跨域限制，无法直接操作 iframe 内容
      console.log('⚠️ 无法直接操作 iframe 内容（跨域限制）')
    }
  }
}

// 持续监听并移除遮罩元素
const observeCurtain = () => {
  const observer = new MutationObserver(() => {
    hideAsideCurtain()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  return observer
}

onMounted(() => {
  console.log('🐼 PandaCoder 周报页面加载')
  console.log('📍 当前域名:', window.location.hostname)
  
  // 如果是 GitHub Pages 环境，显示跳转提示
  if (isGitHubPages.value) {
    showRedirect.value = true
    console.log('⚠️ 检测到 GitHub Pages 环境，显示跳转提示')
  } else {
    console.log('✅ 检测到 Netlify 环境，正常加载')
    
    // 在 Netlify 环境中，取消注册可能存在的 Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          // 如果注册了 pandacoder-proxy-sw，取消注册
          if (registration.scope.includes('pandacoder-proxy-sw') || 
              registration.active?.scriptURL?.includes('pandacoder-proxy-sw')) {
            console.log('🗑️ 取消注册 Service Worker:', registration.scope)
            registration.unregister().then(success => {
              if (success) {
                console.log('✅ Service Worker 已取消注册')
              }
            })
          }
        })
      })
    }
    
    // 立即移除遮罩元素
    hideAsideCurtain()
    
    // 启动持续监听
    const observer = observeCurtain()
    
    // 延迟尝试隐藏遮罩元素
    nextTick(() => {
      setTimeout(hideAsideCurtain, 500)
      setTimeout(hideAsideCurtain, 1000)
      setTimeout(hideAsideCurtain, 2000)
    })
  }
})

const handleRedirect = () => {
  window.location.href = netlifyUrl
}

// 监听 iframe 加载完成事件
onMounted(() => {
  const iframe = document.querySelector('.pandacoder-container iframe')
  if (iframe) {
    iframe.addEventListener('load', hideAsideCurtain)
  }
})

// 监听来自 iframe 的消息（处理token过期等事件）
const handleMessage = (event) => {
  // 安全检查：验证消息来源
  if (event.origin !== window.location.origin && 
      !event.origin.includes('poeticcoder.com') && 
      !event.origin.includes('poeticcoder.cn')) {
    return
  }
  
  if (event.data && event.data.type === 'TOKEN_EXPIRED') {
    console.log('🔒 接收到token过期消息:', event.data.path)
    
    // 可以在这里添加更多的用户提示
    // 例如显示一个toast或者modal
    console.log('🔧 正在处理token过期...')
    
    // 重新加载iframe以触发登录流程
    const iframe = document.querySelector('.pandacoder-container iframe')
    if (iframe) {
      iframe.src = iframe.src // 重新加载iframe
    }
  }
}

// 添加消息监听器
window.addEventListener('message', handleMessage)

// 在组件卸载时移除消息监听器
onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <!-- GitHub Pages 环境：显示跳转提示 -->
  <div v-if="showRedirect" class="redirect-container">
    <div class="redirect-card">
      <div class="redirect-icon">🐼</div>
      <h1 class="redirect-title">PandaCoder 周报功能</h1>
      <p class="redirect-message">
        当前页面部署在 GitHub Pages 环境，该功能需要在 Netlify 环境中使用。
      </p>
      <p class="redirect-hint">
        请访问 Netlify 部署版本以获得完整功能体验：
      </p>
      <div class="redirect-url">
        <a :href="netlifyUrl" class="redirect-link">{{ netlifyUrl }}</a>
      </div>
      <button @click="handleRedirect" class="redirect-button">
        立即跳转到主域名版本
      </button>
    </div>
  </div>

  <!-- Netlify 环境：正常显示 iframe -->
  <div v-else class="pandacoder-container">
    <iframe
      :src="frontendUrl"
      frameborder="0"
      allowfullscreen
      allow="clipboard-read; clipboard-write"
    />
  </div>
</template>

<style scoped>
/* 跳转提示样式 */
.redirect-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.redirect-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.redirect-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.redirect-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.redirect-message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.redirect-hint {
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
}

.redirect-url {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.redirect-link {
  color: #667eea;
  text-decoration: none;
  font-size: 16px;
  word-break: break-all;
  transition: color 0.3s;
}

.redirect-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.redirect-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.redirect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.redirect-button:active {
  transform: translateY(0);
}

/* iframe 容器样式 */
.pandacoder-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
}

.pandacoder-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .redirect-card {
    background: #1e1e1e;
  }

  .redirect-title {
    color: #fff;
  }

  .redirect-message {
    color: #ccc;
  }

  .redirect-hint {
    color: #999;
  }

  .redirect-url {
    background: #2a2a2a;
  }

  .pandacoder-container {
    background: #1e1e1e;
  }
}

/* iframe 容器样式 */
.pandacoder-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
}

.pandacoder-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 强制隐藏所有 aside-curtain 遮罩 */
.aside-curtain,
div.aside-curtain,
[class*="aside-curtain"],
[data-v-3a82ddb3].aside-curtain,
.aside-curtain[data-v-3a82ddb3] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  z-index: -9999 !important;
  width: 0 !important;
  height: 0 !important;
}
</style>



