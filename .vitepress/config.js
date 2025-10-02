import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: '舒一笑不秃头',
    description: '技术博客与学习笔记',
    
    // Mermaid配置
    mermaid: {
      // Mermaid主题配置
      theme: 'default',
      // 其他Mermaid配置
      themeVariables: {
        primaryColor: '#646cff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#646cff',
        lineColor: '#646cff'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      securityLevel: 'loose'
    },
    
    // MermaidPlugin配置
    mermaidPlugin: {
      class: 'mermaid-wrapper' // 自定义CSS类名
    },
  
  // 主题配置
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/articles/' },
      { text: '关于', link: '/about/' }
    ],
    
    sidebar: {
      '/articles/': [
        {
          text: '技术文章',
          items: [
            { text: '设计模式实战', link: '/articles/design-patterns' },
            { text: 'Spring Boot Starter开发', link: '/articles/spring-boot-starter' },
            { text: '微服务通信方案选型', link: '/articles/microservice-communication' },
            { text: 'PandaCoder介绍', link: '/articles/panda-coder-intro' }
          ]
        }
      ]
    }
  }
})
)
