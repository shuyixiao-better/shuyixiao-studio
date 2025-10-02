# 舒一笑不秃头的技术博客

> IDEA插件-PandaCoder（熊猫编码器）作者 ｜ 生成式AI应用工程师(高级)认证 | 阿里云博客专家 | Java应用开发职业技能等级认证 | HarmonyOS应用开发者基础认证 | 人生程序设计程序员 境是人非叶落处，焕景深处已向春~ 代码是我的文字，程序是我的诗篇，我不是程序员，我是诗人。大浪淘沙，去伪存真，破后而立，否极泰来。 真正的有所成，只能是慢慢来...

## 🚀 快速开始

```bash
# 1. 切换到 Node.js 22.16.0
nvm use 22.16.0

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run docs:dev
```

访问: http://localhost:5173

## 📚 技术栈

- **VitePress** `1.6.4` - 现代化的静态站点生成器
- **Mermaid** `11.12.0` - 流程图和图表渲染
- **Node.js** `22.16.0` - 运行环境

## ✨ 特性

- ✅ 支持 Mermaid 图表自动渲染
- ✅ 响应式设计，移动端友好
- ✅ 暗色模式支持
- ✅ 快速热更新
- ✅ SEO 优化

## 📖 文档

- 📝 [快速开始指南](./QUICK_START.md) - 5分钟快速上手
- 📊 [Mermaid 使用说明](./MERMAID_USAGE.md) - Mermaid 图表使用指南
- 🔧 [问题排查指南](./TROUBLESHOOTING.md) - 遇到问题？看这里

## 🔨 可用命令

```bash
# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产版本
npm run docs:preview
```

## 📝 写作指南

### 创建新文章

1. 在 `docs/articles/` 目录下创建新的 `.md` 文件
2. 添加 frontmatter:

```markdown
---
layout: doc
title: 文章标题
description: 文章描述
date: 2025-01-27
tags: ['标签1', '标签2']
author: 舒一笑不秃头
---

# 文章标题

文章内容...
```

### 使用 Mermaid 图表

直接在 Markdown 中使用 mermaid 代码块：

```markdown
\`\`\`mermaid
graph TB
    A[开始] --> B[处理]
    B --> C[结束]
\`\`\`
```

## 🎨 自定义配置

主要配置文件：
- `.vitepress/config.js` - VitePress 和 Mermaid 配置
- `.vitepress/theme/` - 自定义主题
- `docs/` - 文档内容

## 📦 最近更新

### 2025-01-27
- ✅ 升级 VitePress 到最新版本 (1.6.4)
- ✅ 集成官方 Mermaid 插件
- ✅ 优化配置，提升渲染稳定性
- ✅ 添加详细的使用文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Built with ❤️ by 舒一笑不秃头**
