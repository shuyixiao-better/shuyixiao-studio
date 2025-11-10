---
layout: doc
title: PandaCoder 周报浏览
description: 查看和管理你的 Git 周报
---

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 状态管理
const loading = ref(true)
const error = ref(null)
const iframeUrl = ref('')
const iframeHeight = ref('800px')
const isServiceAvailable = ref(false)
const isMounted = ref(false)

// 检测当前部署环境
const detectEnvironment = () => {
  if (typeof window === 'undefined') return 'unknown'
  
  const hostname = window.location.hostname
  
  // GitHub Pages 域名
  if (hostname.includes('poeticcoder.cn') || hostname.includes('github.io')) {
    return 'github'
  }
  
  // Netlify 域名
  if (hostname.includes('poeticcoder.com') || 
      hostname.includes('shuyixiao.cn') ||
      hostname.includes('netlify.app')) {
    return 'netlify'
  }
  
  return 'unknown'
}

// 检查服务是否可用
const checkServiceAvailability = async () => {
  const env = detectEnvironment()

  // GitHub Pages 环境，显示跳转提示
  if (env === 'github') {
    isServiceAvailable.value = false
    loading.value = false
    error.value = 'github_redirect'
    return
  }

  try {
    // 直接尝试加载代理服务
    const response = await fetch('/api/pandacoder-proxy?type=frontend&path=/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })

    console.log('代理服务响应状态:', response.status)

    if (response.status === 503) {
      // 服务未配置
      try {
        const textResponse = await fetch('/api/pandacoder-proxy?type=frontend&path=/')
        const data = await textResponse.json()
        error.value = data.code === 'SERVICE_NOT_CONFIGURED'
          ? 'not_configured'
          : 'service_unavailable'
      } catch {
        error.value = 'not_configured'
      }
      isServiceAvailable.value = false
      loading.value = false
      return
    }

    if (response.status === 502) {
      // 无法连接到后端服务
      error.value = 'service_unavailable'
      isServiceAvailable.value = false
      loading.value = false
      return
    }

    // 任何其他状态都尝试显示 iframe
    isServiceAvailable.value = true
    iframeUrl.value = '/api/pandacoder-proxy?type=frontend&path=/'
    loading.value = false

  } catch (err) {
    console.error('Service check failed:', err)
    // 即使检查失败，也尝试显示 iframe
    isServiceAvailable.value = true
    iframeUrl.value = '/api/pandacoder-proxy?type=frontend&path=/'
    loading.value = false
  }
}

// 监听 iframe 消息（用于动态调整高度和错误）
const handleIframeMessage = (event) => {
  // 只接受来自我们代理的消息
  if (event.data && event.data.type === 'resize') {
    iframeHeight.value = event.data.height + 'px'
  }

  // 监听 iframe 加载错误
  if (event.data && event.data.type === 'error') {
    console.error('iframe 加载错误:', event.data.message)
    error.value = 'iframe_load_error'
    isServiceAvailable.value = false
  }
}

// 监听 iframe 加载事件
const handleIframeLoad = (event) => {
  console.log('✅ iframe 加载成功', event)
  console.log('iframe URL:', iframeUrl.value)
  loading.value = false
}

const handleIframeError = (event) => {
  console.error('❌ iframe 加载失败', event)
  error.value = 'iframe_load_error'
  isServiceAvailable.value = false
  loading.value = false
}

// 跳转到 Netlify 部署
const redirectToNetlify = () => {
  window.location.href = 'https://www.poeticcoder.com/tools/pandacoder-weekly/'
}

// 错误消息映射
const errorMessages = computed(() => {
  const messages = {
    github_redirect: {
      title: '功能限制提示',
      message: 'PandaCoder 周报功能需要后端服务支持，仅在 Netlify 部署环境可用。',
      action: '访问 Netlify 版本',
      showButton: true
    },
    not_configured: {
      title: '服务未配置',
      message: 'PandaCoder 服务尚未配置，请在 Netlify 环境变量中配置 PANDACODER_FRONTEND_URL 和 PANDACODER_BACKEND_URL。',
      action: '查看配置文档',
      showButton: false
    },
    service_unavailable: {
      title: '服务暂时不可用',
      message: 'PandaCoder 服务暂时无法访问，请稍后再试或联系管理员。',
      action: '重试',
      showButton: true
    },
    network_error: {
      title: '网络错误',
      message: '无法连接到 PandaCoder 服务，请检查网络连接。',
      action: '重试',
      showButton: true
    },
    iframe_load_error: {
      title: 'iframe 加载失败',
      message: 'PandaCoder 页面无法在 iframe 中加载，可能是由于浏览器安全策略限制。请尝试刷新页面或检查浏览器控制台获取详细错误信息。',
      action: '重试',
      showButton: true
    }
  }

  return messages[error.value] || messages.network_error
})

// 处理错误按钮点击
const handleErrorAction = () => {
  if (error.value === 'github_redirect') {
    redirectToNetlify()
  } else {
    // 重试
    loading.value = true
    error.value = null
    checkServiceAvailability()
  }
}

// 组件挂载时初始化
onMounted(() => {
  console.log('🚀 PandaCoder 周报页面加载')

  // 客户端渲染时设置 iframe URL
  iframeUrl.value = '/api/pandacoder-proxy?type=frontend&path=/'
  isServiceAvailable.value = true
  loading.value = false
  isMounted.value = true

  console.log('✅ iframe URL 已设置:', iframeUrl.value)

  window.addEventListener('message', handleIframeMessage)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<template>
  <div class="pandacoder-weekly-container">
    <div class="page-header">
      <h1>🐼 PandaCoder 周报浏览</h1>
      <p class="description">查看和管理你的 Git 提交周报</p>
    </div>

    <!-- 调试信息 (开发时可见) -->
    <div v-if="false" style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px; font-size: 12px;">
      <p><strong>调试信息:</strong></p>
      <p>loading: {{ loading }}</p>
      <p>error: {{ error }}</p>
      <p>isServiceAvailable: {{ isServiceAvailable }}</p>
      <p>iframeUrl: {{ iframeUrl }}</p>
      <p>environment: {{ detectEnvironment() }}</p>
    </div>

    <!-- 加载提示 -->
    <div v-if="!isMounted || loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载 PandaCoder 服务...</p>
    </div>

    <!-- iframe 内嵌 -->
    <div v-else-if="isMounted && iframeUrl" class="iframe-container">
      <iframe
        :src="iframeUrl"
        :style="{ height: iframeHeight }"
        frameborder="0"
        width="100%"
        allow="fullscreen"
        @load="handleIframeLoad"
        @error="handleIframeError"
      />
    </div>

    <!-- 错误提示 -->
    <div v-else class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>加载失败</h2>
      <p>无法加载 PandaCoder 服务，请刷新页面重试</p>
    </div>
  </div>
</template>

<style scoped>
.pandacoder-weekly-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  color: #666;
  font-size: 1.1rem;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误提示 */
.error-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-container h2 {
  color: #333;
  margin-bottom: 15px;
}

.error-container p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.action-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.config-hint {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.config-hint strong {
  color: #333;
}

.config-hint ol {
  margin: 15px 0;
  padding-left: 20px;
}

.config-hint li {
  margin: 10px 0;
  color: #555;
}

.config-hint code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  color: #d63384;
}

.config-hint ul {
  margin: 10px 0;
  padding-left: 20px;
}

/* iframe 容器 */
.iframe-container {
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  background: #fff;
}

.iframe-container iframe {
  width: 100%;
  min-height: 600px;
  border: none;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .error-container {
    padding: 30px 20px;
  }

  .config-hint {
    padding: 15px;
  }
}

/* 暗色模式适配 */
.dark .error-container {
  background: #1e1e1e;
  color: #e0e0e0;
}

.dark .error-container h2 {
  color: #e0e0e0;
}

.dark .error-container p {
  color: #b0b0b0;
}

.dark .config-hint {
  background: #2a2a2a;
}

.dark .config-hint code {
  background: #3a3a3a;
  color: #ff6b9d;
}

.dark .iframe-container {
  background: #1e1e1e;
}
</style>

