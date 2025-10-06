import { getStore } from '@netlify/blobs'

// 获取Blob存储实例
function getBlobStore() {
  return getStore({
    name: 'article-stats',
    siteID: process.env.SITE_ID,
    token: process.env.NETLIFY_TOKEN || process.env.NETLIFY_ACCESS_TOKEN
  })
}

// 读取统计数据
async function readStats(store) {
  try {
    const data = await store.get('stats', { type: 'json' })
    return data || {}
  } catch (error) {
    console.error('Read stats error:', error)
    return {}
  }
}

// 写入统计数据
async function writeStats(store, stats) {
  try {
    await store.set('stats', JSON.stringify(stats))
    return true
  } catch (error) {
    console.error('Write stats error:', error)
    return false
  }
}

// 获取文章统计
function getArticleStats(stats, articleId) {
  if (!stats[articleId]) {
    stats[articleId] = {
      views: 0,
      likes: 0,
      favorites: 0
    }
  }
  return stats[articleId]
}

export async function handler(event, context) {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // 处理 OPTIONS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    const store = getBlobStore()
    const stats = await readStats(store)

    // GET 请求：获取统计数据
    if (event.httpMethod === 'GET') {
      const articleId = event.queryStringParameters?.articleId

      if (!articleId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing articleId parameter' })
        }
      }

      const articleStats = getArticleStats(stats, articleId)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articleStats)
      }
    }

    // POST 请求：更新统计数据
    if (event.httpMethod === 'POST') {
      const { articleId, action } = JSON.parse(event.body || '{}')

      if (!articleId || !action) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing articleId or action' })
        }
      }

      const articleStats = getArticleStats(stats, articleId)

      // 根据操作类型更新统计
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
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action' })
          }
      }

      // 保存更新后的统计数据
      stats[articleId] = articleStats
      const saved = await writeStats(store, stats)

      if (!saved) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to save stats' })
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articleStats)
      }
    }

    // 不支持的方法
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Error in article-stats function:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
}
