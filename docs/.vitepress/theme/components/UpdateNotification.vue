<template>
  <Transition name="update-slide">
    <div v-if="showNotification" class="update-notification">
      <div class="update-content">
        <div class="update-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </div>
        <div class="update-text">
          <div class="update-title">🎉 网站已更新</div>
          <div class="update-desc">发现新内容，点击刷新查看最新版本</div>
        </div>
        <div class="update-actions">
          <button class="update-btn update-btn-primary" @click="refreshPage">
            立即刷新
          </button>
          <button class="update-btn update-btn-secondary" @click="dismissNotification">
            稍后
          </button>
        </div>
        <button class="update-close" @click="dismissNotification" aria-label="关闭">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showNotification = ref(false)
const currentVersion = ref(null)
const checkInterval = ref(null)

// 检查更新的间隔时间（毫秒）- 5分钟
const CHECK_INTERVAL = 5 * 60 * 1000

// 获取当前版本信息
async function getCurrentVersion() {
  try {
    const response = await fetch('/version.json?t=' + Date.now())
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.debug('📦 无法获取版本信息:', error.message)
  }
  return null
}

// 检查是否有新版本
async function checkForUpdates() {
  try {
    const newVersion = await getCurrentVersion()
    
    if (!newVersion) {
      return
    }
    
    // 首次加载，记录当前版本
    if (!currentVersion.value) {
      currentVersion.value = newVersion
      console.log('📦 当前版本:', {
        buildDate: newVersion.buildDate,
        version: newVersion.version,
        gitHash: newVersion.gitHash
      })
      return
    }
    
    // 比较构建时间戳
    if (newVersion.buildTime > currentVersion.value.buildTime) {
      console.log('🎉 发现新版本!', {
        old: currentVersion.value.buildDate,
        new: newVersion.buildDate
      })
      
      // 显示更新通知
      showNotification.value = true
      
      // 停止继续检查
      if (checkInterval.value) {
        clearInterval(checkInterval.value)
        checkInterval.value = null
      }
    }
  } catch (error) {
    console.debug('检查更新失败:', error.message)
  }
}

// 刷新页面
function refreshPage() {
  // 清除缓存并刷新
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name))
    })
  }
  window.location.reload(true)
}

// 关闭通知
function dismissNotification() {
  showNotification.value = false
  
  // 10分钟后再次检查
  setTimeout(() => {
    if (!checkInterval.value) {
      checkInterval.value = setInterval(checkForUpdates, CHECK_INTERVAL)
    }
  }, 10 * 60 * 1000)
}

// 组件挂载时开始检查
onMounted(() => {
  // 立即检查一次
  checkForUpdates()
  
  // 定期检查更新
  checkInterval.value = setInterval(checkForUpdates, CHECK_INTERVAL)
  
  console.log('🔍 自动更新检测已启动 (每5分钟检查一次)')
})

// 组件卸载时清理
onUnmounted(() => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value)
  }
})
</script>

<style scoped>
/* 样式将在 custom.css 中定义 */
</style>

