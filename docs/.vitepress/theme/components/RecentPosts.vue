<template>
  <div class="recent-posts">
    <h2>最新文章</h2>
    <div class="post-list">
      <div class="post-grid">
        <div v-for="post in recentPosts" :key="post.url" class="post-item">
          <div class="post-date">{{ formatDate(post.date) }}</div>
          <h3 class="post-title">
            <a :href="post.url">{{ post.title }}</a>
          </h3>
          <div class="post-desc">{{ post.description }}</div>
          <div class="post-meta" v-if="post.tags && post.tags.length > 0">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="view-more">
      <a href="/articles/">查看更多文章 →</a>
    </div>
  </div>
</template>

<script setup>
import { data as posts } from '../utils/posts.data.js'
import { computed } from 'vue'

// 获取最新的3篇文章
const recentPosts = computed(() => {
  return posts.slice(0, 3)
})

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
.recent-posts {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.recent-posts h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 2rem;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.post-item::before {
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

.post-item:hover::before {
  transform: scaleX(1);
}

.post-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(62, 175, 124, 0.2);
  border-color: var(--vp-c-brand-1);
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.post-title {
  margin: 0 0 0.8rem;
  font-size: 1.3rem;
  line-height: 1.4;
  font-weight: 600;
}

.post-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: var(--vp-c-brand-1);
}

.post-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.post-tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-dimm), rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  font-weight: 500;
  transition: all 0.3s ease;
}

.post-tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  transform: translateY(-2px);
}

.view-more {
  text-align: center;
  margin-top: 2rem;
}

.view-more a {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.view-more a:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(62, 175, 124, 0.4);
}

@media (max-width: 640px) {
  .recent-posts {
    padding: 1.5rem 1rem;
  }

  .recent-posts h2 {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .post-item {
    padding: 1.2rem;
  }

  .post-title {
    font-size: 1.15rem;
  }

  .post-desc {
    font-size: 0.85rem;
  }
}

.dark .post-item {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .post-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 28px rgba(66, 211, 146, 0.15);
}
</style>

