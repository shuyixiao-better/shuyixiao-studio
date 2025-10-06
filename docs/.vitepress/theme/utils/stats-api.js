// 统计数据API工具类

// 判断是否为开发环境
const isDev = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' ||
   import.meta.env.DEV)

// 本地存储键前缀
const STORAGE_PREFIX = 'article_stats_'

// 开发环境使用localStorage模拟API
class LocalStatsAPI {
  getStats() {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}all`)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  saveStats(stats) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}all`, JSON.stringify(stats))
    } catch (error) {
      console.error('Failed to save stats:', error)
    }
  }

  async fetchArticleStats(articleId) {
    const stats = this.getStats()
    return stats[articleId] || { views: 0, likes: 0, favorites: 0 }
  }

  async updateArticleStats(articleId, action) {
    const stats = this.getStats()
    
    if (!stats[articleId]) {
      stats[articleId] = { views: 0, likes: 0, favorites: 0 }
    }

    const articleStats = stats[articleId]

    switch (action) {
      case 'view':
        articleStats.views += 1
        break
      case 'like':
        articleStats.likes += 1
        break
      case 'unlike':
        articleStats.likes = Math.max(0, articleStats.likes - 1)
        break
      case 'favorite':
        articleStats.favorites += 1
        break
      case 'unfavorite':
        articleStats.favorites = Math.max(0, articleStats.favorites - 1)
        break
    }

    stats[articleId] = articleStats
    this.saveStats(stats)

    return articleStats
  }
}

// 生产环境使用Netlify Functions
class RemoteStatsAPI {
  async fetchArticleStats(articleId) {
    try {
      const response = await fetch(`/.netlify/functions/article-stats?articleId=${encodeURIComponent(articleId)}`)
      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to fetch stats')
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return { views: 0, likes: 0, favorites: 0 }
    }
  }

  async updateArticleStats(articleId, action) {
    try {
      const response = await fetch('/.netlify/functions/article-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articleId,
          action
        })
      })

      if (response.ok) {
        return await response.json()
      }
      throw new Error('Failed to update stats')
    } catch (error) {
      console.error('Failed to update stats:', error)
      // 返回当前值，不更新
      return this.fetchArticleStats(articleId)
    }
  }
}

// 导出统一的API接口
export const statsAPI = isDev ? new LocalStatsAPI() : new RemoteStatsAPI()

