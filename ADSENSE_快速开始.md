# Google AdSense 快速开始指南

## 🎯 一分钟快速上手

### 第一步：在文章中插入广告

打开任意 Markdown 文件，在需要显示广告的位置添加：

```markdown
<GoogleAdsense />
```

就这么简单！

### 第二步：查看效果

保存文件后，启动开发服务器：

```bash
npm run docs:dev
```

访问你的文章页面，广告就会自动显示。

## 📝 实际使用示例

### 示例 1：在文章顶部添加广告

```markdown
# 我的技术文章

<GoogleAdsense />

这是文章的正文内容...
```

### 示例 2：在文章中间添加广告

```markdown
## 第一部分

这是第一部分的内容...

<GoogleAdsense />

## 第二部分

这是第二部分的内容...
```

### 示例 3：在文章底部添加广告

```markdown
## 文章结尾

这是文章的结尾内容...

<GoogleAdsense />

---
感谢阅读！
```

## 🎨 自定义广告位

如果你有多个广告位，可以指定不同的广告位 ID：

```markdown
<!-- 顶部广告 -->
<GoogleAdsense ad-slot="1402282744" />

<!-- 中间广告 -->
<GoogleAdsense ad-slot="你的其他广告位ID" />

<!-- 底部广告 -->
<GoogleAdsense ad-slot="又一个广告位ID" />
```

## 💡 推荐的广告布局

### 短文章（<500字）

```markdown
# 文章标题

<GoogleAdsense />

文章内容...
```

### 中等文章（500-1500字）

```markdown
# 文章标题

<GoogleAdsense />

第一部分内容...

## 中间部分

<GoogleAdsense />

第二部分内容...
```

### 长文章（>1500字）

```markdown
# 文章标题

<GoogleAdsense />

第一部分内容...

## 第二部分

<GoogleAdsense />

第二部分内容...

## 第三部分

内容...

<GoogleAdsense />

结尾内容...
```

## ⚙️ 组件参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `ad-client` | AdSense 客户端 ID | `ca-pub-8453754288657802` |
| `ad-slot` | 广告位 ID | `1402282744` |
| `ad-format` | 广告格式 | `auto` |
| `full-width-responsive` | 全宽响应式 | `true` |

## 🚀 部署到生产环境

### 1. 构建网站

```bash
npm run docs:build
```

### 2. 部署

将 `docs/.vitepress/dist` 目录部署到你的服务器或托管平台。

### 3. 验证广告

访问你的网站，检查广告是否正常显示。

## ⚠️ 常见问题

### Q: 广告不显示怎么办？

**A:** 可能的原因：
1. AdSense 账户还在审核中
2. 浏览器安装了广告拦截插件
3. 网络连接问题
4. 广告代码配置错误

**解决方法：**
1. 检查 AdSense 账户状态
2. 禁用广告拦截插件测试
3. 打开浏览器控制台查看错误信息
4. 验证广告客户端 ID 和广告位 ID 是否正确

### Q: 可以在本地开发环境看到广告吗？

**A:** 可以，但可能会显示测试广告或空白。在生产环境中，广告会正常显示。

### Q: 一个页面可以放多少个广告？

**A:** Google AdSense 没有明确限制，但建议：
- 保持合理的内容与广告比例
- 不要影响用户阅读体验
- 一般每屏 1-2 个广告为宜

### Q: 如何修改默认的广告参数？

**A:** 编辑 `docs/.vitepress/theme/components/GoogleAdsense.vue` 文件，修改 `props` 中的 `default` 值。

## 📚 更多资源

- [完整使用指南](./GOOGLE_ADSENSE_GUIDE.md)
- [示例文章](./docs/articles/adsense-demo.md)
- [Google AdSense 帮助中心](https://support.google.com/adsense/)

## 🎉 开始使用

现在你已经掌握了基本用法，赶快在你的文章中添加广告吧！

```markdown
<GoogleAdsense />
```

就是这么简单！✨
