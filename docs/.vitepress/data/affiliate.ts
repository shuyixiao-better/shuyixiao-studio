/**
 * 佣金推广产品数据配置
 * 
 * 使用说明:
 * 1. 添加新产品: 在 affiliateProducts 数组中添加新对象
 * 2. featured: true 的产品会在首页显示
 * 3. active: false 的产品不会显示
 * 4. priority 越高,排序越靠前
 */

export interface AffiliateProduct {
  id: string                    // 唯一标识 (建议使用 kebab-case)
  title: string                 // 产品名称
  description: string           // 简短描述 (显示在卡片上)
  longDescription?: string      // 详细描述 (悬停时显示)
  icon: string                  // 图标 (emoji 或图片路径)
  link: string                  // 佣金链接 (affiliate link)
  price?: string                // 价格信息
  originalPrice?: string        // 原价 (用于显示折扣)
  discount?: string             // 折扣信息
  badge?: string                // 标签 (如: 限时优惠/热门推荐)
  category: string              // 分类
  tags: string[]                // 标签数组
  priority: number              // 优先级 (1-10, 10最高)
  validUntil?: string           // 有效期 (ISO 日期字符串)
  featured?: boolean            // 是否在首页显示
  active?: boolean              // 是否激活
}

/**
 * 产品数据
 * 
 * 💡 建议:
 * - 首页精选: featured=true, priority 高的 3-4 个产品
 * - 定期更新: 检查链接有效性和产品信息
 * - 真实推荐: 只推荐自己真正使用过的产品
 */
export const affiliateProducts: AffiliateProduct[] = [
  // ========================================
  // 示例 1: 开发工具
  // ========================================
  {
    id: 'jetbrains-toolbox',
    title: 'JetBrains 全家桶',
    description: '专业开发者的必备利器，支持 Java、Python、Go 等多种语言',
    longDescription: 'JetBrains 提供业界最强大的 IDE 套件，包括 IntelliJ IDEA、PyCharm、GoLand 等。智能代码补全、强大的重构能力、优秀的调试工具，大幅提升开发效率。',
    icon: '💻',
    link: 'https://www.jetbrains.com/', // 替换为你的佣金链接
    price: '¥89/月起',
    originalPrice: '¥129/月',
    discount: '学生免费，个人版 30% OFF',
    badge: '推荐',
    category: '开发工具',
    tags: ['IDE', 'Java', 'Python', 'Go'],
    priority: 10,
    featured: true,
    active: true
  },

  // ========================================
  // 示例 2: 云服务
  // ========================================
  {
    id: 'aliyun-ecs',
    title: '阿里云 ECS',
    description: '高性能云服务器，新用户享受超值优惠，适合个人与企业',
    longDescription: '阿里云弹性计算服务(ECS)提供稳定可靠的云计算资源。99.95% SLA保障，支持按量付费和包年包月，适合各种规模的应用部署。',
    icon: '☁️',
    link: 'https://www.aliyun.com/product/ecs', // 替换为你的推荐链接
    price: '¥9.9/月起',
    discount: '新用户首购低至 0.8 折',
    badge: '新人福利',
    category: '云服务',
    tags: ['云服务器', 'ECS', '服务器'],
    priority: 9,
    featured: true,
    active: true
  },

  // ========================================
  // 示例 3: 学习资源
  // ========================================
  {
    id: 'geektime-course',
    title: '极客时间课程',
    description: '一线大厂技术专家倾囊相授，体系化学习路径',
    longDescription: '极客时间汇聚阿里、腾讯、字节等一线互联网公司的技术专家，提供深度技术课程。涵盖架构、算法、前后端、大数据等多个领域，适合进阶学习。',
    icon: '📚',
    link: 'https://time.geekbang.org/', // 替换为你的推荐链接
    price: '¥99起',
    badge: '精选课程',
    category: '学习资源',
    tags: ['在线课程', '技术成长', '进阶学习'],
    priority: 8,
    featured: true,
    active: true
  },

  // ========================================
  // 示例 4: 开发工具
  // ========================================
  {
    id: 'github-copilot',
    title: 'GitHub Copilot',
    description: 'AI 驱动的代码助手，让编程更高效',
    longDescription: 'GitHub Copilot 基于 OpenAI Codex，能够根据上下文智能生成代码建议。支持多种编程语言和 IDE，大幅提升编码效率，是开发者的得力助手。',
    icon: '🤖',
    link: 'https://github.com/features/copilot', // 替换为你的推荐链接
    price: '$10/月',
    badge: 'AI 助手',
    category: '开发工具',
    tags: ['AI', '代码补全', 'GitHub'],
    priority: 7,
    featured: true,
    active: true
  },

  // ========================================
  // 示例 5: 开发工具 - Cursor Pro 试用
  // ========================================
  {
    id: 'cursor-pro-trial',
    title: 'Cursor Pro 7天试用',
    description: 'AI 代码编辑器，智能编程助手，7天免费体验',
    longDescription: 'Cursor 是新一代 AI 代码编辑器，集成了强大的 AI 编程助手。支持智能代码补全、自动重构、代码解释等功能，让编程更加高效。现在提供 7 天免费试用，体验 AI 编程的魅力。',
    icon: '🎯',
    link: 'https://m.tb.cn/h.SmhRyiH?tk=Ha86fVARjzM',
    price: '7天免费',
    originalPrice: '$20/月',
    discount: '限时试用',
    badge: '试用福利',
    category: '开发工具',
    tags: ['AI', '代码编辑器', 'Cursor', '试用'],
    priority: 8,
    featured: true,
    active: true
  },

  // ========================================
  // 更多产品示例 (featured=false, 不会在首页显示)
  // ========================================
  {
    id: 'postman-pro',
    title: 'Postman Pro',
    description: 'API 开发与测试的专业平台',
    icon: '🔧',
    link: 'https://www.postman.com/pricing/',
    price: '$12/月',
    category: '开发工具',
    tags: ['API', '测试', '协作'],
    priority: 6,
    featured: false,  // 不在首页显示
    active: true
  },

  // ========================================
  // 禁用的产品示例
  // ========================================
  {
    id: 'example-disabled',
    title: '已过期的产品',
    description: '此产品已停止推广',
    icon: '⚠️',
    link: 'https://example.com',
    category: '示例',
    tags: ['示例'],
    priority: 1,
    featured: false,
    active: false  // 已禁用，不会显示
  }
]

