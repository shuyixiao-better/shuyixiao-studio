<template>
  <Transition name="fade">
    <div v-if="isLoading" class="font-load-indicator">
      <div class="indicator-content">
        <div class="loading-spinner"></div>
        <span class="loading-text">正在加载鸿蒙字体...</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ loadedFonts }}/{{ totalFonts }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import fontLoader from '../font-loader'

const isLoading = ref(true)
const loadedFonts = ref(0)
const totalFonts = ref(4)
const progress = ref(0)

let checkInterval = null

const updateStatus = () => {
  const status = fontLoader.getLoadStatus()
  loadedFonts.value = status.loaded
  totalFonts.value = status.total
  progress.value = (status.loaded / status.total) * 100
  
  // 至少加载了主字体就可以隐藏指示器
  if (status.loaded >= 1) {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

onMounted(() => {
  // 初始延迟，避免闪烁
  setTimeout(() => {
    updateStatus()
    
    // 定期检查加载状态
    checkInterval = setInterval(updateStatus, 200)
    
    // 3秒后强制隐藏（即使没加载完）
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  }, 100)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<style scoped>
.font-load-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
}

.indicator-content {
  background: rgba(16, 185, 129, 0.95);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.progress-text {
  font-size: 12px;
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 深色模式适配 */
.dark .indicator-content {
  background: rgba(5, 150, 105, 0.95);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .font-load-indicator {
    top: 10px;
    right: 10px;
  }
  
  .indicator-content {
    padding: 10px 16px;
    min-width: 180px;
  }
  
  .loading-text {
    font-size: 13px;
  }
}
</style>

