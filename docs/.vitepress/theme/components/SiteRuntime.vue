<template>
  <span class="site-runtime">
    {{ runtimeText }}
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const runtimeText = ref('')
let timer = null

// 网站开始运行的日期 2025年9月17日
const startDate = new Date('2025-09-17T00:00:00')

const updateRuntime = () => {
  const now = new Date()
  const diff = now - startDate
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  runtimeText.value = `本站运行：${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`
}

onMounted(() => {
  updateRuntime()
  // 每秒更新一次
  timer = setInterval(updateRuntime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.site-runtime {
  display: inline-block;
  font-size: 0.9em;
  opacity: 0.8;
  letter-spacing: 1px;
  margin-left: 20px;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .site-runtime {
    display: block;
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>

