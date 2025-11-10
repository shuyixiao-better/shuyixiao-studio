---
layout: doc
title: PandaCoder 周报浏览
description: 查看和管理你的 Git 周报
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('🚀 PandaCoder 周报页面已加载')
  console.log('📍 iframe URL: /api/pandacoder-proxy?type=frontend&path=/')
})


</script>

<template>
  <div class="pandacoder-weekly-container">
    <div class="page-header">
      <h1>🐼 PandaCoder 周报浏览</h1>
      <p class="description">查看和管理你的 Git 提交周报</p>
    </div>

    <ClientOnly>
      <div class="iframe-container">
        <iframe
          src="/api/pandacoder-proxy?type=frontend&path=/"
          style="width: 100%; height: 800px; border: none;"
          frameborder="0"
          allow="fullscreen"
        />
      </div>
      <template #fallback>
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载 PandaCoder 服务...</p>
        </div>
      </template>
    </ClientOnly>
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

