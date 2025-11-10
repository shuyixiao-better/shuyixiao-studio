---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
---

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const frontendUrl = ref('/api/pandacoder-proxy?type=frontend&path=/')
const loading = ref(true)
const error = ref(null)
const iframeKey = ref(0)

let loadingTimer = null

onMounted(() => {
  console.log('🐼 PandaCoder 周报页面初始化')
  console.log('📍 代理地址:', frontendUrl.value)

  // 3秒后自动隐藏加载动画（即使 iframe 没触发 load 事件）
  loadingTimer = setTimeout(() => {
    if (loading.value) {
      console.log('⏰ 加载超时，自动显示内容')
      loading.value = false
    }
  }, 3000)
})

onBeforeUnmount(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})

const handleLoad = () => {
  console.log('✅ iframe 加载完成')
  loading.value = false
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
}

const handleError = (e) => {
  console.error('❌ iframe 加载失败:', e)
  loading.value = false
  error.value = true
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
}

const retry = () => {
  console.log('🔄 重新加载...')
  error.value = null
  loading.value = true
  iframeKey.value++

  // 重新设置超时
  loadingTimer = setTimeout(() => {
    if (loading.value) {
      loading.value = false
    }
  }, 3000)
}
</script>

<template>
  <div class="pandacoder-container">
    <!-- 简洁的加载动画 -->
    <Transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    </Transition>

    <!-- 错误提示 -->
    <Transition name="fade">
      <div v-if="error" class="error-overlay">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>无法连接到 PandaCoder 周报服务</p>
          <button @click="retry" class="retry-btn">重试</button>
        </div>
      </div>
    </Transition>

    <!-- iframe 容器 -->
    <div class="iframe-wrapper">
      <iframe
        :key="iframeKey"
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
  background: #f8f9fa;
}

/* 加载动画 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 错误提示 */
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
}

.error-content {
  text-align: center;
  padding: 40px;
  max-width: 400px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-content h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 8px 0;
}

.error-content p {
  color: #666;
  font-size: 14px;
  margin: 0 0 24px 0;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.retry-btn:active {
  transform: translateY(0);
}

/* iframe 容器 */
.iframe-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.iframe-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: white;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>



