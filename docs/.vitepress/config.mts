import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 根据部署环境自动设置 base 路径
// GitHub Pages 使用自定义域名: www.poeticcoder.cn
// Netlify 使用自定义域名: www.poeticcoder.com 等
// 两个平台都使用自定义域名，所以 base 都是根路径
const base = '/'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  base,
  
  title: "舒一笑不秃头的博客",
  description: "IDEA插件-PandaCoder（熊猫编码器）作者 ｜ 生成式AI应用工程师(高级)认证 | 专注于AI工程化落地 | 阿里云博客专家 | Java应用开发职业技能等级认证 | HarmonyOS应用开发者基础认证",
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    // JetBrains Mono 字体用于代码显示
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }],
    // RSS Feed
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: 'https://www.poeticcoder.com/rss.xml', title: '舒一笑不秃头的技术博客 RSS Feed' }],
    // 百度统计
    ['script', {}, 
      "var _hmt = _hmt || [];(function(){var hm = document.createElement(\"script\");hm.src = \"https://hm.baidu.com/hm.js?dcaa1737f45a913780e610c5fbca5c42\";var s = document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(hm, s);})();"
    ]
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
          { text: 'RAG从入门到精通', link: '/tutorials/rag/' },
          { text: '每周一道算法题', link: '/tutorials/algorithm/' },
          { text: '代码与人生', link: '/tutorials/insights/' },
          { text: '拾遗录', link: '/tutorials/explorations/' },
          { text: '筑·匠', link: '/tutorials/architecture/' },
          { text: '漫思录', link: '/tutorials/musings/' }
        ]
      },
      { text: '实战项目', link: '/projects/' },
      { text: '拾珍录', link: '/tutorials/treasures/' },
      { text: '面试宝典', link: '/interview/' },
      { text: '我的工具', link: '/tools/' },
      { text: 'RSS 订阅', link: '/rss/' },
      { text: '关于我', link: '/about/' }
    ],

    // 侧边栏
    sidebar: {
      '/articles/panda-coder-intro': [
        {
          text: 'PandaCoder介绍',
          collapsed: false,
          items: [
            { text: '插件简介', link: '/articles/panda-coder-intro#插件简介' },
            { text: '主要功能', link: '/articles/panda-coder-intro#主要功能' },
            { text: '技术特点', link: '/articles/panda-coder-intro#技术特点' },
            { text: '使用场景', link: '/articles/panda-coder-intro#使用场景' },
            { text: '安装与配置', link: '/articles/panda-coder-intro#安装与配置' }
          ]
        },
        {
          text: '版本日志',
          collapsed: false,
          items: [
            { text: 'v2.4.5 (敬请期待)', link: '/articles/panda-coder-intro#v2-4-5-敬请期待' },
            { text: 'v2.4.4 (2025-11-1)', link: '/articles/panda-coder-intro#v2-4-4-2025-11-1' },
            { text: 'v2.4.3 (2025-10-31)', link: '/articles/panda-coder-intro#v2-4-3-2025-10-31' },
            { text: 'v2.4.2 (2025-10-29)', link: '/articles/panda-coder-intro#v2-4-2-2025-10-29' },
            { text: 'v2.4.1 (2025-10-28)', link: '/articles/panda-coder-intro#v2-4-1-2025-10-28' },
            { text: 'v2.4.0 (2025-10-25)', link: '/articles/panda-coder-intro#v2-4-0-2025-10-25' },
            { text: 'v2.3.0 (2025-10-25)', link: '/articles/panda-coder-intro#v2-3-0-2025-10-25' },
            { text: 'v2.2.0 (2025-10-23)', link: '/articles/panda-coder-intro#v2-2-0-2025-10-23' },
            { text: 'v2.1.0 (2025-10-23)', link: '/articles/panda-coder-intro#v2-1-0-2025-10-23' },
            { text: 'v2.0.0 (2025-10-19)', link: '/articles/panda-coder-intro#v2-0-0-2025-10-19' },
            { text: 'v1.1.9 (2024-12-21)', link: '/articles/panda-coder-intro#v1-1-9-2024-12-21' },
            { text: 'v1.1.8 (2024-12-20)', link: '/articles/panda-coder-intro#v1-1-8-2024-12-20' },
            { text: 'v1.1.7 (2024-12-19)', link: '/articles/panda-coder-intro#v1-1-7-2024-12-19' },
            { text: 'v1.1.6 (2024-11-15)', link: '/articles/panda-coder-intro#v1-1-6-2024-11-15' },
            { text: 'v1.1.5 (2024-10-20)', link: '/articles/panda-coder-intro#v1-1-5-2024-10-20' },
            { text: 'v1.1.4 (2024-09-25)', link: '/articles/panda-coder-intro#v1-1-4-2024-09-25' },
            { text: 'v1.1.3 (2024-08-30)', link: '/articles/panda-coder-intro#v1-1-3-2024-08-30' },
            { text: 'v1.1.2 (2024-08-15)', link: '/articles/panda-coder-intro#v1-1-2-2024-08-15' },
            { text: 'v1.1.1 (2024-08-01)', link: '/articles/panda-coder-intro#v1-1-1-2024-08-01' },
            { text: 'v1.1.0 (2024-07-15)', link: '/articles/panda-coder-intro#v1-1-0-2024-07-15' },
            { text: 'v1.0.0 (2024-06-01)', link: '/articles/panda-coder-intro#v1-0-0-2024-06-01' }
          ]
        }
      ],
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
            { text: 'shuyixiao-agent：AI Agent 项目', link: '/projects/shuyixiao-agent' },
            { text: 'TorchV Unstructured：强大的文档解析库', link: '/projects/torchv-unstructured' },
            { text: 'TorchV Unstructured 优化建议', link: '/projects/torchv-unstructured-optimization' }
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
      '/tutorials/rag/': [
        {
          text: 'RAG从入门到精通',
          collapsed: false,
          items: [
            { text: '专栏介绍', link: '/tutorials/rag/' },
            {
              text: 'RAG基础概念',
              collapsed: true,
              items: [
                { text: '什么是RAG', link: '/tutorials/rag/basics/what-is-rag' },
                { text: 'RAG的核心组件', link: '/tutorials/rag/basics/core-components' },
                { text: 'RAG vs 传统搜索', link: '/tutorials/rag/basics/rag-vs-traditional-search' },
                { text: 'RAG的应用场景', link: '/tutorials/rag/basics/use-cases' }
              ]
            },
            {
              text: '文档处理与向量化',
              collapsed: true,
              items: [
                { text: '文档解析技术', link: '/tutorials/rag/document-processing/document-parsing' },
                { text: '文本分块策略', link: '/tutorials/rag/document-processing/text-chunking' },
                { text: '向量化模型选择', link: '/tutorials/rag/document-processing/embedding-models' },
                { text: '向量数据库选型', link: '/tutorials/rag/document-processing/vector-databases' }
              ]
            },
            {
              text: '检索技术进阶',
              collapsed: true,
              items: [
                { text: '相似度检索算法', link: '/tutorials/rag/retrieval/similarity-search' },
                { text: '混合检索策略', link: '/tutorials/rag/retrieval/hybrid-search' },
                { text: '重排序技术', link: '/tutorials/rag/retrieval/reranking' },
                { text: '检索优化技巧', link: '/tutorials/rag/retrieval/optimization' }
              ]
            },
            {
              text: '生成与优化',
              collapsed: true,
              items: [
                { text: '提示工程实践', link: '/tutorials/rag/generation/prompt-engineering' },
                { text: '上下文管理', link: '/tutorials/rag/generation/context-management' },
                { text: '生成质量控制', link: '/tutorials/rag/generation/quality-control' },
                { text: '幻觉问题解决', link: '/tutorials/rag/generation/hallucination-prevention' }
              ]
            },
            {
              text: '系统架构设计',
              collapsed: true,
              items: [
                { text: 'RAG系统架构模式', link: '/tutorials/rag/architecture/system-patterns' },
                { text: '微服务RAG架构', link: '/tutorials/rag/architecture/microservice-rag' },
                { text: '性能优化策略', link: '/tutorials/rag/architecture/performance-optimization' },
                { text: '监控与运维', link: '/tutorials/rag/architecture/monitoring' }
              ]
            },
            {
              text: '实战案例',
              collapsed: true,
              items: [
                { text: '企业知识库问答', link: '/tutorials/rag/cases/enterprise-kb' },
                { text: '代码助手实现', link: '/tutorials/rag/cases/code-assistant' },
                { text: '客服机器人', link: '/tutorials/rag/cases/customer-service' },
                { text: '文档智能分析', link: '/tutorials/rag/cases/document-analysis' }
              ]
            },
            {
              text: '工具与框架',
              collapsed: true,
              items: [
                { text: 'LangChain实战', link: '/tutorials/rag/tools/langchain' },
                { text: 'LlamaIndex应用', link: '/tutorials/rag/tools/llamaindex' },
                { text: 'RAGFlow使用指南', link: '/tutorials/rag/tools/ragflow' },
                { text: '开源RAG框架对比', link: '/tutorials/rag/tools/framework-comparison' }
              ]
            },
            {
              text: '进阶话题',
              collapsed: true,
              items: [
                { text: '多模态RAG', link: '/tutorials/rag/advanced/multimodal-rag' },
                { text: 'Agent与RAG结合', link: '/tutorials/rag/advanced/agent-rag' },
                { text: 'RAG评估体系', link: '/tutorials/rag/advanced/evaluation' },
                { text: '未来发展趋势', link: '/tutorials/rag/advanced/future-trends' }
              ]
            }
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
                { text: 'ES中norms参数故事版', link: '/tutorials/es/basics/ES中norms参数故事版' },
                { text: 'ES中null_value参数故事版', link: '/tutorials/es/basics/ES中null_value参数故事版' },
                { text: 'ES中position_increment_gap参数故事版', link: '/tutorials/es/basics/ES中position_increment_gap参数故事版' },
                { text: 'ES中similarity参数故事版', link: '/tutorials/es/basics/ES中similarity参数故事版' },
                { text: 'ES中fields参数故事版', link: '/tutorials/es/basics/ES中fields参数故事版' },
                { text: 'ES中enable参数故事版', link: '/tutorials/es/basics/ES中enable参数故事版' },
                { text: 'ES中动态模板故事版', link: '/tutorials/es/basics/ES中动态模板故事版' },
                { text: 'ES中分词器故事版', link: '/tutorials/es/basics/ES中分词器故事版' },
                { text: 'ES中_analyze API故事版', link: '/tutorials/es/basics/ES中_analyze API故事版' },
                { text: 'ES中分词器组成故事版', link: '/tutorials/es/basics/ES中分词器组成故事版' },
                { text: 'ES中在映射中定义分词器故事版', link: '/tutorials/es/basics/ES中在映射中定义分词器故事版' },
                { text: 'ES客户端', link: '/tutorials/es/basics/ES客户端' },
                { text: 'ES聚合查询', link: '/tutorials/es/basics/ES聚合查询' }
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
                { text: '二进制求和', link: '/tutorials/algorithm/array-string/二进制求和' },
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
                { text: '爬楼梯问题', link: '/tutorials/algorithm/dynamic-programming/爬楼梯问题' },
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
                { text: '超越编码：程序员的核心竞争力思考', link: '/tutorials/insights/growth/beyond-coding-core-competitiveness' },
                { text: '从菜鸟到架构师的成长之路', link: '/tutorials/insights/growth/from-junior-to-architect' },
                { text: '磨刀之道：从打工者到超级个体的修炼', link: '/tutorials/insights/growth/sharpen-the-blade' },
                { text: '产品化思维：如何让自己成为RAG领域的稀缺资产', link: '/tutorials/insights/growth/rag-product-thinking' },
                { text: 'RAG开源之路：在解析与检索之间寻找你的第一性原理', link: '/tutorials/insights/growth/rag-opensource-journey' },
                { text: '大模型时代的程序员成长悖论', link: '/tutorials/insights/growth/ai-copilot-era-growth' },
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
                { text: '在非理想工作中找到成长', link: '/tutorials/insights/career/growth-from-non-ideal-work' },
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
                { text: '认知边界：为何我们省不了认知之外的钱', link: '/tutorials/insights/life-wisdom/cognitive-money-management' },
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
            },
            {
              text: '财富与自由思维',
              collapsed: true,
              items: [
                { text: '纳瓦尔宝典：技术人的财富自由之路', link: '/tutorials/insights/wealth/naval-ravikant-guide' },
                { text: '专长与杠杆：程序员的核心资产', link: '/tutorials/insights/wealth/leverage-and-expertise' },
                { text: '从打工思维到资产思维', link: '/tutorials/insights/wealth/asset-mindset' },
                { text: '构建被动收入系统', link: '/tutorials/insights/wealth/passive-income' },
                { text: '技术博客项目的营利分析：纳瓦尔思维实战', link: '/tutorials/insights/wealth/project-monetization-naval' }
              ]
            }
          ]
        }
      ],
      '/tutorials/explorations/': [
        {
          text: '拾遗录',
          collapsed: false,
          items: [
            { text: '专栏介绍', link: '/tutorials/explorations/' },
            { text: '文章模板', link: '/tutorials/explorations/template' },
            { text: '如何使用LangGraph开发Agent', link: '/tutorials/explorations/如何使用LangGraph开发Agent' },
            { text: '初探 Rust', link: '/tutorials/explorations/rust-first-try' }
          ]
        }
      ],
      '/tutorials/architecture/': [
        {
          text: '筑·匠',
          collapsed: false,
          items: [
            { text: '专栏介绍', link: '/tutorials/architecture/' },
            {
              text: '系统架构设计',
              collapsed: true,
              items: [
                { text: '分布式系统架构设计', link: '/tutorials/architecture/system/distributed-system' },
                { text: '微服务架构设计实践', link: '/tutorials/architecture/system/microservice-design' },
                { text: '高并发系统架构方案', link: '/tutorials/architecture/system/high-concurrency' },
                { text: '领域驱动设计(DDD)实战', link: '/tutorials/architecture/system/ddd-practice' }
              ]
            },
            {
              text: '技术选型与方案',
              collapsed: true,
              items: [
                { text: '缓存架构设计', link: '/tutorials/architecture/solution/cache-architecture' },
                { text: '消息队列选型与实践', link: '/tutorials/architecture/solution/message-queue' },
                { text: '数据库架构设计', link: '/tutorials/architecture/solution/database-architecture' },
                { text: '搜索引擎架构方案', link: '/tutorials/architecture/solution/search-engine' }
              ]
            },
            {
              text: '性能优化实战',
              collapsed: true,
              items: [
                { text: 'JVM性能调优实践', link: '/tutorials/architecture/performance/jvm-tuning' },
                { text: '数据库性能优化方案', link: '/tutorials/architecture/performance/database-optimization' },
                { text: '接口性能优化实战', link: '/tutorials/architecture/performance/api-optimization' },
                { text: '前端性能优化方案', link: '/tutorials/architecture/performance/frontend-optimization' }
              ]
            },
            {
              text: '稳定性保障',
              collapsed: true,
              items: [
                { text: '限流降级熔断设计', link: '/tutorials/architecture/stability/rate-limit-downgrade' },
                { text: '灰度发布方案设计', link: '/tutorials/architecture/stability/gray-release' },
                { text: '容灾与高可用设计', link: '/tutorials/architecture/stability/disaster-recovery' },
                { text: '监控告警体系建设', link: '/tutorials/architecture/stability/monitoring-system' }
              ]
            },
            {
              text: '安全架构设计',
              collapsed: true,
              items: [
                { 
                  text: '认证授权体系设计', 
                  collapsed: true,
                  items: [
                    { text: '认证授权概述', link: '/tutorials/architecture/security/auth-system/' },
                    { text: 'SSO单点网页内嵌登录设计', link: '/tutorials/architecture/security/auth-system/SSO单点网页内嵌登录设计' },
                    { text: 'Session认证机制', link: '/tutorials/architecture/security/auth-system/session-auth' },
                    { text: 'JWT令牌认证实践', link: '/tutorials/architecture/security/auth-system/jwt-auth' },
                    { text: 'OAuth2.0授权框架', link: '/tutorials/architecture/security/auth-system/oauth2' },
                    { text: 'SSO单点登录设计', link: '/tutorials/architecture/security/auth-system/sso' },
                    { text: 'RBAC权限模型设计', link: '/tutorials/architecture/security/auth-system/rbac' },
                    { text: 'ABAC属性访问控制', link: '/tutorials/architecture/security/auth-system/abac' },
                    { text: '多因素认证(MFA)', link: '/tutorials/architecture/security/auth-system/mfa' },
                    { text: '第三方登录集成', link: '/tutorials/architecture/security/auth-system/third-party-login' },
                    { text: '微服务认证授权方案', link: '/tutorials/architecture/security/auth-system/microservice-auth' }
                  ]
                },
                { text: '数据加密方案设计', link: '/tutorials/architecture/security/data-encryption' },
                { text: '接口安全防护方案', link: '/tutorials/architecture/security/api-security' },
                { text: '安全审计系统设计', link: '/tutorials/architecture/security/audit-system' }
              ]
            },
            {
              text: '项目实战案例',
              collapsed: true,
              items: [
                { text: '电商系统架构设计', link: '/tutorials/architecture/cases/ecommerce-system' },
                { text: '社交平台架构方案', link: '/tutorials/architecture/cases/social-platform' },
                { text: '支付系统架构设计', link: '/tutorials/architecture/cases/payment-system' },
                { text: '内容管理系统设计', link: '/tutorials/architecture/cases/cms-system' }
              ]
            }
          ]
        }
      ],
      '/tutorials/musings/': [
        {
          text: '漫思录',
          collapsed: false,
          items: [
            { text: '专栏介绍', link: '/tutorials/musings/' },
            {
              text: '思考笔记',
              collapsed: true,
              items: [
                { text: '示例：技术思考的艺术', link: '/tutorials/musings/thoughts/example' },
                { text: '如何用AI的方式给自己助力', link: '/tutorials/musings/thoughts/如何用AI的方式给自己助力' }
              ]
            },
            {
              text: '随笔草稿',
              collapsed: true,
              items: [
                { text: '示例：写作草稿存放', link: '/tutorials/musings/drafts/example' },
                { text: '草稿存放', link: '/tutorials/musings/drafts/草稿存放' }
              ]
            },
            {
              text: '灵感瞬间',
              collapsed: true,
              items: [
                { text: '示例：捕捉灵感的瞬间', link: '/tutorials/musings/inspirations/example' }
              ]
            }
          ]
        }
      ],
      '/tutorials/treasures/': [
        {
          text: '拾珍录',
          collapsed: false,
          items: [
            { text: '专栏介绍', link: '/tutorials/treasures/' },
            {
              text: '开发利器',
              collapsed: true,
              items: [
                { text: '编程工具推荐', link: '/tutorials/treasures/tools/dev-tools' },
                { text: '效率神器集锦', link: '/tutorials/treasures/tools/productivity-tools' },
                { text: '在线工具箱', link: '/tutorials/treasures/tools/online-tools' }
              ]
            },
            {
              text: '优质站点',
              collapsed: true,
              items: [
                { text: '技术社区精选', link: '/tutorials/treasures/websites/tech-communities' },
                { text: '学习资源站', link: '/tutorials/treasures/websites/learning-sites' },
                { text: '设计素材库', link: '/tutorials/treasures/websites/design-resources' }
              ]
            },
            {
              text: '精选文章',
              collapsed: true,
              items: [
                { text: '技术好文分享', link: '/tutorials/treasures/articles/tech-articles' },
                { text: '架构设计案例', link: '/tutorials/treasures/articles/architecture-cases' },
                { text: '职场成长心得', link: '/tutorials/treasures/articles/career-insights' }
              ]
            },
            {
              text: '资源宝库',
              collapsed: true,
              items: [
                { text: '开源项目推荐', link: '/tutorials/treasures/resources/open-source' },
                { text: '电子书资源', link: '/tutorials/treasures/resources/ebooks' },
                { text: '视频教程精选', link: '/tutorials/treasures/resources/video-courses' }
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
      message: '用代码书写人生 | <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">This site is powered by Netlify</a>',
      copyright: 'Copyright © 2023-present 舒一笑不秃头<br><span style="font-size: 0.9em; opacity: 0.8; letter-spacing: 2px;">云卷云舒 创无止境 焕然一新 <span id="site-runtime" style="margin-left: 20px;"></span><span id="site-visits-container" style="margin-left: 20px;"></span></span><br><span style="font-size: 0.9em; opacity: 0.75; letter-spacing: 3px; font-style: italic; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 8px; display: inline-block;">他日卧龙终得雨 今朝放鹤且冲天</span>'
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

    // 编辑链接（已禁用）
    // editLink: {
    //   pattern: 'https://github.com/shuyixiao-better/shuyixiao-studio/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // }
  },

  // Markdown 配置
  markdown: {
    // 启用语法高亮
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    // 代码块配置
    lineNumbers: true
  },

  // Mermaid 配置
  mermaid: {
    // 可选配置项
  },
  mermaidPlugin: {
    class: "mermaid my-class" // 设置额外类名，可选
  }
}))