/**
 * 获取精选产品 (用于首页显示)
 * 
 * @param limit 最多返回的数量，默认 6
 * @returns 排序后的精选产品数组
 */
export function getFeaturedProducts(limit = 6): AffiliateProduct[] {
  return affiliateProducts
    .filter(p => p.featured && p.active)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}

/**
 * 根据分类获取产品
 * 
 * @param category 分类名称
 * @returns 该分类的所有激活产品
 */
export function getProductsByCategory(category: string): AffiliateProduct[] {
  return affiliateProducts
    .filter(p => p.active && p.category === category)
    .sort((a, b) => b.priority - a.priority)
}

/**
 * 根据标签获取产品
 * 
 * @param tag 标签名称
 * @returns 包含该标签的所有激活产品
 */
export function getProductsByTag(tag: string): AffiliateProduct[] {
  return affiliateProducts
    .filter(p => p.active && p.tags.includes(tag))
    .sort((a, b) => b.priority - a.priority)
}

/**
 * 全局配置
 */
export const affiliateConfig = {
  // 是否启用佣金功能
  enabled: true,
  
  // 显示位置配置
  positions: {
    homepage: true,           // 首页
    article: false,           // 文章内 (暂未实现)
    sidebar: false,           // 侧边栏 (暂未实现)
    resourcePage: false       // 资源页 (暂未实现)
  },
  
  // 显示数量限制
  limits: {
    homepage: 6,              // 首页最多显示数量
  },
  
  // 说明文字
  disclosure: {
    short: '本推荐含佣金链接',
    long: '本栏目推荐包含佣金链接，收入将用于博客的持续运营与内容创作，感谢你的支持 ❤️'
  },
  
  // 样式主题
  theme: {
    primaryColor: '#f59e0b',    // 主色调 (金色)
    secondaryColor: '#f97316',  // 辅助色 (橙色)
  }
}

/**
 * 点击追踪 (可选功能)
 * 
 * 使用示例:
 * ```typescript
 * import { trackAffiliateClick } from '@/data/affiliate'
 * trackAffiliateClick('jetbrains-toolbox', 'homepage')
 * ```
 */
export function trackAffiliateClick(productId: string, position: string = 'unknown'): void {
  // Google Analytics 追踪
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'affiliate',
      event_label: productId,
      value: position
    })
  }
  
  // 控制台日志 (开发环境)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🔗 Affiliate Click:', { productId, position, timestamp: new Date().toISOString() })
  }
  
  // 自定义追踪 API (可选)
  // fetch('/api/track/affiliate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     product_id: productId,
  //     position: position,
  //     timestamp: Date.now()
  //   })
  // }).catch(err => console.error('Track failed:', err))
}

