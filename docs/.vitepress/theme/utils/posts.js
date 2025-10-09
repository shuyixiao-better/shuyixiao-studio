import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

/**
 * 获取所有文章数据
 * @returns {Promise<Array>} 文章列表
 */
export async function getPosts() {
  const paths = await globby([
    'docs/**/*.md',
    '!docs/index.md',
    '!docs/.vitepress/**',
    '!docs/**/index.md',
    '!docs/api-examples.md',
    '!docs/markdown-examples.md',
    '!docs/about/wechat.md'
  ])

  const posts = []

  for (const filePath of paths) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: markdownContent } = matter(content)
    const stats = fs.statSync(filePath)

    // 从文件路径生成URL
    const url = '/' + filePath
      .replace(/^docs\//, '')
      .replace(/\.md$/, '')

    // 提取描述（如果没有description，从内容中提取第一段）
    let description = data.description || ''
    if (!description && markdownContent) {
      const firstParagraph = markdownContent
        .split('\n')
        .find(line => line.trim() && !line.startsWith('#') && !line.startsWith('---'))
      description = firstParagraph ? firstParagraph.substring(0, 150) : ''
    }

    posts.push({
      title: data.title || '未命名文章',
      description,
      url,
      date: data.date || stats.mtime,
      tags: data.tags || [],
      // 阅读量、点赞数等可以后续从数据库获取，这里先用默认值
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0
    })
  }

  // 按日期排序，最新的在前面
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  return posts
}

/**
 * 获取最新的N篇文章
 * @param {number} count - 文章数量
 * @returns {Promise<Array>} 最新文章列表
 */
export async function getLatestPosts(count = 3) {
  const posts = await getPosts()
  return posts.slice(0, count)
}

