---
layout: doc
title: Google AdSense 广告使用指南
description: 介绍如何在文章中使用 Google AdSense 广告组件
date: '2025-12-31'
---

# Google AdSense 广告使用指南

本文档介绍如何在文章中使用 Google AdSense 广告组件。

## 基本使用

在任何 Markdown 文件中，你可以直接使用 `<GoogleAdsense />` 组件来插入广告：

<GoogleAdsense />

## 自定义广告位

你也可以自定义广告位参数：

```vue
<GoogleAdsense 
  ad-client="ca-pub-8453754288657802"
  ad-slot="1402282744"
  ad-format="auto"
  full-width-responsive="true"
/>
```

## 在文章中插入广告

### 文章开头插入广告

<GoogleAdsense />

这是文章的正文内容...

### 文章中间插入广告

当你的文章比较长时，可以在文章中间插入广告：

<GoogleAdsense />

继续文章内容...

### 文章结尾插入广告

在文章结尾也可以插入广告：

<GoogleAdsense />

## 注意事项

1. **广告密度**：不要在一个页面放置过多广告，建议每屏最多 1-2 个广告位
2. **用户体验**：确保广告不会影响阅读体验
3. **AdSense 政策**：遵守 Google AdSense 的使用政策
4. **加载时间**：广告会在页面加载后异步加载，不会阻塞页面渲染

## 广告位配置

当前默认配置：
- **广告客户端 ID**: `ca-pub-8453754288657802`
- **广告位 ID**: `1402282744`
- **广告格式**: 自动（auto）
- **全宽响应式**: 启用

如需修改默认配置，请编辑 `docs/.vitepress/theme/components/GoogleAdsense.vue` 文件。
