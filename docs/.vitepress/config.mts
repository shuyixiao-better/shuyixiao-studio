import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "舒一笑不秃头的博客",
  description: "IDEA插件-PandaCoder（熊猫编码器）作者 ｜ 生成式AI应用工程师(高级)认证 | 阿里云博客专家 | Java应用开发职业技能等级认证 | HarmonyOS应用开发者基础认证",
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap' }]
  ],
  // 移除css配置，改用theme方式引入
  themeConfig: {
    // 网站logo
    logo: '/logo.png',
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '关注公众号', link: '/about/wechat/' },
      { 
        text: '专栏教程', 
        items: [
          { text: 'Java核心', link: '/tutorials/java/' },
          { text: 'Spring全家桶', link: '/tutorials/spring/' },
          { text: '微服务架构', link: '/tutorials/microservice/' },
          { text: '设计模式', link: '/tutorials/design-pattern/' },
          { text: 'Elasticsearch', link: '/tutorials/es/' }
        ]
      },
      { text: '实战项目', link: '/projects/' },
      { text: '面试宝典', link: '/interview/' },
      { 
        text: '我的工具', 
        items: [
          { text: 'PandaCoder', link: '/articles/panda-coder-intro' },
        ]
      },
      { text: '关于我', link: '/about/' }
    ],

    // 侧边栏
    sidebar: {
      '/tutorials/java/': [
        {
          text: 'Java核心',
          collapsed: false,
          items: [
            { text: 'Java基础语法', link: '/tutorials/java/basics' },
            { text: '面向对象编程', link: '/tutorials/java/oop' },
            { text: '集合框架详解', link: '/tutorials/java/collections' },
            { text: '并发编程', link: '/tutorials/java/concurrency' },
          ]
        }
      ],
      '/tutorials/spring/': [
        {
          text: 'Spring框架',
          collapsed: false,
          items: [
            { text: 'Spring核心概念', link: '/tutorials/spring/core' },
            { text: 'Spring Boot入门', link: '/tutorials/spring/boot' },
            { text: 'Spring Cloud实战', link: '/tutorials/spring/cloud' },
          ]
        }
      ],
      '/projects/': [
        {
          text: '实战项目',
          collapsed: false,
          items: [
            { text: '电商系统设计', link: '/projects/e-commerce' },
            { text: '支付系统开发', link: '/projects/payment' },
          ]
        }
      ],
      '/interview/': [
        {
          text: '面试题集',
          collapsed: false,
          items: [
            { text: 'Java面试题', link: '/interview/java' },
            { text: '数据库面试题', link: '/interview/database' },
            { text: '系统设计面试题', link: '/interview/system-design' },
          ]
        }
      ],
      '/tutorials/es/': [
        {
          text: 'Elasticsearch',
          collapsed: false,
          items: [
            { text: 'ES基础概念', link: '/tutorials/es/basics' },
            { text: '索引和文档', link: '/tutorials/es/index-document' },
            { text: '查询和搜索', link: '/tutorials/es/query-search' },
            { text: '聚合分析', link: '/tutorials/es/aggregation' },
            { text: '性能优化', link: '/tutorials/es/performance' },
          ]
        }
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuyixiao-better' },
      { icon: {
          svg: '<svg t="1632200514682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2880" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="currentColor"></path></svg>'
        }, link: 'https://gitee.com/shuyixiao-only' }
    ],

    // 页脚
    footer: {
      message: '用代码书写人生',
      copyright: 'Copyright © 2023-present 舒一笑不秃头'
    },

    // 搜索
    search: {
      provider: 'local'
    },

    // 大纲设置
    outline: {
      level: [2, 3],
      label: '目录'
    },

    // 文章元数据
    lastUpdated: {
      text: '最后更新于'
    },

    // 文章导航
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/shuyixiaobutuotou/blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    }
  }
})
