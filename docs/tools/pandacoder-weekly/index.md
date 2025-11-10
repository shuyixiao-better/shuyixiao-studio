---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
---

<script setup>
import { ref, onMounted } from 'vue'

// 从环境变量读取前端地址，如果没有则使用默认值
const frontendUrl = ref('')
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  // 这里直接使用配置的前端地址
  frontendUrl.value = '/api/pandacoder-proxy?type=frontend&path=/'
  console.log('🐼 PandaCoder 周报页面加载')
  console.log('📍 前端地址:', frontendUrl.value)
})

const handleLoad = () => {
  loading.value = false
  console.log('✅ iframe 加载成功')
}

const handleError = (e) => {
  loading.value = false
  error.value = 'iframe 加载失败，请检查配置'
  console.error('❌ iframe 加载失败:', e)
}
</script>

<template>
  <div class="pandacoder-container">
    <h1>🐼 PandaCoder 周报浏览</h1>

    <div v-if="loading" class="loading">
      <p>正在加载周报...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <p>请联系管理员检查 Netlify 环境变量配置</p>
    </div>

    <div class="iframe-wrapper">
      <iframe
        :src="frontendUrl"
        @load="handleLoad"
        @error="handleError"
        frameborder="0"
        allowfullscreen
      />
    </div>
  </div>
</template>

<style scoped>
.pandacoder-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.pandacoder-container h1 {
  text-align: center;
  padding: 20px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #e74c3c;
  background: #fee;
}

.iframe-wrapper {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.iframe-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>



