# 🚀 统计功能快速开始

## 问题：为什么 netlify dev 看不到新功能？

`netlify dev` 默认加载的是 `dist` 目录的**静态构建文件**，这些文件是之前构建的，不包含新功能。

## ✅ 正确的本地开发步骤

### 方案一：先构建再测试（推荐用于测试生产环境）

```bash
# 1. 安装新依赖（包含 @netlify/blobs）
pnpm install

# 2. 重新构建（生成最新的 dist 文件）
pnpm docs:build

# 3. 启动 Netlify Dev（包含 Functions）
netlify dev
```

访问：http://localhost:8888

### 方案二：实时开发模式（推荐日常开发）

```bash
# 1. 安装依赖
pnpm install

# 2. 启动 VitePress 开发服务器（实时热更新）
pnpm docs:dev
```

访问：http://localhost:5173

**注意：** 这种模式下 Functions 不会运行，统计功能的数据会调用失败，但你可以看到 UI 效果。

### 方案三：完整的开发环境（最佳方案）

创建了 `netlify.dev.toml` 配置文件，现在可以：

```bash
# 1. 安装依赖
pnpm install

# 2. 启动完整开发环境（VitePress + Functions）
netlify dev
```

这会自动：
- 启动 VitePress 开发服务器（端口 5173）
- 启动 Netlify Functions 服务
- 提供完整的功能测试环境

访问：http://localhost:8888 （Netlify 代理端口）

## 📝 如何验证功能正常

### 1. 首页底部访问量

打开首页，滚动到底部，应该看到：

```
本站运行：31 天 12 时 34 分 56 秒 | 📊 本站总访问 1 次
```

### 2. 文章统计组件

在任意 Markdown 文件中添加：

```markdown
---
layout: doc
title: 测试文章
---

# 测试标题

这是测试内容

<ArticleStats />

继续内容...
```

保存后，页面应该显示：

```
┌─────────────────────────────────────────┐
│  👁️ 阅读 1   🤍 点赞 0                  │
└─────────────────────────────────────────┘
```

### 3. 测试点赞功能

点击点赞按钮，应该：
1. 按钮变成 ❤️ 已点赞
2. 数字增加
3. 顶部弹出提示 "感谢点赞！❤️"

## 🔧 故障排查

### 问题1：看不到统计组件

**原因：** 旧的构建文件  
**解决：** 
```bash
rm -rf docs/.vitepress/dist
pnpm docs:build
netlify dev
```

### 问题2：统计数据始终为 0

**原因：** Functions 未运行或网络请求失败  
**检查：** 
1. 打开浏览器控制台（F12）
2. 查看 Network 标签
3. 应该看到 `/api/stats?action=...` 请求

**解决：**
- 确保使用 `netlify dev` 启动
- 检查 Functions 是否加载：应该看到 `⬥ Loaded function stats`

### 问题3：Functions 报错

**常见错误：**
```
Cannot find module '@netlify/blobs'
```

**解决：**
```bash
# 确保依赖已安装
pnpm install

# 检查 package.json 是否包含
cat package.json | grep "@netlify/blobs"
```

### 问题4：样式不对

**原因：** CSS 文件未更新  
**解决：**
```bash
# 清除缓存
rm -rf docs/.vitepress/cache
rm -rf docs/.vitepress/dist
rm -rf node_modules/.vite

# 重新构建
pnpm install
pnpm docs:build
netlify dev
```

## 📦 部署到生产环境

```bash
# 1. 提交代码
git add .
git commit -m "feat: 添加网站统计功能"

# 2. 推送到 GitHub
git push origin main  # 或你的分支名

# 3. Netlify 会自动：
#    - 检测到更新
#    - 运行构建命令
#    - 部署 Functions + 静态文件
#    - 自动配置 Blobs 存储
```

等待 2-3 分钟，访问你的网站就能看到新功能了！

## 🎯 测试清单

在部署前，请确认：

- [ ] 首页底部显示访问量
- [ ] 文章中 `<ArticleStats />` 显示正常
- [ ] 点赞功能正常（可以点赞和取消）
- [ ] 阅读数会增加（刷新页面不会重复计数）
- [ ] 浏览器控制台没有错误
- [ ] Functions 日志正常（`netlify dev` 的终端输出）

## 💡 开发建议

### 日常开发（修改样式、内容）
```bash
pnpm docs:dev  # 快速热更新，无需 Functions
```

### 功能测试（测试统计功能）
```bash
netlify dev  # 完整环境，包含 Functions
```

### 生产构建测试
```bash
pnpm docs:build
netlify dev
```

## 📊 查看 Functions 日志

当使用 `netlify dev` 时，Functions 的日志会直接输出到终端：

```bash
⬥ Loaded function stats
Request from ::1: GET /.netlify/functions/stats?action=get_all_stats&path=...
Response from stats: 200
```

如果看到错误，终端会显示详细的错误信息。

## 🔗 相关资源

- [完整技术文档](./STATS_USAGE.md)
- [实现总结](./STATS_IMPLEMENTATION_SUMMARY.md)
- [用户使用指南](./docs/articles/site-stats-guide.md)
- [Netlify Dev 文档](https://docs.netlify.com/cli/local-development/)

---

**现在运行：**

```bash
# 安装依赖
pnpm install

# 重新构建
pnpm docs:build

# 启动完整环境
netlify dev
```

就能看到完整功能了！✨

