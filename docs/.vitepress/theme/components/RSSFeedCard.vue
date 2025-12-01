<template>
  <div class="rss-feed-card">
    <!-- RSS Feed 卡片 -->
    <div class="card-container">
      <div class="card-header">
        <div class="header-icon">📡</div>
        <div class="header-content">
          <h3 class="card-title">RSS 订阅</h3>
          <p class="card-subtitle">第一时间获取最新文章更新</p>
        </div>
      </div>
      
      <div class="card-body">
        <!-- RSS Feed 地址 -->
        <div class="rss-url-container">
          <div class="rss-label">
            <span class="label-icon">🔗</span>
            <span class="label-text">RSS Feed 地址</span>
          </div>
          <div class="rss-input-group">
            <input 
              type="text" 
              :value="rssUrl" 
              readonly 
              class="rss-input"
              ref="rssInput"
            />
            <button 
              class="copy-btn"
              @click="copyRSSUrl"
              :disabled="copying"
            >
              <span v-if="!copying">📋 复制</span>
              <span v-else>✅ 已复制</span>
            </button>
          </div>
        </div>
        
        <!-- 最近更新的文章 -->
        <div class="recent-posts-section" v-if="recentPosts.length > 0">
          <div class="section-title">
            <span class="title-icon">✨</span>
            <span class="title-text">最近更新</span>
          </div>
          <ul class="posts-list">
            <li 
              v-for="post in recentPosts" 
              :key="post.url"
              class="post-item"
            >
              <a :href="post.url" class="post-link">
                <span class="post-title">{{ post.title }}</span>
                <span class="post-date">{{ formatDate(post.date) }}</span>
              </a>
            </li>
          </ul>
        </div>
        
        <!-- 提示信息 -->
        <div class="tips-section">
          <div class="tip-item">
            <span class="tip-icon">💡</span>
            <span class="tip-text">支持所有主流 RSS 阅读器</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <span class="tip-text">自动同步最新文章</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔔</span>
            <span class="tip-text">不错过任何更新</span>
          </div>
        </div>
      </div>
      
      <!-- 推荐阅读器 -->
      <div class="card-footer">
        <div class="readers-title">推荐阅读器</div>
        <div class="readers-list">
          <a 
            v-for="reader in readers" 
            :key="reader.name"
            :href="reader.url"
            target="_blank"
            rel="noopener noreferrer"
            class="reader-link"
          >
            <span class="reader-icon">{{ reader.icon }}</span>
            <span class="reader-name">{{ reader.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const rssInput = ref(null)
const copying = ref(false)

// RSS URL
const rssUrl = computed(() => {
  return 'https://www.poeticcoder.com/rss.xml'
})

// 最近更新的文章（最多显示 5 篇）
const recentPosts = ref([])

// 推荐阅读器列表
const readers = [
  { name: 'Feedly', url: 'https://feedly.com', icon: '📰' },
  { name: 'Inoreader', url: 'https://www.inoreader.com', icon: '📚' },
  { name: 'NetNewsWire', url: 'https://netnewswire.com', icon: '📱' },
  { name: 'Thunderbird', url: 'https://www.thunderbird.net', icon: '📧' }
]

// 格式化日期
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays} 天前`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} 周前`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} 个月前`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} 年前`
    }
  } catch (error) {
    return ''
  }
}

// 复制 RSS URL
async function copyRSSUrl() {
  if (!rssInput.value) return
  
  try {
    await navigator.clipboard.writeText(rssUrl.value)
    copying.value = true
    
    // 显示成功提示
    setTimeout(() => {
      copying.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
    // 降级方案：选中文本
    rssInput.value.select()
    document.execCommand('copy')
    copying.value = true
    setTimeout(() => {
      copying.value = false
    }, 2000)
  }
}

// 获取最近更新的文章
async function loadRecentPosts() {
  try {
    // 从 posts.data.js 加载文章数据
    const postsData = await import('../utils/posts.data.js')
    const posts = postsData.default || []
    
    // 只取最新的 5 篇
    recentPosts.value = Array.isArray(posts) ? posts.slice(0, 5) : []
  } catch (error) {
    console.error('Failed to load recent posts:', error)
    recentPosts.value = []
  }
}

onMounted(() => {
  loadRecentPosts()
})
</script>

<style scoped>
.rss-feed-card {
  margin: 2rem 0;
}

.card-container {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.card-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.header-content {
  flex: 1;
}

.card-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.card-subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.card-body {
  padding: 1.5rem;
}

.rss-url-container {
  margin-bottom: 1.5rem;
}

.rss-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.label-icon {
  font-size: 1.1rem;
}

.rss-input-group {
  display: flex;
  gap: 0.5rem;
}

.rss-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
  transition: border-color 0.3s;
}

.rss-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.copy-btn {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.copy-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.copy-btn:active:not(:disabled) {
  transform: translateY(0);
}

.copy-btn:disabled {
  background: var(--vp-c-brand-3);
  cursor: not-allowed;
}

.recent-posts-section {
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.title-icon {
  font-size: 1.1rem;
}

.posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  margin-bottom: 0.75rem;
}

.post-item:last-child {
  margin-bottom: 0;
}

.post-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.post-link:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.post-title {
  flex: 1;
  color: var(--vp-c-text-1);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.post-date {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  white-space: nowrap;
}

.tips-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.tip-icon {
  font-size: 1rem;
}

.card-footer {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.readers-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.readers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reader-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: all 0.3s;
}

.reader-link:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.reader-icon {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 1.5rem 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-footer {
    padding: 1rem;
  }
  
  .rss-input-group {
    flex-direction: column;
  }
  
  .copy-btn {
    width: 100%;
  }
  
  .post-link {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-title {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }
  
  .tips-section {
    grid-template-columns: 1fr;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .card-container {
    border-color: var(--vp-c-divider);
  }
}
</style>

