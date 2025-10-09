<template>
  <div class="article-list-page">
    <!-- 微信公众号卡片（固定在第一位） -->
    <div class="wechat-card">
      <div class="wechat-info">
        <h3 class="wechat-title">关注我的微信公众号</h3>
        <h2 class="wechat-name">舒一笑的架构笔记</h2>
        <p class="wechat-desc">分享更多Java、架构设计、微服务等原创技术内容</p>
        <a href="/about/wechat" class="wechat-btn">了解更多 →</a>
      </div>
      <div class="wechat-qrcode">
        <img src="/wxgzh.gif" alt="微信公众号:舒一笑的架构笔记" />
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div v-for="post in currentPosts" :key="post.url" class="article-card">
        <div class="article-date">{{ formatDate(post.date) }}</div>
        <h2 class="article-title">
          <a :href="post.url">{{ post.title }}</a>
        </h2>
        <div class="article-desc">{{ post.description }}</div>
        <div class="article-meta">
          <div class="article-tags" v-if="post.tags && post.tags.length > 0">
            <span v-for="tag in post.tags" :key="tag" class="article-tag">{{ tag }}</span>
          </div>
          <div class="article-stats" v-if="post.views || post.likes || post.comments">
            <span v-if="post.views" class="article-views">
              <i class="icon-eye"></i> {{ post.views }}
            </span>
            <span v-if="post.likes" class="article-likes">
              <i class="icon-heart"></i> {{ post.likes }}
            </span>
            <span v-if="post.comments" class="article-comments">
              <i class="icon-message"></i> {{ post.comments }}
            </span>
          </div>
        </div>
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

// 总页数
const totalPages = computed(() => {
  return Math.ceil(posts.length / pageSize)
})

// 当前页的文章
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return posts.slice(start, end)
})

// 显示的页码
const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // 总是显示第一页
  pages.push(1)
  
  // 如果当前页大于3，显示省略号
  if (current > 3) {
    pages.push('...')
  }
  
  // 显示当前页前后各一页
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }
  
  // 如果当前页小于倒数第三页，显示省略号
  if (current < total - 2) {
    pages.push('...')
  }
  
  // 总是显示最后一页
  if (total > 1 && !pages.includes(total)) {
    pages.push(total)
  }
  
  return pages
})

// 跳转到指定页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
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
</script>

<style scoped>
.article-list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* 微信公众号卡片 */
.wechat-card {
  display: flex;
  flex-direction: row;
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.05) 0%, rgba(62, 175, 124, 0.1) 100%);
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 6px 24px rgba(62, 175, 124, 0.15);
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.wechat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
}

.wechat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(62, 175, 124, 0.25);
}

.wechat-info {
  flex: 1;
}

.wechat-title {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  margin: 0 0 0.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.wechat-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.8rem;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wechat-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
  line-height: 1.5;
}

.wechat-btn {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.wechat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.wechat-qrcode {
  width: 110px;
  height: 110px;
  margin-left: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.wechat-qrcode img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.article-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-card:hover::before {
  transform: scaleX(1);
}

.article-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(62, 175, 124, 0.2);
  border-color: var(--vp-c-brand-1);
}

.article-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.article-date::before {
  content: '📅';
  font-size: 0.75rem;
}

.article-title {
  margin: 0.5rem 0 0.8rem;
  font-size: 1.4rem;
  line-height: 1.4;
  font-weight: 600;
}

.article-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.article-title a:hover {
  color: var(--vp-c-brand-1);
}

.article-desc {
  margin: 0.5rem 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-dimm), rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  font-weight: 500;
  transition: all 0.3s ease;
}

.article-tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  transform: translateY(-2px);
}

.article-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* 图标样式 */
.icon-eye::before {
  content: '👁️';
  margin-right: 0.25rem;
}

.icon-heart::before {
  content: '❤️';
  margin-right: 0.25rem;
}

.icon-message::before {
  content: '💬';
  margin-right: 0.25rem;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 1.5rem 0;
}

.pagination-btn {
  padding: 0.6rem 1.2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-number:hover:not(.active):not(.ellipsis) {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

.pagination-number.active {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  border-color: var(--vp-c-brand-1);
}

.pagination-number.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .article-list-page {
    padding: 1.5rem 1rem;
  }

  .wechat-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
  }

  .wechat-title {
    font-size: 0.85rem;
  }

  .wechat-name {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }

  .wechat-desc {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .wechat-qrcode {
    margin: 1.2rem auto 0;
    width: 100px;
    height: 100px;
  }

  .article-list {
    gap: 1.2rem;
  }

  .article-card {
    padding: 1.2rem;
  }

  .article-title {
    font-size: 1.15rem;
  }

  .article-desc {
    font-size: 0.85rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
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
    min-width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
}

/* 暗色模式 */
.dark .article-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .article-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 28px rgba(66, 211, 146, 0.15);
}

.dark .wechat-card {
  background: linear-gradient(135deg, rgba(66, 211, 146, 0.08) 0%, rgba(66, 211, 146, 0.12) 100%);
  border-color: var(--vp-c-brand-1);
}
</style>

