<template>
  <div class="article-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📚</span>
          技术博文
        </h1>
        <p class="page-subtitle">探索技术深度，记录成长轨迹</p>
        <div class="page-stats">
          <div class="stat-item">
            <span class="stat-number">{{ filteredPosts.length }}</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ allTags.length }}</span>
            <span class="stat-label">个标签</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ totalPages }}</span>
            <span class="stat-label">页内容</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文章标题、描述、标签或作者（支持多关键词）..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
      </div>
      
      <div class="tag-filter">
        <button 
          class="filter-tag"
          :class="{ active: selectedTag === null }"
          @click="selectedTag = null"
        >
          全部
        </button>
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          class="filter-tag"
          :class="{ active: selectedTag === tag }"
          @click="selectedTag = selectedTag === tag ? null : tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 微信公众号卡片 -->
    <div class="wechat-card">
      <div class="wechat-background"></div>
      <div class="wechat-info">
        <div class="wechat-badge">✨ 推荐关注</div>
        <h3 class="wechat-title">关注我的微信公众号</h3>
        <h2 class="wechat-name">舒一笑的架构笔记</h2>
        <p class="wechat-desc">分享更多Java、架构设计、微服务等原创技术内容</p>
        <a href="/about/wechat" class="wechat-btn">
          <span>了解更多</span>
          <span class="btn-arrow">→</span>
        </a>
      </div>
      <div class="wechat-qrcode">
        <div class="qrcode-wrapper">
          <img src="/wxgzh.gif" alt="微信公众号:舒一笑的架构笔记" />
        </div>
        <p class="scan-tip">扫码关注</p>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div 
        v-for="(post, index) in currentPosts" 
        :key="post.url" 
        class="article-card"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <div class="card-number">{{ String((currentPage - 1) * pageSize + index + 1).padStart(2, '0') }}</div>
        <div class="card-content">
          <div class="article-header">
            <div class="article-date">
              <span class="date-icon">📅</span>
              <span>{{ formatDate(post.date) }}</span>
            </div>
            <div class="article-read-time">
              <span class="time-icon">⏱️</span>
              <span>{{ estimateReadTime(post.description) }} 分钟阅读</span>
            </div>
          </div>
          
          <h2 class="article-title">
            <a :href="post.url">
              <span class="title-text">{{ post.title }}</span>
              <span class="title-arrow">→</span>
            </a>
          </h2>
          
          <div class="article-desc">{{ post.description || '点击查看详情...' }}</div>
          
          <div class="article-meta">
            <div class="article-tags" v-if="post.tags && post.tags.length > 0">
              <span 
                v-for="tag in post.tags.slice(0, 4)" 
                :key="tag" 
                class="article-tag"
                :style="{ '--tag-color': getTagColor(tag) }"
              >
                {{ tag }}
              </span>
              <span v-if="post.tags.length > 4" class="more-tags">+{{ post.tags.length - 4 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="currentPosts.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">没有找到相关文章</p>
        <button @click="resetFilters" class="reset-btn">重置筛选</button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ← 上一页
      </button>
      
      <div class="pagination-numbers">
        <button
          v-for="page in displayPages"
          :key="page"
          class="pagination-number"
          :class="{ active: page === currentPage, ellipsis: page === '...' }"
          @click="page !== '...' && goToPage(page)"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { data as posts } from '../utils/posts.data.js'
import { ref, computed } from 'vue'

// 每页显示的文章数量
const pageSize = 10

// 当前页码
const currentPage = ref(1)

// 搜索关键词
const searchQuery = ref('')

// 选中的标签
const selectedTag = ref(null)

// 所有标签
const allTags = computed(() => {
  const tags = new Set()
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
})

// 热门标签（前10个）
const popularTags = computed(() => {
  const tagCount = {}
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

// 过滤后的文章
const filteredPosts = computed(() => {
  let result = posts
  
  // 搜索过滤 - 增强的模糊搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    
    // 支持多关键词搜索（空格分隔）
    const keywords = query.split(/\s+/).filter(k => k.length > 0)
    
    result = result.filter(post => {
      // 准备所有可搜索的内容
      const searchableContent = [
        post.title || '',
        post.description || '',
        post.author || '',
        ...(post.tags || [])
      ].map(item => item.toLowerCase()).join(' ')
      
      // 所有关键词都要匹配（AND逻辑）
      return keywords.every(keyword => searchableContent.includes(keyword))
    })
  }
  
  // 标签过滤
  if (selectedTag.value) {
    result = result.filter(post => 
      post.tags && post.tags.includes(selectedTag.value)
    )
  }
  
  return result
})

// 总页数（根据搜索结果动态变化）
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize)
})

// 当前页的文章
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPosts.value.slice(start, end)
})

// 显示的页码
const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total === 0) return []
  
  pages.push(1)
  
  if (current > 3) {
    pages.push('...')
  }
  
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }
  
  if (current < total - 2) {
    pages.push('...')
  }
  
  if (total > 1 && !pages.includes(total)) {
    pages.push(total)
  }
  
  return pages
})

// 跳转到指定页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 估算阅读时间（假设每分钟阅读300字）
const estimateReadTime = (description) => {
  const words = description ? description.length : 500
  return Math.max(1, Math.ceil(words / 300))
}

// 根据标签获取颜色
const tagColors = [
  '#3eaf7c',
  '#4dabf7', 
  '#ff6b6b',
  '#ffd43b',
  '#a770ef',
  '#ff9ff3',
  '#54a0ff',
  '#48dbfb'
]

const getTagColor = (tag) => {
  const index = allTags.value.indexOf(tag) % tagColors.length
  return tagColors[index]
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedTag.value = null
  currentPage.value = 1
}

