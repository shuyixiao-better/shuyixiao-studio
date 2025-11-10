---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
---

<script setup>
import { ref, onMounted } from 'vue'

const frontendUrl = ref('/api/pandacoder-proxy?type=frontend&path=/')
const loading = ref(true)
const error = ref(null)
const loadProgress = ref(0)

let progressInterval = null

onMounted(() => {
  console.log('🐼 PandaCoder 周报页面初始化')
  console.log('📍 代理地址:', frontendUrl.value)

  // 模拟加载进度
  progressInterval = setInterval(() => {
    if (loadProgress.value < 90) {
      loadProgress.value += Math.random() * 10
    }
  }, 200)

  // 超时检测
  setTimeout(() => {
    if (loading.value) {
      console.warn('⚠️ 加载超时，但继续等待...')
    }
  }, 10000)
})

const handleLoad = () => {
  console.log('✅ iframe 加载成功')
  loadProgress.value = 100
  setTimeout(() => {
    loading.value = false
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  }, 300)
}

const handleError = (e) => {
  console.error('❌ iframe 加载失败:', e)
  loading.value = false
  error.value = '加载失败'
  if (progressInterval) {
    clearInterval(progressInterval)
  }
}

const retry = () => {
  console.log('🔄 重新加载...')
  error.value = null
  loading.value = true
  loadProgress.value = 0
  // 强制刷新 iframe
  const iframe = document.querySelector('.iframe-wrapper iframe')
  if (iframe) {
    iframe.src = iframe.src
  }
}
</script>

<template>
  <div class="pandacoder-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="panda-icon">🐼</div>
        <h2>正在加载 PandaCoder 周报...</h2>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadProgress + '%' }"></div>
        </div>
        <p class="loading-tip">{{ Math.round(loadProgress) }}%</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error && !loading" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h2>加载失败</h2>
        <p>无法连接到 PandaCoder 周报服务</p>
        <div class="error-details">
          <p>可能的原因：</p>
          <ul>
            <li>后端服务未启动</li>
            <li>网络连接问题</li>
            <li>Netlify 环境变量未配置</li>
          </ul>
        </div>
        <button @click="retry" class="retry-btn">🔄 重试</button>
      </div>
    </div>

    <!-- iframe 容器 -->
    <div class="iframe-wrapper" :class="{ 'iframe-loaded': !loading && !error }">
      <iframe
        :src="frontendUrl"
        @load="handleLoad"
        @error="handleError"
        frameborder="0"
        allowfullscreen
        allow="clipboard-read; clipboard-write"
      />
    </div>
  </div>
</template>

<style scoped>
.pandacoder-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f5f7fa;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in;
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 40px;
}

.panda-icon {
  font-size: 80px;
  animation: bounce 1s infinite;
  margin-bottom: 20px;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.loading-content h2 {
  font-size: 24px;
  margin: 20px 0;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.loading-tip {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 10px;
}

/* 错误状态 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in;
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.error-content h2 {
  font-size: 28px;
  color: #e74c3c;
  margin: 20px 0;
}

.error-content > p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.error-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.error-details p {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.error-details ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.error-details li {
  margin: 8px 0;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 24px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 20px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

/* iframe 容器 */
.iframe-wrapper {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.iframe-wrapper.iframe-loaded {
  opacity: 1;
}

.iframe-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>



