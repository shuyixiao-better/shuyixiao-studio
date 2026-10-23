---
layout: doc
title: PandaCoder 测试页面
description: 测试 iframe 内嵌功能
date: '2025-12-25'
---

<script setup>
import { ref, onMounted } from 'vue'
import { hasBackend } from '../.vitepress/theme/utils/deploy-env.js'
const backend = ref(false)
const ready = ref(false)

const iframeUrl = ref('/api/pandacoder-proxy?type=frontend&path=/')
const loading = ref(true)
const error = ref(null)

const handleLoad = () => {
  loading.value = false
  console.log('✅ iframe 加载成功')
}

const handleError = (e) => {
  loading.value = false
  error.value = '加载失败'
  console.error('❌ iframe 加载失败', e)
}

onMounted(async () => {
  backend.value = await hasBackend()
  ready.value = true
  console.log('🔍 测试 iframe URL:', iframeUrl.value)
})
</script>

<div class="pandacoder-test-page">
  <RequiresBackendNotice v-if="ready && !backend" />
  <div v-if="backend" style="padding: 20px;">
    <h1>🧪 PandaCoder iframe 测试</h1>
    
    <div v-if="loading" style="padding: 40px; text-align: center;">
      <p>正在加载...</p>
    </div>
    
    <div v-if="error" style="padding: 40px; text-align: center; color: red;">
      <p>{{ error }}</p>
    </div>
    
    <div style="border: 2px solid #ccc; border-radius: 8px; overflow: hidden; margin-top: 20px;">
      <iframe 
        :src="iframeUrl"
        style="width: 100%; height: 800px; border: none;"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
      <h3>调试信息</h3>
      <p><strong>iframe URL:</strong> {{ iframeUrl }}</p>
      <p><strong>状态:</strong> {{ loading ? '加载中...' : (error ? '失败' : '成功') }}</p>
      <p><strong>提示:</strong> 打开浏览器 F12 控制台查看详细日志</p>
    </div>
  </div>
</div>