// 监听筛选变化，重置到第一页
import { watch } from 'vue'
watch([searchQuery, selectedTag], () => {
  currentPage.value = 1
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-list-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
}

/* 页面头部 */
.page-header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  border-radius: 2px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 2px 8px rgba(62, 175, 124, 0.3));
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2rem;
  font-weight: 500;
}

.page-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  max-width: 500px;
  margin: 0 auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--vp-c-divider);
}

/* 搜索和筛选区域 */
.filter-section {
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.9rem 3rem 0.9rem 3rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.1);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: var(--vp-c-brand-1);
  transform: translateY(-50%) scale(1.2);
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  padding: 0 1rem;
}

.filter-tag {
  padding: 0.5rem 1.2rem;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.filter-tag.active {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

/* 微信公众号卡片 */
.wechat-card {
  display: flex;
  flex-direction: row;
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.08) 0%, rgba(62, 175, 124, 0.15) 100%);
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(62, 175, 124, 0.2);
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out;
}

.wechat-background {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(62, 175, 124, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.wechat-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 16px 48px rgba(62, 175, 124, 0.3);
  border-color: var(--vp-c-brand-3);
}

.wechat-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wechat-info {
  flex: 1;
  z-index: 1;
}

.wechat-title {
  font-size: 0.95rem;
  color: var(--vp-c-brand-1);
  margin: 0 0 0.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.wechat-name {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.wechat-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.2rem;
  line-height: 1.6;
}

.wechat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(62, 175, 124, 0.3);
}

.wechat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(62, 175, 124, 0.4);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.wechat-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.wechat-qrcode {
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  flex-shrink: 0;
  z-index: 1;
}

.qrcode-wrapper {
  width: 260px;
  height: 260px;
  overflow: hidden;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.wechat-card:hover .qrcode-wrapper {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.qrcode-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scan-tip {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 500;
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-bottom: 2rem;
}

.article-card {
  display: flex;
  gap: 1.5rem;
  padding: 0;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.4s ease;
}

.article-card:hover::before {
  transform: scaleY(1);
  transform-origin: top;
}

.article-card:hover {
  transform: translateX(8px);
  box-shadow: 0 12px 40px rgba(62, 175, 124, 0.15);
  border-color: var(--vp-c-brand-1);
}

.card-number {
  flex-shrink: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  opacity: 0.3;
  font-family: 'JetBrains Mono', monospace;
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.05), rgba(62, 175, 124, 0.1));
  transition: all 0.3s ease;
}

.article-card:hover .card-number {
  opacity: 0.6;
  transform: scale(1.1);
}

.card-content {
  flex: 1;
  padding: 1.5rem 1.5rem 1.5rem 0;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}

.article-date,
.article-read-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.date-icon,
.time-icon {
  font-size: 1rem;
}

.article-title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
}

.article-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.title-text {
  flex: 1;
}

.title-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--vp-c-brand-1);
  font-size: 1.2rem;
}

.article-title a:hover {
  color: var(--vp-c-brand-1);
}

.article-title a:hover .title-arrow {
  opacity: 1;
  transform: translateX(0);
}

.article-desc {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.article-tag {
  font-size: 0.75rem;
  padding: 0.35rem 0.9rem;
  border-radius: 14px;
  background: var(--tag-color);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
}

.article-tag:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.more-tags {
  font-size: 0.75rem;
  padding: 0.35rem 0.9rem;
  border-radius: 14px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem;
}

.reset-btn {
  padding: 0.6rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--vp-c-brand-3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.pagination-btn {
  padding: 0.7rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(62, 175, 124, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  min-width: 44px;
  height: 44px;
  padding: 0.6rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.pagination-number:hover:not(.active):not(.ellipsis) {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.pagination-number.active {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(62, 175, 124, 0.3);
}

.pagination-number.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-stats {
    gap: 1rem;
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .tag-filter {
    gap: 0.4rem;
  }
  
  .filter-tag {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
  
  .wechat-card {
    flex-direction: column;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .wechat-qrcode {
    margin-left: 0;
    margin-top: 1.5rem;
  }
  
  .article-card {
    flex-direction: column;
    gap: 0;
  }
  
  .card-number {
    width: 100%;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .card-content {
    padding: 1.2rem;
  }
  
  .article-title {
    font-size: 1.3rem;
  }
  
  .article-desc {
    font-size: 0.9rem;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .pagination-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .pagination-number {
    min-width: 38px;
    height: 38px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .article-list-page {
    padding: 1rem 0.8rem 2rem;
  }
  
  .page-header {
    padding: 2rem 0.5rem 1.5rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .page-stats {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
  
  .search-input {
    font-size: 0.9rem;
  }
  
  .wechat-card {
    padding: 1.2rem;
  }
  
  .wechat-name {
    font-size: 1.5rem;
  }
  
  .article-title {
    font-size: 1.2rem;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 暗色模式 */
.dark .article-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .article-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 40px rgba(66, 211, 146, 0.2);
}

.dark .wechat-card {
  background: linear-gradient(135deg, rgba(66, 211, 146, 0.1) 0%, rgba(66, 211, 146, 0.18) 100%);
  border-color: var(--vp-c-brand-1);
}

.dark .wechat-background {
  background: radial-gradient(circle, rgba(66, 211, 146, 0.2) 0%, transparent 70%);
}

.dark .wechat-badge {
  background: rgba(0, 0, 0, 0.5);
  color: var(--vp-c-brand-3);
}

.dark .qrcode-wrapper {
  background: rgba(255, 255, 255, 0.95);
}
</style>

