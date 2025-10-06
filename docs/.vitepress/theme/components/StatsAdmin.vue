<template>
  <div class="stats-admin">
    <div class="admin-header">
      <h1>文章统计管理面板</h1>
      <div class="admin-actions">
        <button @click="fetchAllStats" class="btn-refresh">刷新数据</button>
        <button @click="exportCSV" class="btn-export">导出CSV</button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="stats-content">
      <!-- 总览统计 -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-label">文章总数</div>
            <div class="card-value">{{ summary.totalArticles }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">👁️</div>
          <div class="card-content">
            <div class="card-label">总阅读量</div>
            <div class="card-value">{{ summary.totalViews }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">👍</div>
          <div class="card-content">
            <div class="card-label">总点赞数</div>
            <div class="card-value">{{ summary.totalLikes }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">⭐</div>
          <div class="card-content">
            <div class="card-label">总收藏数</div>
            <div class="card-value">{{ summary.totalFavorites }}</div>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="articles-table">
        <table>
          <thead>
            <tr>
              <th @click="sortBy('path')" class="sortable">
                文章路径
                <span v-if="sortKey === 'path'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('views')" class="sortable">
                阅读量
                <span v-if="sortKey === 'views'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('likes')" class="sortable">
                点赞数
                <span v-if="sortKey === 'likes'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('favorites')" class="sortable">
                收藏数
                <span v-if="sortKey === 'favorites'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('total')" class="sortable">
                总互动量
                <span v-if="sortKey === 'total'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in sortedArticles" :key="article.path">
              <td class="article-path">{{ article.path }}</td>
              <td class="stat-number">{{ article.views }}</td>
              <td class="stat-number">{{ article.likes }}</td>
              <td class="stat-number">{{ article.favorites }}</td>
              <td class="stat-number stat-total">{{ article.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const error = ref('')
const summary = ref({
  totalArticles: 0,
  totalViews: 0,
  totalLikes: 0,
  totalFavorites: 0
})
const articles = ref([])
const sortKey = ref('total')
const sortOrder = ref('desc')

// 获取所有统计数据
const fetchAllStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/.netlify/functions/article-stats-admin')
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    const data = await response.json()
    summary.value = data.summary
    
    // 转换为数组格式
    articles.value = Object.entries(data.articles).map(([path, stats]) => ({
      path,
      views: stats.views || 0,
      likes: stats.likes || 0,
      favorites: stats.favorites || 0,
      total: (stats.views || 0) + (stats.likes || 0) + (stats.favorites || 0)
    }))
  } catch (err) {
    error.value = `获取数据失败: ${err.message}`
    console.error('Failed to fetch stats:', err)
  } finally {
    loading.value = false
  }
}

// 排序功能
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

// 排序后的文章列表
const sortedArticles = computed(() => {
  const sorted = [...articles.value]
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    if (sortKey.value === 'path') {
      aVal = aVal.toString()
      bVal = bVal.toString()
      return sortOrder.value === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
  return sorted
})

// 导出CSV
const exportCSV = () => {
  window.open('/.netlify/functions/export-stats', '_blank')
}

onMounted(() => {
  fetchAllStats()
})
</script>

<style scoped>
.stats-admin {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-header h1 {
  font-size: 2rem;
  color: var(--vp-c-text-1);
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: 1rem;
}

.btn-refresh,
.btn-export {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-refresh {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn-refresh:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.btn-export {
  background: #3b82f6;
  color: white;
}

.btn-export:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #ef4444;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.card-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.articles-table {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--vp-c-bg-mute);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-divider);
}

th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

th.sortable:hover {
  background: var(--vp-c-default-soft);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

tbody tr:hover {
  background: var(--vp-c-default-soft);
}

.article-path {
  color: var(--vp-c-text-1);
  font-family: monospace;
  font-size: 0.9rem;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-number {
  text-align: center;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.stat-total {
  color: var(--vp-c-brand-1);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .stats-admin {
    padding: 1rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .articles-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }

  .article-path {
    max-width: 200px;
  }
}
</style>

