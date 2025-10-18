# 🌐 双部署环境说明

## 概述

本站点支持**双部署**：
- **Netlify** (www.shuyixiao.cn) - 完整功能，包含统计
- **GitHub Pages** (www.shuyixiao.top) - 静态站点，无统计功能

## 🎯 统计功能自适应降级

### 实现原理

统计组件会自动检测运行环境：

1. **启动时检测** - 尝试调用 `/api/stats` 端点
2. **Netlify 环境** - API 可用，显示完整统计功能
3. **GitHub Pages** - API 不可用，**自动隐藏**统计组件

### 用户体验

| 环境 | ArticleStats 组件 | SiteVisits 组件 | 用户体验 |
|-----|------------------|----------------|---------|
| **Netlify** | ✅ 显示并工作 | ✅ 显示在页脚 | 完整统计功能 |
| **GitHub Pages** | ⚪ 自动隐藏 | ⚪ 自动隐藏 | 无感知，无错误 |

### 技术细节

```javascript
// 环境检测逻辑
const checkNetlifyEnv = async () => {
  try {
    const response = await fetch('/api/stats?action=get_site_visits', {
      method: 'GET',
      cache: 'no-cache'
    });
    return response.ok; // 200 = Netlify，404/其他 = GitHub Pages
  } catch (error) {
    return false; // 网络错误 = GitHub Pages
  }
};
```

## 📋 行为对照表

### 在 Netlify 部署（www.shuyixiao.cn）

✅ **首页底部**
```
| 本站运行：31 天 12 时 34 分 56 秒 | 📊 本站总访问 12,345 次
```

✅ **文章页面**
```markdown
<ArticleStats />
```
显示为：
```
┌────────────────────────────────┐
│  👁️ 阅读 123   ❤️ 已点赞 45   │
└────────────────────────────────┘
```

✅ **功能正常**
- 阅读数自动增加
- 点赞功能正常
- 访问量实时更新

### 在 GitHub Pages 部署（www.shuyixiao.top）

⚪ **首页底部**
```
| 本站运行：31 天 12 时 34 分 56 秒
```
（访问量组件自动隐藏）

⚪ **文章页面**
```markdown
<ArticleStats />
```
组件自动隐藏，不显示任何内容

⚪ **无错误提示**
- 控制台只显示：`统计功能仅在 Netlify 部署时可用`（info 级别）
- 用户界面无任何错误提示
- 页面布局不受影响

## 🔧 开发说明

### 本地开发

**使用 VitePress 开发服务器：**
```bash
pnpm docs:dev
```
- 端口：5173
- 统计功能：❌ 不可用（组件自动隐藏）
- 适合：快速预览内容和样式

**使用 Netlify Dev：**
```bash
pnpm docs:build
netlify dev
```
- 端口：8888
- 统计功能：✅ 完全可用
- 适合：测试完整功能

### 部署流程

#### 部署到 Netlify（推荐）
```bash
git push origin main  # 或你配置的分支
```
Netlify 自动：
1. 检测到代码更新
2. 运行 `pnpm docs:build`
3. 部署 Functions + 静态文件
4. 配置 Blobs 存储
5. ✅ 统计功能完整可用

#### 部署到 GitHub Pages
```bash
git push origin write  # 或你配置的分支
```
GitHub Actions 自动：
1. 检测到代码更新
2. 运行构建流程
3. 部署静态文件
4. ⚪ 统计组件自动隐藏

## 🎨 为什么选择自动隐藏？

### 方案对比

| 方案 | 优点 | 缺点 |
|-----|-----|-----|
| **自动隐藏** ✅ | 无感知、无错误、布局整洁 | 用户不知道有统计功能 |
| **显示占位** | 保持布局一致 | 显示无意义的 0 |
| **显示提示** | 告知用户有限制 | 可能产生困惑 |

我们选择**自动隐藏**，因为：
1. 用户体验最佳（无感知）
2. 不会产生困惑
3. 布局保持简洁
4. 开发者可在控制台看到说明

### 控制台输出

**Netlify 环境：**
```
✓ 统计数据加载成功
```

**GitHub Pages 环境：**
```
ℹ️ 统计功能仅在 Netlify 部署时可用
```

## 📝 文章中使用统计组件

### 安全使用方式（推荐）

```markdown
---
layout: doc
title: 你的文章标题
---

# 文章内容

这里是正文...

<ArticleStats />

继续文章内容...
```

**效果：**
- Netlify：显示统计卡片
- GitHub Pages：自动隐藏，不影响布局

### 可选：添加说明文字

```markdown
## 互动统计

<ArticleStats />

> 💡 提示：统计功能仅在 Netlify 部署版本（www.shuyixiao.cn）中可用
```

## 🔍 排查问题

### 如何确认当前环境？

**方法1：查看 URL**
- `www.shuyixiao.cn` = Netlify
- `www.shuyixiao.top` = GitHub Pages

**方法2：打开浏览器控制台（F12）**
```javascript
// 手动测试
fetch('/api/stats?action=get_site_visits')
  .then(res => res.ok ? 'Netlify' : 'GitHub Pages')
  .then(console.log)
  .catch(() => console.log('GitHub Pages'))
```

**方法3：查看页面源码**
- 有 `<div class="article-stats">` = Netlify
- 无此元素 = GitHub Pages

### 常见问题

**Q: 为什么 Netlify 也看不到统计？**

A: 可能原因：
1. Netlify Functions 未部署成功
2. Blobs 未配置
3. 网络问题

解决：
```bash
# 查看 Netlify 部署日志
netlify logs

# 本地测试
netlify dev
```

**Q: 能否在 GitHub Pages 显示占位符？**

A: 可以，但不推荐。如果需要，修改组件：
```vue
<div class="article-stats" :class="{ 'disabled': !isNetlifyEnv }">
  <div v-if="isNetlifyEnv">
    <!-- 正常内容 -->
  </div>
  <div v-else class="stats-unavailable">
    统计功能暂不可用
  </div>
</div>
```

**Q: 如何强制显示/隐藏？**

A: 使用环境变量：
```javascript
// 在 .env 或 Netlify 环境变量中设置
VITE_ENABLE_STATS=true/false
```

## 📊 数据迁移

如果将来想统一到 Netlify：

1. GitHub Pages 部署的数据（0）不会迁移
2. Netlify 的数据会保留
3. 建议重点维护 Netlify 部署

## 🎯 最佳实践

### 推荐做法 ✅

1. **主站点**使用 Netlify（www.shuyixiao.cn）
2. **分享链接**优先使用 Netlify 域名
3. **GitHub Pages** 作为备用/镜像
4. 文章中直接使用 `<ArticleStats />`，无需条件判断

### 不推荐做法 ❌

1. 不要在文章中写死提示文字（"此功能不可用"）
2. 不要尝试在 GitHub Pages 使用第三方统计替代
3. 不要为了统计功能迁移整个站点

## 🚀 未来优化

可以考虑的改进方向：

1. **统一统计服务**
   - 使用独立的统计 API（如 Google Analytics）
   - 两个部署共享数据

2. **客户端统计**
   - 使用 localStorage 本地计数
   - 仅供参考，不同步

3. **智能提示**
   - 检测到 GitHub Pages 环境时
   - 页脚显示："访问 Netlify 版本体验更多功能"

---

**总结：** 现在的方案实现了优雅降级，两个部署都能正常运行，用户体验最佳。✨

