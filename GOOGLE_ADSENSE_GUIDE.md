# Google AdSense 集成指南

## 📋 概述

已成功将 Google AdSense 广告集成到 VitePress 网站中。你现在可以在任何 Markdown 文件中轻松插入广告。

## ✅ 已完成的工作

### 1. 创建广告组件
- 文件位置：`docs/.vitepress/theme/components/GoogleAdsense.vue`
- 支持自定义广告参数
- 自动处理客户端渲染
- 包含错误处理机制

### 2. 注册全局组件
- 已在 `docs/.vitepress/theme/index.js` 中注册
- 可在任何 Markdown 文件中直接使用

### 3. AdSense 脚本已配置
- 已在 `docs/.vitepress/config.mts` 的 `head` 配置中添加 AdSense 脚本
- 广告客户端 ID: `ca-pub-8453754288657802`

## 🚀 使用方法

### 基本用法

在任何 Markdown 文件中直接使用：

```markdown
# 文章标题

这是文章开头的内容...

<GoogleAdsense />

这是文章的更多内容...
```

### 自定义广告位

如果你有多个广告位，可以指定不同的 `ad-slot`：

```markdown
<GoogleAdsense ad-slot="1402282744" />
```

### 完整参数示例

```markdown
<GoogleAdsense 
  ad-client="ca-pub-8453754288657802"
  ad-slot="1402282744"
  ad-format="auto"
  full-width-responsive="true"
/>
```

## 📍 推荐的广告位置

### 1. 文章顶部（标题后）
```markdown
# 文章标题

<GoogleAdsense />

文章正文开始...
```

### 2. 文章中间（长文章）
```markdown
## 第一部分内容

内容...

<GoogleAdsense />

## 第二部分内容

内容...
```

### 3. 文章底部（评论前）
```markdown
文章结尾内容...

<GoogleAdsense />

## 评论区
```

## 🎨 组件参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ad-client` | String | `ca-pub-8453754288657802` | AdSense 客户端 ID |
| `ad-slot` | String | `1402282744` | 广告位 ID |
| `ad-format` | String | `auto` | 广告格式（auto/rectangle/vertical/horizontal） |
| `full-width-responsive` | String | `true` | 是否启用全宽响应式 |

## 💡 最佳实践

### 1. 广告密度控制
- 短文章（<500字）：0-1 个广告
- 中等文章（500-1500字）：1-2 个广告
- 长文章（>1500字）：2-3 个广告

### 2. 用户体验优先
- 不要在首屏放置过多广告
- 确保广告不遮挡重要内容
- 保持合理的内容与广告比例

### 3. 响应式设计
- 组件已支持响应式布局
- 在移动端和桌面端都能良好显示
- 自动适应容器宽度

## 🔧 高级配置

### 创建多个广告位

如果你有多个不同的广告位，可以创建专门的组件：

```vue
<!-- 文章顶部广告 -->
<GoogleAdsense ad-slot="1402282744" />

<!-- 文章中间广告 -->
<GoogleAdsense ad-slot="另一个广告位ID" />

<!-- 文章底部广告 -->
<GoogleAdsense ad-slot="又一个广告位ID" />
```

### 条件显示广告

你可以在特定页面显示广告：

```markdown
---
showAds: true
---

# 文章标题

<GoogleAdsense v-if="$frontmatter.showAds" />
```

## 📊 监控与优化

### 1. 查看广告效果
- 登录 [Google AdSense 控制台](https://www.google.com/adsense/)
- 查看广告展示次数、点击率等数据

### 2. A/B 测试
- 尝试不同的广告位置
- 测试不同的广告格式
- 根据数据优化广告策略

### 3. 性能监控
- 广告采用异步加载，不会阻塞页面
- 使用浏览器开发者工具监控加载时间

## ⚠️ 注意事项

1. **AdSense 政策合规**
   - 不要点击自己的广告
   - 不要诱导用户点击广告
   - 遵守 Google AdSense 计划政策

2. **广告审核**
   - 新广告位可能需要几小时到几天的审核时间
   - 审核期间可能显示空白或测试广告

3. **内容质量**
   - 确保网站内容符合 AdSense 政策
   - 提供原创、有价值的内容

## 🐛 故障排查

### 广告不显示？

1. **检查 AdSense 账户状态**
   - 确认账户已激活
   - 确认广告位已创建

2. **检查浏览器控制台**
   - 打开开发者工具查看是否有错误
   - 检查 AdSense 脚本是否加载成功

3. **检查广告拦截器**
   - 禁用广告拦截插件测试
   - 某些浏览器扩展可能阻止广告

4. **等待审核**
   - 新网站或新广告位需要审核时间
   - 审核期间可能不显示广告

### 广告显示异常？

1. **清除浏览器缓存**
2. **检查网络连接**
3. **验证广告代码是否正确**

## 📚 相关资源

- [Google AdSense 帮助中心](https://support.google.com/adsense/)
- [AdSense 政策中心](https://support.google.com/adsense/answer/48182)
- [VitePress 官方文档](https://vitepress.dev/)

## 🎯 下一步

1. 在你的文章中添加 `<GoogleAdsense />` 组件
2. 部署网站并测试广告显示
3. 在 AdSense 控制台监控广告效果
4. 根据数据优化广告位置和数量

---

**提示**：如需修改默认配置，请编辑 `docs/.vitepress/theme/components/GoogleAdsense.vue` 文件。
