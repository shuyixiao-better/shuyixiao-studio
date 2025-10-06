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

// 将统计数据转换为CSV格式
function convertToCSV(stats) {
  const headers = ['文章路径', '阅读量', '点赞量', '收藏量', '总互动量']
  const rows = [headers.join(',')]

  Object.entries(stats).forEach(([articleId, data]) => {
    const totalEngagement = (data.views || 0) + (data.likes || 0) + (data.favorites || 0)
    const row = [
      `"${articleId}"`,
      data.views || 0,
      data.likes || 0,
      data.favorites || 0,
      totalEngagement
    ]
    rows.push(row.join(','))
  })

  // 添加总计行
  const totals = Object.values(stats).reduce((acc, data) => {
    acc.views += data.views || 0
    acc.likes += data.likes || 0
    acc.favorites += data.favorites || 0
    return acc
  }, { views: 0, likes: 0, favorites: 0 })

  const totalEngagement = totals.views + totals.likes + totals.favorites
  rows.push('')
  rows.push(['总计', totals.views, totals.likes, totals.favorites, totalEngagement].join(','))

  return rows.join('\n')
}

export async function handler(event, context) {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    const csv = convertToCSV(allStats)

    // 返回CSV文件
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="article-stats-${new Date().toISOString().split('T')[0]}.csv"`
      },
      body: '\uFEFF' + csv // 添加BOM以支持中文
    }

  } catch (error) {
    console.error('Error in export-stats function:', error)
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    }
  }
}

