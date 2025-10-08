import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 根据部署环境自动设置 base 路径
// 使用自定义域名时，GitHub Pages 和 Netlify 都部署到根路径
// 如果未来不使用自定义域名，需要改为：'/shuyixiao-studio/'
const base = '/'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  base,
  
  title: "舒一笑不秃头的博客",
  description: "IDEA插件-PandaCoder（熊猫编码器）作者 ｜ 生成式AI应用工程师(高级)认证 | 阿里云博客专家 | Java应用开发职业技能等级认证 | HarmonyOS应用开发者基础认证",
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
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
          { text: 'Elasticsearch', link: '/tutorials/es/' },
          { text: '每周一道算法题', link: '/tutorials/algorithm/' },
          { text: '代码与人生', link: '/tutorials/insights/' }
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
            {
              text: '基础入门',
              collapsed: true,
              items: [
                { text: 'ES基础概念', link: '/tutorials/es/ES基础概念' },
                { text: 'Elasticsearch安装配置', link: '/tutorials/es/basics/installation' },
                { text: 'Elasticsearch如何查看索引列表', link: '/tutorials/es/basics/Elasticsearch如何查看索引列表' },
                { text: 'Elasticsearch分片的基本策略', link: '/tutorials/es/basics/Elasticsearch分片的基本策略' },
                { text: 'Elasticsearch健康值检查', link: '/tutorials/es/basics/Elasticsearch健康值检查' },
                { text: '为什么在ES不能简单地说索引等于表', link: '/tutorials/es/basics/为什么在ES不能简单地说索引等于表' },
                { text: 'Elasticsearch元数据与源数据详解', link: '/tutorials/es/basics/Elasticsearch元数据与源数据详解' },
                { text: '映射的基本概念', link: '/tutorials/es/basics/映射的基本概念' },
                { text: 'ES字段数据类型讲解基础版', link: '/tutorials/es/basics/ES字段数据类型讲解基础版' },
                { text: 'ES常用数字类型故事版', link: '/tutorials/es/basics/ES常用数字类型故事版' },
                { text: 'ES常用基本数据类型故事版', link: '/tutorials/es/basics/ES常用基本数据类型故事版' },
                { text: 'ES常用Keywords类型故事版', link: '/tutorials/es/basics/ES常用Keywords类型故事版' },
                { text: 'ES常用Dates（时间类型）故事版', link: '/tutorials/es/basics/ES常用Dates（时间类型）故事版' },
                { text: 'ES常用对象类型故事版', link: '/tutorials/es/basics/ES常用对象类型故事版' },
                { text: 'ES常用空间数据类型故事版', link: '/tutorials/es/basics/ES常用空间数据类型故事版' },
                { text: 'ES常用文档排名类型故事版', link: '/tutorials/es/basics/ES常用文档排名类型故事版' },
                { text: 'ES常用文本搜索类型故事版', link: '/tutorials/es/basics/ES常用文本搜索类型故事版' },
                { text: 'ES动态映射（Dynamic Field Mapping）故事版', link: '/tutorials/es/basics/ES动态映射（Dynamic Field Mapping）故事版' },
                { text: 'ES中Text vs Keyword故事版', link: '/tutorials/es/basics/ES中Text vs Keyword故事版' },
                { text: 'ES中映射参数故事版', link: '/tutorials/es/basics/ES中映射参数故事版' },
                { text: 'ES中分析器（Analyzer）故事版', link: '/tutorials/es/basics/ES中分析器（Analyzer）故事版' },
                { text: 'ES中Boost 参数故事版', link: '/tutorials/es/basics/ES中Boost参数故事版' },
                { text: 'ES中Coerce 参数故事版', link: '/tutorials/es/basics/ES中Coerce参数故事版' },
                { text: 'ES中Copy_to 参数故事版', link: '/tutorials/es/basics/ES中Copy_to参数故事版' },
                { text: 'ES中Doc_Values 与 Fielddata 故事版', link: '/tutorials/es/basics/ES中Doc_Values 与 Fielddata 故事版' },
                { text: 'ES中Dynamic 参数故事版', link: '/tutorials/es/basics/ES中Dynamic 参数故事版' },
                { text: 'ES中ignore_above参数故事版', link: '/tutorials/es/basics/ES中ignore_above参数故事版' },
                { text: 'ES中ignore_malformed参数故事版', link: '/tutorials/es/basics/ES中ignore_malformed参数故事版' },
                { text: 'ES中index参数故事版', link: '/tutorials/es/basics/ES中index参数故事版' },
                { text: 'ES中index_options参数故事版', link: '/tutorials/es/basics/ES中index_options参数故事版' },
                { text: 'ES中norms参数故事版', link: '/tutorials/es/basics/ES中norms参数故事版' }
              ]
            },
            {
              text: '索引与文档',
              collapsed: true,
              items: [
                { text: '索引命名规范', link: '/tutorials/es/index-document/索引命名规范' },
                { text: '索引的不可变性解决方案', link: '/tutorials/es/index-document/索引的不可变性解决方案' },
                { text: '查询索引&特定索引', link: '/tutorials/es/index-document/查询索引&特定索引' },
                { text: '索引CRUD操作', link: '/tutorials/es/index-document/索引CRUD操作' },
                { text: '映射与字段类型', link: '/tutorials/es/index-document/mapping-types' }
              ]
            },
            {
              text: '查询与搜索',
              collapsed: true,
              items: [
                { text: '查询和搜索', link: '/tutorials/es/query-search' },
                { text: 'DSL查询语法详解', link: '/tutorials/es/query-search/dsl-query' },
                { text: '全文搜索与匹配', link: '/tutorials/es/query-search/full-text-search' },
                { text: '复合查询与过滤器', link: '/tutorials/es/query-search/compound-queries' }
              ]
            },
            {
              text: '聚合分析',
              collapsed: true,
              items: [
                { text: '聚合分析', link: '/tutorials/es/aggregation' },
                { text: '指标聚合详解', link: '/tutorials/es/aggregation/metric-aggregations' },
                { text: '桶聚合与分组', link: '/tutorials/es/aggregation/bucket-aggregations' },
                { text: '管道聚合应用', link: '/tutorials/es/aggregation/pipeline-aggregations' }
              ]
            },
            {
              text: '性能优化',
              collapsed: true,
              items: [
                { text: '性能优化', link: '/tutorials/es/performance' },
                { text: '索引性能调优', link: '/tutorials/es/performance/index-optimization' },
                { text: '查询性能优化', link: '/tutorials/es/performance/query-optimization' },
                { text: '集群监控与运维', link: '/tutorials/es/performance/cluster-monitoring' }
              ]
            }
          ]
        }
      ],
      '/tutorials/algorithm/': [
        {
          text: '每周一道算法题',
          collapsed: false,
          items: [
            {
              text: '数组与字符串',
              collapsed: true,
              items: [
                { text: '加一', link: '/tutorials/algorithm/array-string/加一' },
                { text: '两数之和', link: '/tutorials/algorithm/array-string/two-sum' },
                { text: '最长无重复子串', link: '/tutorials/algorithm/array-string/longest-substring' },
                { text: '盛最多水的容器', link: '/tutorials/algorithm/array-string/container-with-most-water' },
                { text: '三数之和', link: '/tutorials/algorithm/array-string/three-sum' }
              ]
            },
            {
              text: '链表操作',
              collapsed: true,
              items: [
                { text: '反转链表', link: '/tutorials/algorithm/linked-list/reverse-linked-list' },
                { text: '合并两个有序链表', link: '/tutorials/algorithm/linked-list/merge-two-sorted-lists' },
                { text: '环形链表检测', link: '/tutorials/algorithm/linked-list/linked-list-cycle' },
                { text: '删除链表的倒数第N个节点', link: '/tutorials/algorithm/linked-list/remove-nth-node' }
              ]
            },
            {
              text: '树与图',
              collapsed: true,
              items: [
                { text: '二叉树的最大深度', link: '/tutorials/algorithm/tree-graph/maximum-depth-of-binary-tree' },
                { text: '验证二叉搜索树', link: '/tutorials/algorithm/tree-graph/validate-binary-search-tree' },
                { text: '路径总和', link: '/tutorials/algorithm/tree-graph/path-sum' },
                { text: '岛屿数量', link: '/tutorials/algorithm/tree-graph/number-of-islands' }
              ]
            },
            {
              text: '动态规划',
              collapsed: true,
              items: [
                { text: '爬楼梯', link: '/tutorials/algorithm/dynamic-programming/climbing-stairs' },
                { text: '最长递增子序列', link: '/tutorials/algorithm/dynamic-programming/longest-increasing-subsequence' },
                { text: '零钱兑换', link: '/tutorials/algorithm/dynamic-programming/coin-change' },
                { text: '编辑距离', link: '/tutorials/algorithm/dynamic-programming/edit-distance' }
              ]
            },
            {
              text: '贪心算法',
              collapsed: true,
              items: [
                { text: '买卖股票的最佳时机', link: '/tutorials/algorithm/greedy/best-time-to-buy-and-sell-stock' },
                { text: '跳跃游戏', link: '/tutorials/algorithm/greedy/jump-game' },
                { text: '加油站', link: '/tutorials/algorithm/greedy/gas-station' },
                { text: '分发饼干', link: '/tutorials/algorithm/greedy/assign-cookies' }
              ]
            },
            {
              text: '回溯算法',
              collapsed: true,
              items: [
                { text: '全排列', link: '/tutorials/algorithm/backtracking/permutations' },
                { text: '组合总和', link: '/tutorials/algorithm/backtracking/combination-sum' },
                { text: 'N皇后问题', link: '/tutorials/algorithm/backtracking/n-queens' },
                { text: '单词搜索', link: '/tutorials/algorithm/backtracking/word-search' }
              ]
            },
            {
              text: '排序与搜索',
              collapsed: true,
              items: [
                { text: '快速排序实现', link: '/tutorials/algorithm/sort-search/quick-sort' },
                { text: '归并排序实现', link: '/tutorials/algorithm/sort-search/merge-sort' },
                { text: '二分查找', link: '/tutorials/algorithm/sort-search/binary-search' },
                { text: '寻找旋转排序数组中的最小值', link: '/tutorials/algorithm/sort-search/find-minimum-in-rotated-sorted-array' }
              ]
            }
          ]
        }
      ],
      '/tutorials/insights/': [
        {
          text: '代码与人生',
          collapsed: false,
          items: [
            {
              text: '技术成长感悟',
              collapsed: true,
              items: [
                { text: '从菜鸟到架构师的成长之路', link: '/tutorials/insights/growth/from-junior-to-architect' },
                { text: '技术选型的艺术与哲学', link: '/tutorials/insights/growth/technology-selection' },
                { text: '代码重构的智慧', link: '/tutorials/insights/growth/code-refactoring' },
                { text: '技术债务的思考', link: '/tutorials/insights/growth/technical-debt' },
                { text: '程序员如何学习技术', link: '/tutorials/insights/growth/程序员如何学习技术' }
              ]
            },
            {
              text: '职场人生思考',
              collapsed: true,
              items: [
                { text: '程序员的职业规划', link: '/tutorials/insights/career/career-planning' },
                { text: '技术管理者的修炼', link: '/tutorials/insights/career/tech-management' },
                { text: '团队协作的艺术', link: '/tutorials/insights/career/team-collaboration' },
                { text: '职场沟通技巧', link: '/tutorials/insights/career/workplace-communication' }
              ]
            },
            {
              text: '学习心得分享',
              collapsed: true,
              items: [
                { text: '如何高效学习新技术', link: '/tutorials/insights/learning/learn-new-tech' },
                { text: '阅读源码的正确姿势', link: '/tutorials/insights/learning/read-source-code' },
                { text: '技术博客写作心得', link: '/tutorials/insights/learning/tech-blog-writing' },
                { text: '知识体系的构建', link: '/tutorials/insights/learning/knowledge-system' }
              ]
            },
            {
              text: '生活智慧点滴',
              collapsed: true,
              items: [
                { text: '程序员的健康生活', link: '/tutorials/insights/life-wisdom/healthy-living' },
                { text: '工作与生活的平衡', link: '/tutorials/insights/life-wisdom/work-life-balance' },
                { text: '时间管理的艺术', link: '/tutorials/insights/life-wisdom/time-management' },
                { text: '兴趣爱好的培养', link: '/tutorials/insights/life-wisdom/hobbies' }
              ]
            },
            {
              text: '创业与梦想',
              collapsed: true,
              items: [
                { text: '技术创业的思考', link: '/tutorials/insights/entrepreneurship/tech-startup' },
                { text: '产品思维的重要性', link: '/tutorials/insights/entrepreneurship/product-thinking' },
                { text: '产品思维的重要性之技术文章', link: '/tutorials/insights/entrepreneurship/产品思维的重要性之技术文章' },
                { text: '从技术到商业的转变', link: '/tutorials/insights/entrepreneurship/tech-to-business' },
                { text: '创业路上的坑与收获', link: '/tutorials/insights/entrepreneurship/startup-journey' }
              ]
            },
            {
              text: '时间与效率',
              collapsed: true,
              items: [
                { text: '番茄工作法的实践', link: '/tutorials/insights/time-efficiency/pomodoro-technique' },
                { text: '深度工作的力量', link: '/tutorials/insights/time-efficiency/deep-work' },
                { text: '任务优先级管理', link: '/tutorials/insights/time-efficiency/task-priority' },
                { text: '效率工具的使用心得', link: '/tutorials/insights/time-efficiency/efficiency-tools' }
              ]
            },
            {
              text: '心态与格局',
              collapsed: true,
              items: [
                { text: '程序员的格局修炼', link: '/tutorials/insights/mindset/developer-mindset' },
                { text: '面对挫折的心态调整', link: '/tutorials/insights/mindset/dealing-with-failure' },
                { text: '持续学习的内驱力', link: '/tutorials/insights/mindset/continuous-learning' },
                { text: '技术人的价值观', link: '/tutorials/insights/mindset/tech-values' }
              ]
            }
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

    // 大纲设置（从h2到h4）
    outline: {
      level: [2, 4],
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
  },

  // Mermaid 配置
  mermaid: {
    // 可选配置项
  },
  mermaidPlugin: {
    class: "mermaid my-class" // 设置额外类名，可选
  }
}))
