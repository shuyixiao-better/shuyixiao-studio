<template>
  <div class="article-stats" v-if="shouldShow">
    <div class="stats-container">
      <!-- 阅读量 -->
      <div class="stat-item view-count">
        <svg class="stat-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M512 256c-182.4 0-345.6 108.8-435.2 281.6 89.6 172.8 252.8 281.6 435.2 281.6s345.6-108.8 435.2-281.6C857.6 364.8 694.4 256 512 256z m0 480c-115.2 0-211.2-89.6-211.2-198.4S396.8 339.2 512 339.2s211.2 89.6 211.2 198.4S627.2 736 512 736z m0-320c-70.4 0-128 57.6-128 121.6s57.6 121.6 128 121.6 128-57.6 128-121.6-57.6-121.6-128-121.6z" fill="currentColor"/>
        </svg>
        <span class="stat-label">阅读</span>
        <span class="stat-value">{{ stats.views }}</span>
      </div>

      <!-- 点赞 -->
      <div 
        class="stat-item like-count" 
        :class="{ 'active': userActions.liked }"
        @click="toggleLike"
        title="点击点赞/取消点赞"
      >
        <svg class="stat-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52.8 0-98.7 38.4-109.6 91.8L315.8 496H204c-28.7 0-52 23.3-52 52v364c0 28.7 23.3 52 52 52h655.7c22.9 0 42.8-12.1 53.8-30.2l152.9-282.3c9.5-17.6 10.2-38.9 2-56.8-8.2-17.9-23.2-31-41.9-36.9zM568.1 868H244V548h161.8l44.1-252.3c5.2-29.8 31.4-52.6 61.9-52.6 16.5 0 31.9 6.5 43.4 18.3 11.5 11.9 17.5 27.3 16.7 43.5l-8.5 174.8h273.7c4.4 0 8.6 1.4 11.9 4.1 3.3 2.7 5.1 6.5 5.1 10.3 0 4.5-1.8 8.8-5.1 12.1l-0.1 0.1-152.8 282.5c-2.5 4.6-7.4 7.5-12.7 7.5z" fill="currentColor"/>
        </svg>
        <span class="stat-label">点赞</span>
        <span class="stat-value">{{ stats.likes }}</span>
      </div>

      <!-- 收藏 -->
      <div 
        class="stat-item favorite-count" 
        :class="{ 'active': userActions.favorited }"
        @click="toggleFavorite"
        title="点击收藏/取消收藏"
      >
        <svg class="stat-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9 0.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-0.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" fill="currentColor"/>
        </svg>
        <span class="stat-label">收藏</span>
        <span class="stat-value">{{ stats.favorites }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vitepress'
import { statsAPI } from '../utils/stats-api.js'

const route = useRoute()

const stats = reactive({
  views: 0,
  likes: 0,
  favorites: 0
})

const userActions = reactive({
  liked: false,
  favorited: false
})

// 判断是否应该显示统计组件（不在首页显示）
const shouldShow = computed(() => {
  return route.path !== '/' && route.path !== '/index' && !route.path.includes('/admin/')
})

// 获取文章唯一标识
const getArticleId = () => {
  return route.path
}

// 从localStorage获取用户行为
const loadUserActions = () => {
  if (typeof window === 'undefined') return
  
  const articleId = getArticleId()
  const stored = localStorage.getItem(`article_actions_${articleId}`)
  if (stored) {
    try {
      const actions = JSON.parse(stored)
      userActions.liked = actions.liked || false
      userActions.favorited = actions.favorited || false
    } catch (e) {
      console.error('Failed to parse user actions:', e)
    }
  }
}

// 保存用户行为到localStorage
const saveUserActions = () => {
  if (typeof window === 'undefined') return
  
  const articleId = getArticleId()
  try {
    localStorage.setItem(`article_actions_${articleId}`, JSON.stringify(userActions))
  } catch (e) {
    console.error('Failed to save user actions:', e)
  }
}

// 检查是否已记录阅读
const checkViewRecorded = () => {
  if (typeof window === 'undefined') return true
  
  const articleId = getArticleId()
  const viewKey = `article_viewed_${articleId}`
  return sessionStorage.getItem(viewKey) === 'true'
}

// 标记为已阅读
const markAsViewed = () => {
  if (typeof window === 'undefined') return
  
  const articleId = getArticleId()
  const viewKey = `article_viewed_${articleId}`
  try {
    sessionStorage.setItem(viewKey, 'true')
  } catch (e) {
    console.error('Failed to mark as viewed:', e)
  }
}

// 获取统计数据
const fetchStats = async () => {
  if (!shouldShow.value) return
  
  const articleId = getArticleId()
  const data = await statsAPI.fetchArticleStats(articleId)
  stats.views = data.views || 0
  stats.likes = data.likes || 0
  stats.favorites = data.favorites || 0
}

// 增加阅读量
const incrementViews = async () => {
  if (!shouldShow.value || checkViewRecorded()) {
    return
  }

  const articleId = getArticleId()
  const data = await statsAPI.updateArticleStats(articleId, 'view')
  stats.views = data.views
  markAsViewed()
}

// 切换点赞
const toggleLike = async () => {
  const articleId = getArticleId()
  const action = userActions.liked ? 'unlike' : 'like'
  
  const data = await statsAPI.updateArticleStats(articleId, action)
  stats.likes = data.likes
  userActions.liked = !userActions.liked
  saveUserActions()
}

// 切换收藏
const toggleFavorite = async () => {
  const articleId = getArticleId()
  const action = userActions.favorited ? 'unfavorite' : 'favorite'
  
  const data = await statsAPI.updateArticleStats(articleId, action)
  stats.favorites = data.favorites
  userActions.favorited = !userActions.favorited
  saveUserActions()
}

// 初始化
onMounted(async () => {
  if (typeof window === 'undefined') return
  
  loadUserActions()
  await fetchStats()
  await incrementViews()
})

// 监听路由变化
watch(() => route.path, async () => {
  if (typeof window === 'undefined') return
  
  loadUserActions()
  await fetchStats()
  await incrementViews()
})
</script>

<style scoped>
.article-stats {
  margin: 32px 0;
  padding: 20px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.article-stats:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(62, 175, 124, 0.1);
}

.stats-container {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;
  min-width: 100px;
}

.stat-item.like-count,
.stat-item.favorite-count {
  cursor: pointer;
}

.stat-item.like-count:hover,
.stat-item.favorite-count:hover {
  background: var(--vp-c-default-soft);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item.like-count.active {
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

.stat-item.favorite-count.active {
  color: #ffa502;
  background: rgba(255, 165, 2, 0.1);
}

.stat-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

.stat-label {
  font-size: 15px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  min-width: 24px;
  text-align: center;
}

.stat-item.active .stat-icon {
  animation: bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.stat-item.active .stat-value {
  color: inherit;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

@media (max-width: 768px) {
  .article-stats {
    margin: 24px 0;
    padding: 16px;
  }
  
  .stats-container {
    gap: 16px;
  }
  
  .stat-item {
    padding: 8px 14px;
    min-width: 85px;
  }
  
  .stat-icon {
    width: 18px;
    height: 18px;
  }
  
  .stat-label {
    font-size: 13px;
  }
  
  .stat-value {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .stats-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-item {
    width: 100%;
    justify-content: center;
  }
}
</style>
