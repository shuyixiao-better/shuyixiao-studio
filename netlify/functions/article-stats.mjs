import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据存储路径
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const STATS_FILE = path.join(DATA_DIR, 'article-stats.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// 读取统计数据
async function readStats() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(STATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // 文件不存在或解析错误，返回空对象
    return {}
  }
}

// 写入统计数据
async function writeStats(stats) {
  await ensureDataDir()
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8')
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
    const stats = await readStats()

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
      await writeStats(stats)

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

