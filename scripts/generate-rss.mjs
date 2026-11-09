#!/usr/bin/env node

/**
 * RSS Feed 生成脚本
 * 功能：在构建时自动生成 RSS 2.0 格式的 XML 文件
 * 使用：node scripts/generate-rss.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { globby } from 'globby'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 配置
const RSS_CONFIG = {
  title: '境焕说AI的技术博客',
  link: 'https://www.poeticcoder.com',
  description: '专注于AI工程化落地的技术博客 | IDEA插件-PandaCoder作者 | 持续输出优质技术内容',
  language: 'zh-CN',
  managingEditor: 'shuyixiao@example.com (境焕说AI)',
  webMaster: 'shuyixiao@example.com (境焕说AI)',
  copyright: 'Copyright © 2023-present 境焕说AI',
  ttl: 60,
  generator: 'VitePress RSS Generator',
  maxItems: 50,
  author: '境焕说AI'
}

// 格式化日期为 RSS 标准格式
function formatRSSTime(date) {
  return new Date(date).toUTCString()
}

// 转义 XML 特殊字符
function escapeXml(unsafe) {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 生成 RSS XML
function generateRSSXML(posts) {
  const now = new Date()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(RSS_CONFIG.title)}</title>
    <link>${RSS_CONFIG.link}</link>
    <description>${escapeXml(RSS_CONFIG.description)}</description>
    <language>${RSS_CONFIG.language}</language>
    <managingEditor>${RSS_CONFIG.managingEditor}</managingEditor>
    <webMaster>${RSS_CONFIG.webMaster}</webMaster>
    <copyright>${escapeXml(RSS_CONFIG.copyright)}</copyright>
    <lastBuildDate>${formatRSSTime(now)}</lastBuildDate>
    <pubDate>${formatRSSTime(now)}</pubDate>
    <generator>${RSS_CONFIG.generator}</generator>
    <ttl>${RSS_CONFIG.ttl}</ttl>
    <atom:link href="${RSS_CONFIG.link}/rss.xml" rel="self" type="application/rss+xml"/>
`
  
  // 添加文章条目
  for (const post of posts) {
    const postUrl = post.url.startsWith('http') ? post.url : RSS_CONFIG.link + post.url
    const postDate = formatRSSTime(post.date)
    
    xml += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${postDate}</pubDate>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
`
    
    // 添加标签
    if (post.tags && post.tags.length > 0) {
      for (const tag of post.tags) {
        xml += `      <category>${escapeXml(tag)}</category>
`
      }
    }
    
    xml += `    </item>
`
  }
  
  xml += `  </channel>
</rss>`
  
  return xml
}

// 获取所有文章数据
async function getPostsData() {
  try {
    const posts = []
    const docsPath = path.resolve(__dirname, '../docs')
    
    // 遍历所有 Markdown 文件
    const files = await globby([
      '**/*.md',
      '!index.md',
      '!.vitepress/**',
      '!**/index.md',
      '!api-examples.md',
      '!markdown-examples.md',
      '!about/**'
    ], { cwd: docsPath })
    
    for (const file of files) {
      const filePath = path.join(docsPath, file)
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { data, content: markdownContent } = matter(content)
        
        if (!data.title || !data.date) continue
        
        // 生成文章 URL
        const url = '/' + file.replace(/\.md$/, '')
        
        // 提取描述或生成摘要
        let description = data.description || ''
        if (!description && markdownContent) {
          // 从内容中提取前 200 个字符作为摘要
          const text = markdownContent
            .replace(/```[\s\S]*?```/g, '') // 去除代码块
            .replace(/#+\s/g, '') // 去除标题标记
            .replace(/\*\*/g, '') // 去除粗体标记
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 转换链接
            .trim()
          
          description = text.substring(0, 200) + (text.length > 200 ? '...' : '')
        }
        
        posts.push({
          title: data.title,
          description: description,
          url: url,
          date: data.date,
          tags: data.tags || [],
          author: data.author || RSS_CONFIG.author
        })
      } catch (error) {
        console.warn(`⚠️  Failed to process file ${file}:`, error.message)
      }
    }
    
    // 按日期排序，最新的在前面
    posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // 限制文章数量
    return posts.slice(0, RSS_CONFIG.maxItems)
    
  } catch (error) {
    console.error('❌ Error loading posts:', error)
    return []
  }
}

// 主函数
async function main() {
  console.log('📡 Generating RSS Feed...')
  
  try {
    // 获取文章数据
    const posts = await getPostsData()
    console.log(`✅ Loaded ${posts.length} posts`)
    
    if (posts.length === 0) {
      console.warn('⚠️  No posts found, skipping RSS generation')
      return
    }
    
    // 生成 RSS XML
    const xml = generateRSSXML(posts)
    
    // 确保输出目录存在
    const outputDir = path.resolve(__dirname, '../docs/.vitepress/dist')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // 写入文件
    const outputPath = path.join(outputDir, 'rss.xml')
    fs.writeFileSync(outputPath, xml, 'utf-8')
    
    console.log(`✅ RSS Feed generated: ${outputPath}`)
    console.log(`📊 Contains ${posts.length} posts`)
    
  } catch (error) {
    console.error('❌ Failed to generate RSS:', error)
    process.exit(1)
  }
}

// 运行
main()

