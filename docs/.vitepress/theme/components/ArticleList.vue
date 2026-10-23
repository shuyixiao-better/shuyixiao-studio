<template>
  <div class="article-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon"><LineIcon name="book" /></span>
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
        <div class="page-intro">
          <slot name="intro"></slot>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="search-box">
        <span class="search-icon"><LineIcon name="search" /></span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文章标题、描述、标签或作者（支持多关键词）..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn" aria-label="清空搜索"><LineIcon name="close" /></button>
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
        <div class="wechat-badge"> 推荐关注</div>
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
      >
        <div class="card-number">{{ String((currentPage - 1) * pageSize + index + 1).padStart(2, '0') }}</div>
        <div class="card-content">
          <div class="article-header">
            <div class="article-date">
              <span class="date-icon"><LineIcon name="book" /></span>
              <span>{{ formatDate(post.date) }}</span>
            </div>
            <div class="article-read-time">
              <span class="time-icon"><LineIcon name="book" /></span>
              <span>{{ estimateReadTime(post.wordCount) }} 分钟阅读</span>
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
        <div class="empty-icon"><LineIcon name="book" /></div>
        <p class="empty-text">没有找到相关文章</p>
        <button @click="resetFilters" class="reset-btn">重置筛选</button>
      </div>
    </div>

    <!-- 分页和每页数量选择 -->
    <div class="pagination-wrapper">
      <!-- 每页数量选择器 -->
      <div class="page-size-selector">
        <span class="selector-label">每页显示：</span>
        <div class="size-options">
          <button 
            v-for="size in [10, 20, 50, 100]"
            :key="size"
            class="size-option"
            :class="{ active: pageSize === size }"
            @click="changePageSize(size)"
          >
            {{ size }}
          </button>
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
  </div>
</template>

<script setup>
import { data as posts } from '../utils/posts.data.js'
import { ref, computed, watch } from 'vue'

// 每页显示的文章数量（可选：10、20、50、100）
const pageSize = ref(10)

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
  return Math.ceil(filteredPosts.value.length / pageSize.value)
})

// 当前页的文章
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
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
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
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
const estimateReadTime = (wordCount) => {
  // 使用文章实际字数计算阅读时间
  const words = wordCount || 500
  return Math.max(1, Math.ceil(words / 300))
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedTag.value = null
  currentPage.value = 1
}

// 改变每页显示数量
const changePageSize = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 监听筛选变化，重置到第一页
watch([searchQuery, selectedTag], () => {
  currentPage.value = 1
})

// 监听每页数量变化，重置到第一页
watch(pageSize, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.article-list-page { width: 100%; max-width: var(--ui-content-width); margin: 0 auto; }
.page-header { padding-block: var(--sp-32); border-bottom: var(--ui-border) solid var(--vp-c-divider); }
.page-title { font-size: var(--ui-text-title); font-weight: var(--ui-weight-heading); }
.page-subtitle, .page-stats { color: var(--vp-c-text-2); font-size: var(--ui-text-sm); }
.page-stats, .stat-item { display: flex; align-items: baseline; gap: var(--sp-8); }
.page-stats { gap: var(--sp-24); flex-wrap: wrap; }
.stat-number { font-variant-numeric: tabular-nums; }
.filter-section { margin-block: var(--sp-32); }
.search-box { display: flex; align-items: center; gap: var(--sp-12); border: var(--ui-border) solid var(--vp-c-divider); border-radius: var(--ui-radius-input); padding: var(--sp-12) var(--sp-16); background: var(--ui-surface); }
.search-input { width: 100%; min-width: 0; font-size: var(--ui-text-sm); }
.tag-filter { display: flex; flex-wrap: wrap; gap: var(--sp-8); margin-top: var(--sp-16); }
.filter-tag, .size-option, .pagination-btn, .pagination-number, .reset-btn { padding: var(--sp-8) var(--sp-12); border: var(--ui-border) solid var(--vp-c-divider); border-radius: var(--ui-radius-tag); color: var(--vp-c-text-2); font-size: var(--ui-text-sm); cursor: pointer; }
.filter-tag:hover, button.active { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.wechat-card { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-24); padding: var(--sp-24); background: var(--vp-c-bg-soft); border: var(--ui-border) solid var(--vp-c-divider); border-radius: var(--ui-radius-card); margin-block: var(--sp-32); }
.wechat-title, .wechat-badge, .scan-tip { font-size: var(--ui-text-xs); color: var(--ui-muted); margin: 0; }
.wechat-name { font-size: var(--ui-text-lg); margin-block: var(--sp-8); }
.wechat-desc { font-size: var(--ui-text-sm); color: var(--vp-c-text-2); }
.wechat-qrcode { width: var(--sp-104); flex-shrink: 0; text-align: center; }
.wechat-btn { font-size: var(--ui-text-sm); }
.article-card { display: flex; align-items: baseline; gap: var(--sp-24); border-bottom: var(--ui-border) solid var(--vp-c-divider); padding-block: var(--sp-24); }
.card-number { color: var(--ui-muted); font-size: var(--ui-text-xs); font-variant-numeric: tabular-nums; }
.card-content { flex: 1; min-width: 0; }
.article-header { display: flex; gap: var(--sp-16); flex-wrap: wrap; font-size: var(--ui-text-meta); color: var(--ui-muted); font-variant-numeric: tabular-nums; }
.article-title { margin: var(--sp-8) 0; font-size: var(--ui-text-base); font-weight: var(--ui-weight-medium); }
.article-title a { display: flex; justify-content: space-between; gap: var(--sp-16); color: var(--vp-c-text-1); }
.article-title a:hover { color: var(--vp-c-text-1); text-decoration: none; }
.title-arrow { color: var(--vp-c-text-1); }
.article-desc { font-size: var(--ui-text-sm); color: var(--vp-c-text-2); }
.article-tags { display: flex; gap: var(--sp-8); flex-wrap: wrap; margin-top: var(--sp-12); }
.article-tag, .more-tags { font-size: var(--ui-text-xs); color: var(--ui-muted); }
.pagination-wrapper { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--sp-24); margin-block: var(--sp-32); }
.page-size-selector, .size-options, .pagination, .pagination-numbers { display: flex; gap: var(--sp-8); align-items: center; flex-wrap: wrap; }
.selector-label { font-size: var(--ui-text-sm); color: var(--vp-c-text-2); }
button:disabled { opacity: .5; cursor: default; }
.empty-state { padding: var(--sp-48); text-align: center; color: var(--vp-c-text-2); }
@media (max-width: 639px) { .wechat-card { flex-direction: column; align-items: flex-start; } .card-number { display: none; } .pagination { gap: var(--sp-4); } }
</style>
