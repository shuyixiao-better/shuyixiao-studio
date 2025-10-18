# 📊 网站统计功能使用指南

## 功能概览

本项目集成了完整的网站统计系统，包括：

- 📖 **文章阅读数** - 记录每篇文章的访问次数
- ❤️ **文章点赞数** - 支持点赞/取消点赞，防止重复点赞
- 👥 **全站访问数** - 统计网站总访问量

## 技术架构

### 后端服务
- **Netlify Functions** - Serverless函数处理统计逻辑
- **Netlify Blobs** - 键值存储，持久化统计数据
- **防刷机制** - 基于IP和Cookie的防重复计数

### 前端组件
- **ArticleStats.vue** - 文章统计组件（阅读数+点赞）
- **SiteVisits.vue** - 全站访问量组件
- **localStorage** - 本地存储点赞状态
- **sessionStorage** - 会话级别的阅读记录

## 使用方法

### 1. 在文章页面中使用统计组件

在任何 Markdown 文档中添加 `<ArticleStats />` 组件即可：

```markdown
---
layout: doc
title: 你的文章标题
---

# 文章标题

这里是文章内容...

<ArticleStats />

继续你的文章内容...
```

### 2. 全站访问量显示

全站访问量已自动集成到页脚，无需额外配置。

访问量统计会显示在页脚的"本站运行时间"旁边，格式为：`📊 本站总访问 X,XXX 次`

### 3. 示例效果

#### 文章统计组件
```
┌─────────────────────────────────────────┐
│  👁️ 阅读 123   🤍 点赞 45              │
└─────────────────────────────────────────┘
```

点击点赞后：
```
┌─────────────────────────────────────────┐
│  👁️ 阅读 123   ❤️ 已点赞 46            │
└─────────────────────────────────────────┘
```

#### 页脚访问量
```
本站运行：31 天 12 时 34 分 56 秒 | 📊 本站总访问 12,345 次
```

## API 端点说明

### 基础 URL
```
/api/stats
```

### 可用操作

| 操作 | 参数 | 说明 |
|-----|------|-----|
| `get_views` | `path` | 获取指定路径的阅读数 |
| `increment_views` | `path` | 增加阅读数（自动防重复） |
| `get_likes` | `path` | 获取指定路径的点赞数 |
| `like` | `path` | 点赞（7天内IP不可重复） |
| `unlike` | `path` | 取消点赞 |
| `get_site_visits` | - | 获取全站访问数 |
| `increment_site_visits` | - | 增加全站访问数 |
| `get_all_stats` | `path` | 获取所有统计数据（一次性） |

### 示例请求

```javascript
// 获取文章统计
fetch('/api/stats?action=get_all_stats&path=tutorials/explorations/如何使用LangGraph开发Agent.md')
  .then(res => res.json())
  .then(data => {
    console.log('阅读数:', data.views);
    console.log('点赞数:', data.likes);
    console.log('全站访问:', data.siteVisits);
    console.log('是否已点赞:', data.hasLiked);
  });

// 点赞
fetch('/api/stats?action=like&path=tutorials/explorations/如何使用LangGraph开发Agent.md')
  .then(res => res.json())
  .then(data => {
    console.log('新的点赞数:', data.likes);
  });
```

## 防刷机制

### 阅读数防刷
- 使用 `sessionStorage` 记录本次会话已访问的页面
- 同一会话内重复访问不会增加计数
- 关闭浏览器后重新访问会计数

### 点赞防刷
- **IP限制**：7天内同一IP对同一文章只能点赞一次
- **本地存储**：使用 localStorage 保存点赞状态，提升用户体验
- **服务端验证**：最终以服务端IP记录为准

### 全站访问防刷
- 使用 Cookie 标记已访问（24小时有效）
- 24小时内重复访问不会增加全站计数
- Cookie 过期后重新访问会计数

## 数据存储

### Netlify Blobs 存储结构

```
site-stats/ (store)
├── views:路径                    # 阅读数
├── likes:路径                    # 点赞数
├── like_record:路径:IP          # 点赞记录（7天过期）
└── site:total_visits            # 全站总访问数
```

### 示例键名
```
views:tutorials/explorations/如何使用LangGraph开发Agent.md
likes:tutorials/explorations/如何使用LangGraph开发Agent.md
like_record:tutorials/explorations/如何使用LangGraph开发Agent.md:192.168.1.1
site:total_visits
```

## 部署说明

### 1. 安装依赖

```bash
pnpm install
```

主要依赖：
- `@netlify/blobs` - Netlify Blobs 存储客户端
- `@netlify/functions` - Netlify Functions 开发工具

### 2. 本地开发

```bash
# 启动 VitePress 开发服务器
pnpm docs:dev

# 如需测试 Netlify Functions，安装 Netlify CLI
npm install -g netlify-cli

# 使用 Netlify Dev 启动（集成 Functions）
netlify dev
```

### 3. 部署到 Netlify

项目已配置 `netlify.toml`，推送到 Netlify 后会自动：
1. 安装依赖
2. 构建 VitePress 站点
3. 部署 Netlify Functions
4. 配置 Netlify Blobs

无需额外配置，开箱即用！

## 样式自定义

### 修改统计组件主题色

编辑 `docs/.vitepress/theme/components/ArticleStats.vue`：

```css
.article-stats {
  /* 修改渐变背景 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-value {
  /* 修改数值颜色 */
  color: #667eea;
}
```

### 修改访问量组件样式

编辑 `docs/.vitepress/theme/components/SiteVisits.vue`：

```css
.site-visits {
  /* 自定义样式 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
}

.visits-count {
  /* 高亮数字颜色 */
  color: #ffd700;
}
```

## 常见问题

### Q: 为什么阅读数没有增加？
A: 同一会话（未关闭浏览器）内重复访问不会增加计数，这是为了防止刷量。

### Q: 点赞后刷新页面显示未点赞？
A: 检查浏览器是否禁用了 localStorage 或 Cookie。统计功能需要这些存储才能正常工作。

### Q: 如何重置所有统计数据？
A: 登录 Netlify Dashboard → 找到你的站点 → Blobs → 删除 `site-stats` store 即可。

### Q: 统计数据会丢失吗？
A: 不会。Netlify Blobs 是持久化存储，数据会永久保存，即使重新部署也不会丢失。

### Q: 有访问量限制吗？
A: Netlify 免费套餐包含：
- 100GB Blobs 存储
- 无限次读写操作
- 100万次 Function 调用/月
  
对于中小型博客完全够用！

## 进阶功能

### 添加访问趋势图

可以扩展存储按日期记录访问量，然后使用图表库（如 Chart.js）展示趋势：

```javascript
// 存储格式建议
{
  "site:visits:2025-10-18": 156,
  "site:visits:2025-10-19": 203,
  // ...
}
```

### 添加热门文章排行

定期查询所有 `views:*` 键，按阅读数排序，生成热门文章列表。

### 添加评论系统集成

可以结合 Giscus 或 Utterances 评论系统，在统计旁显示评论数。

## 技术支持

- 📧 邮箱：your-email@example.com
- 🐙 GitHub Issues：https://github.com/your-repo/issues
- 📝 博客：https://www.shuyixiao.top

## 开源协议

MIT License - 自由使用、修改、分发

---

**祝你使用愉快！如有问题欢迎提 Issue 交流 ✨**

