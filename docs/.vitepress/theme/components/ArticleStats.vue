<template>
  <div class="article-stats">
    <div class="stats-container">
      <!-- 阅读数 -->
      <div class="stat-item">
        <span class="stat-icon">👁️</span>
        <span class="stat-label">阅读</span>
        <span class="stat-value">{{ views }}</span>
      </div>

      <!-- 点赞按钮 -->
      <div class="stat-item stat-action" @click="toggleLike">
        <span class="stat-icon" :class="{ 'liked': hasLiked }">
          {{ hasLiked ? '❤️' : '🤍' }}
        </span>
        <span class="stat-label">{{ hasLiked ? '已点赞' : '点赞' }}</span>
        <span class="stat-value">{{ likes }}</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-indicator">
        <span class="loading-spinner">⏳</span>
      </div>
    </div>

    <!-- 点赞提示 -->
    <transition name="toast">
      <div v-if="showToast" class="toast-message" :class="toastType">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useData } from 'vitepress';

const { page } = useData();

// 状态
const views = ref(0);
const likes = ref(0);
const hasLiked = ref(false);
const loading = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// 获取当前页面路径
const currentPath = computed(() => page.value.relativePath || '');

// API基础URL
const API_BASE = '/api/stats';

// 显示提示消息
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// 检查本地存储的点赞状态
const checkLocalLikeStatus = () => {
  try {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    return likedArticles.includes(currentPath.value);
  } catch {
    return false;
  }
};

// 保存本地点赞状态
const saveLocalLikeStatus = (liked) => {
  try {
    let likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    if (liked) {
      if (!likedArticles.includes(currentPath.value)) {
        likedArticles.push(currentPath.value);
      }
    } else {
      likedArticles = likedArticles.filter(path => path !== currentPath.value);
    }
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
  } catch (error) {
    console.error('Failed to save like status:', error);
  }
};

// 获取统计数据
const fetchStats = async () => {
  if (!currentPath.value) return;

  try {
    const response = await fetch(`${API_BASE}?action=get_all_stats&path=${encodeURIComponent(currentPath.value)}`);
    const data = await response.json();
    
    views.value = data.views || 0;
    likes.value = data.likes || 0;
    
    // 优先使用本地存储的点赞状态
    const localLiked = checkLocalLikeStatus();
    hasLiked.value = localLiked || data.hasLiked || false;
    
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// 增加阅读数
const incrementViews = async () => {
  if (!currentPath.value) return;

  // 检查是否已经记录过本次访问
  const sessionKey = `viewed_${currentPath.value}`;
  if (sessionStorage.getItem(sessionKey)) {
    return; // 本次会话已记录，不重复计数
  }

  try {
    const response = await fetch(`${API_BASE}?action=increment_views&path=${encodeURIComponent(currentPath.value)}`);
    const data = await response.json();
    views.value = data.views || 0;
    
    // 标记本次会话已记录
    sessionStorage.setItem(sessionKey, 'true');
  } catch (error) {
    console.error('Failed to increment views:', error);
  }
};

// 切换点赞状态
const toggleLike = async () => {
  if (loading.value || !currentPath.value) return;

  loading.value = true;

  try {
    const action = hasLiked.value ? 'unlike' : 'like';
    const response = await fetch(`${API_BASE}?action=${action}&path=${encodeURIComponent(currentPath.value)}`);
    const data = await response.json();

    if (data.alreadyLiked) {
      showToastMessage('您已经点赞过了', 'info');
    } else {
      likes.value = data.likes || 0;
      hasLiked.value = !hasLiked.value;
      
      // 保存到本地存储
      saveLocalLikeStatus(hasLiked.value);
      
      showToastMessage(hasLiked.value ? '感谢点赞！❤️' : '已取消点赞', 'success');
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    showToastMessage('操作失败，请稍后重试', 'error');
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(async () => {
  await fetchStats();
  await incrementViews();
});
</script>

<style scoped>
.article-stats {
  position: relative;
  margin: 24px 0;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.stats-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #333;
  font-size: 14px;
}

.stat-action {
  cursor: pointer;
  user-select: none;
}

.stat-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.stat-action:active {
  transform: translateY(0);
}

.stat-icon {
  font-size: 20px;
  transition: all 0.3s ease;
}

.stat-icon.liked {
  animation: heartbeat 0.5s ease;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.2); }
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #667eea;
  min-width: 30px;
  text-align: center;
}

.loading-indicator {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.loading-spinner {
  font-size: 16px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Toast消息 */
.toast-message {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-message.success {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toast-message.info {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.toast-message.error {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-container {
    gap: 16px;
  }

  .stat-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .stat-icon {
    font-size: 18px;
  }
}

/* 暗色主题适配 */
.dark .stat-item {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.dark .stat-action:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dark .stat-label {
  color: rgba(255, 255, 255, 0.7);
}

.dark .stat-value {
  color: #a8b5ff;
}
</style>

