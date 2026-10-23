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
  top: var(--sp-20);
  right: var(--sp-20);
  z-index: 10000;
  pointer-events: none;
}

.indicator-content {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: var(--sp-12) var(--sp-20);
  border-radius: var(--ui-radius-input);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-8);
  min-width: var(--ui-size-200);
}

.loading-spinner {
  width: var(--sp-20);
  height: var(--sp-20);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-top-color: white;
  border-radius: var(--ui-radius-input);
}

.loading-text {
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  white-space: nowrap;
}

.progress-bar {
  width: 100%;
  height: var(--sp-4);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--vp-c-bg-soft);
  transition: var(--ui-transition);
  border-radius: var(--ui-radius-input);
}

.progress-text {
  font-size: var(--ui-text-xs);
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--ui-transition);
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
.dark .indicator-content {
  background: var(--vp-c-bg-soft);
}
@media (max-width: 768px) {
  .font-load-indicator {
    top: var(--sp-12);
    right: var(--sp-12);
  }
  
  .indicator-content {
    padding: var(--sp-12) var(--sp-16);
    min-width: var(--ui-size-180);
  }
  
  .loading-text {
    font-size: var(--ui-text-meta);
  }
}
</style>

