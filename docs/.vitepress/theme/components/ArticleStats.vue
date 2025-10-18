<template>
  <div class="article-stats" v-if="isNetlifyEnv">
    <transition name="stats-fade" mode="out-in">
      <div v-if="isDataLoading" key="loading" class="stats-meta stats-loading-state">
        <span class="stat-item">
          <span class="stat-icon">📖</span>
          <span class="stat-text stat-skeleton">— 阅读</span>
        </span>
        <span class="stat-separator">·</span>
        <span class="stat-item">
          <span class="stat-icon">🤍</span>
          <span class="stat-text stat-skeleton">— 点赞</span>
        </span>
      </div>
      <div v-else key="loaded" class="stats-meta">
        <span class="stat-item">
          <span class="stat-icon">📖</span>
          <transition name="number-change" mode="out-in">
            <span :key="views" class="stat-text">{{ views }} 阅读</span>
          </transition>
        </span>
        <span class="stat-separator">·</span>
        <span class="stat-item stat-clickable" @click="toggleLike" :class="{ 'liked': hasLiked }">
          <transition name="icon-change" mode="out-in">
            <span :key="hasLiked" class="stat-icon">{{ hasLiked ? '❤️' : '🤍' }}</span>
          </transition>
          <transition name="number-change" mode="out-in">
            <span :key="`${likes}-${hasLiked}`" class="stat-text">{{ likes }} {{ hasLiked ? '已赞' : '点赞' }}</span>
          </transition>
        </span>
        <span v-if="loading" class="stat-loading">⏳</span>
      </div>
    </transition>

    <!-- 点赞提示 -->
    <transition name="toast">
      <div v-if="showToast" class="toast-message" :class="toastType">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useData } from 'vitepress';

const { page } = useData();

// 状态
const views = ref(0);
const likes = ref(0);
const hasLiked = ref(false);
const loading = ref(false);
const isDataLoading = ref(false); // 数据加载状态（用于过渡动画）
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');
const isNetlifyEnv = ref(true); // 是否为 Netlify 环境

// 数据缓存（全局存储，避免重复请求）
const statsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 缓存5分钟

// 获取当前页面路径
const currentPath = computed(() => page.value.relativePath || '');

// API基础URL
const API_BASE = '/api/stats';

// 开发模式（本地测试）- 生产环境自动关闭
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// 生成浏览器指纹（用于开发模式区分不同浏览器）
const getBrowserFingerprint = () => {
  if (!isDevelopment) return '';
  
  // 使用sessionStorage生成唯一会话ID
  let fingerprint = sessionStorage.getItem('browser_fingerprint');
  if (!fingerprint) {
    fingerprint = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('browser_fingerprint', fingerprint);
  }
  return fingerprint;
};

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

// 获取请求头（包含开发模式标识）
const getRequestHeaders = () => {
  const headers = {};
  if (isDevelopment) {
    headers['x-dev-mode'] = 'true';
    headers['x-browser-fingerprint'] = getBrowserFingerprint();
  }
  return headers;
};

