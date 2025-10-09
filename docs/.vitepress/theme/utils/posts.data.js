import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    // 过滤掉不需要的文件，只保留真正的文章
    const posts = rawData
      .filter(page => {
        const url = page.url
        const frontmatter = page.frontmatter
        
        // 必须有title才算是文章
        if (!frontmatter.title) {
          return false
        }
        
        // 排除特定页面和目录
        if (url === '/' || 
            url.startsWith('/about') ||
            url.includes('/api-examples') ||
            url.includes('/markdown-examples') ||
            url.endsWith('/index') ||
            url.includes('/.vitepress/')) {
          return false
        }
        
        // 只包含有date字段的文章
        // 这样可以排除那些教程索引页和其他非文章页面
        return !!frontmatter.date
      })
      .map(page => {
        // 提取文章信息
        return {
          title: page.frontmatter.title,
          description: page.frontmatter.description || '',
          url: page.url,
          date: page.frontmatter.date || new Date().toISOString(),
          tags: page.frontmatter.tags || [],
          views: page.frontmatter.views || 0,
          likes: page.frontmatter.likes || 0,
          comments: page.frontmatter.comments || 0
        }
      })
      .sort((a, b) => {
        // 按日期排序，最新的在前面
        return new Date(b.date) - new Date(a.date)
      })

    return posts
  }
})

