// 发布控制：列出暂不对外发布的页面。
// 被 config.mts（srcExclude、导航/侧边栏剪枝）、theme/utils/posts.data.js（文章列表）
// 和 scripts/generate-rss.mjs（RSS）共同使用，保证这些页面不会出现在网站任何位置。
//
// 收录原则（Google AdSense「低价值内容」整改）：
//   - 占位稿（正文只有“正在撰写中”）、模板/示例页、测试页、草稿、站内运营文档、重复稿不发布
//   - 文件保留在仓库中；写完后从列表中删掉对应条目即可重新上线
// 支持精确路径（相对 docs/）和以 /** 结尾的目录通配。

export const UNPUBLISHED_PAGES = [
  // VitePress 脚手架示例页
  'api-examples.md',
  'markdown-examples.md',
  // AdSense 运营文档 / 演示页（不应面向读者）
  'adsense-usage.md',
  'adsense-recheck-checklist.md',
  'articles/adsense-demo.md',
  // 测试页
  'tools/pandacoder-test.md',
  'tools/font-test.md',
  // 重复稿（与 articles/gitpulse-intro.md 重复）
  'articles/gitpulse-intro2.md',
  // 未经整理的 AI 对话导出记录（整理成正文后再发布）
  'projects/TorchV解析word.md',
  'tutorials/explorations/如何使用LangGraph开发Agent.md',
  // 模板、示例、草稿
  'tutorials/explorations/template.md',
  'tutorials/musings/thoughts/example.md',
  'tutorials/musings/drafts/example.md',
  'tutorials/musings/drafts/草稿存放.md',
  'tutorials/musings/inspirations/example.md',
  'tutorials/musings/thoughts/如何用AI的方式给自己助力.md',
  // 「筑·匠」专栏中尚未完成的占位稿
  'tutorials/architecture/system/**',
  'tutorials/architecture/solution/**',
  'tutorials/architecture/performance/**',
  'tutorials/architecture/stability/**',
  'tutorials/architecture/cases/**',
  'tutorials/architecture/security/api-security.md',
  'tutorials/architecture/security/audit-system.md',
  'tutorials/architecture/security/data-encryption.md',
  'tutorials/architecture/security/auth-system/abac.md',
  'tutorials/architecture/security/auth-system/jwt-auth.md',
  'tutorials/architecture/security/auth-system/mfa.md',
  'tutorials/architecture/security/auth-system/microservice-auth.md',
  'tutorials/architecture/security/auth-system/oauth2.md',
  'tutorials/architecture/security/auth-system/rbac.md',
  'tutorials/architecture/security/auth-system/session-auth.md',
  'tutorials/architecture/security/auth-system/sso.md',
  'tutorials/architecture/security/auth-system/third-party-login.md',
  // 「登科录」专栏中尚未完成的占位稿
  'tutorials/certifications/system-architect/comprehensive/**',
  'tutorials/certifications/system-architect/case-study/**',
  'tutorials/certifications/system-architect/exam-papers/**',
  'tutorials/certifications/system-architect/thesis/sample-papers.md'
]

export const isUnpublished = (relPath) =>
  UNPUBLISHED_PAGES.some(pattern =>
    pattern.endsWith('/**') ? relPath.startsWith(pattern.slice(0, -2)) : relPath === pattern
  )

// 站点 URL（如 /tutorials/es/ 或 /articles/foo）是否对应未发布页面
export function isUnpublishedUrl(url) {
  let route = url.split('#')[0].split('?')[0].replace(/\.html$/, '').replace(/^\//, '')
  try { route = decodeURI(route) } catch { /* keep raw */ }
  return route === '' || route.endsWith('/')
    ? isUnpublished(`${route}index.md`)
    : isUnpublished(`${route}.md`) || isUnpublished(`${route}/index.md`)
}
