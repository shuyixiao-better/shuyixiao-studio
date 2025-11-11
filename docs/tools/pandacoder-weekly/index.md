---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
---

<script setup>
import { ref, onMounted } from 'vue'

const frontendUrl = ref('/api/pandacoder-proxy?type=frontend&path=/')

onMounted(() => {
  console.log('🐼 PandaCoder 周报页面加载')
  console.log('📍 代理地址:', frontendUrl.value)
  
  // 注册 Service Worker（用于 GitHub Pages 环境）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/pandacoder-proxy-sw.js')
        .then(registration => {
          console.log('🐼 PandaCoder Service Worker 注册成功:', registration.scope)
        })
        .catch(error => {
          console.warn('⚠️ PandaCoder Service Worker 注册失败（可能是在 Netlify 环境）:', error)
        })
    })
  }
})
</script>

<template>
  <div class="pandacoder-container">
    <iframe
      :src="frontendUrl"
      frameborder="0"
      allowfullscreen
      allow="clipboard-read; clipboard-write"
    />
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
  background: #ffffff;
}

.pandacoder-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>



