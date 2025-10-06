import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据存储路径
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const STATS_FILE = path.join(DATA_DIR, 'article-stats.json')

// 读取所有统计数据
async function readAllStats() {
  try {
    const data = await fs.readFile(STATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

export async function handler(event, context) {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // 只支持 GET 请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const allStats = await readAllStats()
    
    // 计算总体统计
    const totalStats = {
      totalArticles: Object.keys(allStats).length,
      totalViews: 0,
      totalLikes: 0,
      totalFavorites: 0
    }

    Object.values(allStats).forEach(stats => {
      totalStats.totalViews += stats.views || 0
      totalStats.totalLikes += stats.likes || 0
      totalStats.totalFavorites += stats.favorites || 0
    })

    // 返回完整统计数据
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        summary: totalStats,
        articles: allStats
      })
    }

  } catch (error) {
    console.error('Error in article-stats-admin function:', error)
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

