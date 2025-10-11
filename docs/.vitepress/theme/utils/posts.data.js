import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: true,  // 包含文章源内容以计算字数
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
        // 计算文章字数（去除markdown语法、代码块等）
        let wordCount = 0
        if (page.src) {
          // 去除frontmatter
          const content = page.src.replace(/^---[\s\S]*?---/, '')
          // 去除代码块
          const withoutCode = content.replace(/```[\s\S]*?```/g, '')
          // 去除行内代码
          const withoutInlineCode = withoutCode.replace(/`[^`]*`/g, '')
          // 去除markdown标记符号
          const withoutMarkdown = withoutInlineCode
            .replace(/#+\s/g, '') // 标题
            .replace(/\*\*/g, '')  // 粗体
            .replace(/\*/g, '')    // 斜体
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 链接
            .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // 图片
          // 计算字数（中文字符 + 英文单词）
          const chineseChars = withoutMarkdown.match(/[\u4e00-\u9fa5]/g) || []
          const englishWords = withoutMarkdown.match(/[a-zA-Z]+/g) || []
          wordCount = chineseChars.length + englishWords.length
        }
        
        // 提取文章信息
        return {
          title: page.frontmatter.title,
          description: page.frontmatter.description || '',
          url: page.url,
          date: page.frontmatter.date || new Date().toISOString(),
          tags: page.frontmatter.tags || [],
          views: page.frontmatter.views || 0,
          likes: page.frontmatter.likes || 0,
          comments: page.frontmatter.comments || 0,
          wordCount: wordCount  // 添加字数统计
        }
      })
      .sort((a, b) => {
        // 按日期排序，最新的在前面
        return new Date(b.date) - new Date(a.date)
      })

    return posts
  }
})