// 检测是否为 Netlify 环境
const checkNetlifyEnv = async () => {
  try {
    const response = await fetch(`${API_BASE}?action=get_site_visits`, {
      method: 'GET',
      cache: 'no-cache',
      headers: getRequestHeaders()
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// 从缓存获取数据
const getCachedStats = (path) => {
  const cached = statsCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// 保存到缓存
const setCachedStats = (path, data) => {
  statsCache.set(path, {
    data: data,
    timestamp: Date.now()
  });
};

// 预加载统计数据（后台静默加载）
const prefetchStats = async (path) => {
  if (!path || getCachedStats(path)) return; // 已有缓存则跳过
  
  try {
    const response = await fetch(`${API_BASE}?action=get_all_stats&path=${encodeURIComponent(path)}`, {
      headers: getRequestHeaders()
    });
    const data = await response.json();
    setCachedStats(path, data);
    console.log('📦 Prefetched stats for:', path);
  } catch (error) {
    console.error('Failed to prefetch stats:', error);
  }
};

// 获取统计数据（优先使用缓存）
const fetchStats = async (useCache = true) => {
  if (!currentPath.value) return;

  // 先检查缓存
  if (useCache) {
    const cached = getCachedStats(currentPath.value);
    if (cached) {
      console.log('✨ Using cached stats for:', currentPath.value);
      views.value = cached.views || 0;
      likes.value = cached.likes || 0;
      hasLiked.value = cached.hasLiked || false;
      saveLocalLikeStatus(hasLiked.value);
      return; // 直接使用缓存，无需加载动画
    }
  }

  // 显示加载状态
  isDataLoading.value = true;

  // 先检测环境
  const hasNetlifyFunctions = await checkNetlifyEnv();
  isNetlifyEnv.value = hasNetlifyFunctions;
  
  if (!hasNetlifyFunctions) {
    console.info('统计功能仅在 Netlify 部署时可用');
    isDataLoading.value = false;
    return;
  }

  try {
    const response = await fetch(`${API_BASE}?action=get_all_stats&path=${encodeURIComponent(currentPath.value)}`, {
      headers: getRequestHeaders()
    });
    const data = await response.json();
    
    // 保存到缓存
    setCachedStats(currentPath.value, data);
    
    // 只在非缓存情况下延迟
    if (!useCache) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    views.value = data.views || 0;
    likes.value = data.likes || 0;
    
    // ✅ 优先使用服务端返回的真实状态（基于IP）
    hasLiked.value = data.hasLiked || false;
    
    // 同步到本地存储（用于前端快速显示）
    saveLocalLikeStatus(hasLiked.value);
    
    console.log('📊 Stats loaded:', { views: views.value, likes: likes.value, hasLiked: hasLiked.value });
    
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    isNetlifyEnv.value = false;
  } finally {
    isDataLoading.value = false;
  }
};

// 增加阅读数
const incrementViews = async () => {
  if (!currentPath.value || !isNetlifyEnv.value) return;

  // 检查是否已经记录过本次访问
  const sessionKey = `viewed_${currentPath.value}`;
  if (sessionStorage.getItem(sessionKey)) {
    return; // 本次会话已记录，不重复计数
  }

  try {
    const response = await fetch(`${API_BASE}?action=increment_views&path=${encodeURIComponent(currentPath.value)}`, {
      headers: getRequestHeaders()
    });
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
  
  // 如果不是 Netlify 环境，显示提示
  if (!isNetlifyEnv.value) {
    showToastMessage('统计功能仅在 Netlify 部署时可用', 'info');
    return;
  }

  loading.value = true;
  
  // 记录操作前的状态
  const beforeAction = hasLiked.value ? 'unlike' : 'like';
  console.log(`🔄 Toggling like: ${beforeAction}, current likes: ${likes.value}`);

  try {
    const action = hasLiked.value ? 'unlike' : 'like';
    const response = await fetch(`${API_BASE}?action=${action}&path=${encodeURIComponent(currentPath.value)}`, {
      headers: getRequestHeaders()
    });
    const data = await response.json();

    console.log('📥 Server response:', data);
    if (isDevelopment) {
      console.log('🔧 Dev mode enabled, fingerprint:', getBrowserFingerprint());
    }

    if (data.alreadyLiked) {
      showToastMessage('您已经点赞过了', 'info');
    } else {
      // ✅ 完全使用服务端返回的真实数据
      likes.value = data.likes || 0;
      hasLiked.value = data.hasLiked;
      
      // 同步到本地存储
      saveLocalLikeStatus(hasLiked.value);
      
      // 更新缓存
      const cachedData = getCachedStats(currentPath.value);
      if (cachedData) {
        cachedData.likes = likes.value;
        cachedData.hasLiked = hasLiked.value;
        setCachedStats(currentPath.value, cachedData);
      }
      
      console.log(`✅ Like toggled: hasLiked=${hasLiked.value}, likes=${likes.value}`);
      
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
  
  // 设置预加载：监听侧边栏链接的悬停事件
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const sidebarLinks = document.querySelectorAll('.VPSidebar a[href], .VPDocAsideOutline a[href]');
      sidebarLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          const href = link.getAttribute('href');
          if (href && href.endsWith('.html')) {
            // 提取文章路径（去掉 .html）
            const articlePath = href.replace(/^\//, '').replace('.html', '.md');
            prefetchStats(articlePath);
          }
        });
      });
      console.log('🔗 Prefetch listeners attached to', sidebarLinks.length, 'links');
    }, 1000);
  }
});

// 监听路由变化，重新获取统计数据（优先使用缓存）
watch(currentPath, async (newPath, oldPath) => {
  if (newPath && newPath !== oldPath) {
    console.log(`📄 Article changed: ${oldPath} → ${newPath}`);
    
    // 获取数据（会自动使用缓存）
    await fetchStats(true); // true表示优先使用缓存
    await incrementViews();
  }
});
</script>

<style scoped>
.article-stats {
  margin: 16px 0;
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.stats-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;
}

.stat-icon {
  font-size: 16px;
  line-height: 1;
}

.stat-text {
  line-height: 1;
}

.stat-separator {
  opacity: 0.5;
  user-select: none;
}

.stat-clickable {
  cursor: pointer;
  user-select: none;
  padding: 2px 6px;
  margin: -2px -6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.stat-clickable:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.stat-clickable:active {
  transform: scale(0.95);
}

.stat-clickable.liked {
  color: var(--vp-c-brand-1);
}

.stat-clickable.liked .stat-icon {
  animation: heartbeat 0.5s ease;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1.1); }
}

.stat-loading {
  font-size: 14px;
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
  padding: 10px 20px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 13px;
  z-index: 9999;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.toast-message.info {
  background: var(--vp-c-warning-1);
}

.toast-message.error {
  background: var(--vp-c-danger-1);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* 加载状态 */
.stats-loading-state {
  opacity: 0.6;
}

.stat-skeleton {
  color: var(--vp-c-text-3);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* 整体淡入淡出动画 - 优雅版 */
.stats-fade-enter-active {
  transition: opacity 0.4s ease;
}

.stats-fade-leave-active {
  transition: opacity 0.3s ease;
}

.stats-fade-enter-from,
.stats-fade-leave-to {
  opacity: 0;
}

/* 数字变化动画 - 快速版（点赞反馈） */
.number-change-enter-active {
  transition: opacity 0.15s ease;
}

.number-change-leave-active {
  transition: opacity 0.1s ease;
}

.number-change-enter-from,
.number-change-leave-to {
  opacity: 0;
}

/* 图标变化动画 - 快速版（点赞反馈） */
.icon-change-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.icon-change-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.icon-change-enter-from,
.icon-change-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-meta {
    font-size: 13px;
  }

  .stat-icon {
    font-size: 15px;
  }
}
</style>

