# 快速部署指南 - 文章统计功能修复

## 🔧 问题说明

之前的实现使用文件系统存储数据，但Netlify Functions是**无状态容器**，每次调用都是独立的，不支持文件系统持久化。

## ✅ 解决方案

已更新为使用 **Netlify Blobs** - Netlify官方提供的键值存储服务，专为Functions设计。

## 🚀 部署步骤

### 1. 提交代码

```bash
git add .
git commit -m "Fix: 使用Netlify Blobs存储统计数据"
git push
```

### 2. Netlify自动部署

推送后，Netlify会自动触发部署。无需额外配置，环境变量会自动注入。

### 3. 验证功能

访问你的网站任意文章，应该能看到：
- ✅ 底部显示统计组件（阅读、点赞、收藏）
- ✅ 点击点赞/收藏能正常切换
- ✅ 刷新页面后阅读量增加
- ✅ 访问 `/admin/stats` 能看到管理面板

## 📦 关键改动

1. **添加依赖**: `@netlify/blobs` (已安装)
2. **更新Functions**: 所有3个Functions都改用Blobs API
3. **环境变量**: 自动注入，无需手动配置

## 🔍 调试方法

如果部署后仍有问题，检查以下内容：

### 查看Functions日志

Netlify控制台 → 你的站点 → Functions → 查看最近的调用日志

### 测试API端点

打开浏览器控制台，访问任意文章页面，检查Network标签：

```
请求: /.netlify/functions/article-stats?articleId=/your-article-path
状态码应该是: 200
响应: {"views":0,"likes":0,"favorites":0}
```

### 检查Blobs存储

Netlify控制台 → 你的站点 → Storage → Blobs → 查看 `article-stats` store

## 💡 提示

- **首次使用**: 第一次访问时会自动创建Blobs store
- **数据迁移**: 旧数据不会自动迁移，从0开始统计
- **本地开发**: 本地使用localStorage，不影响生产数据

## ❓ 常见问题

**Q: 显示0是正常的吗？**  
A: 是的，因为使用了新的存储方式，数据重新开始统计。

**Q: 需要配置环境变量吗？**  
A: 不需要，Netlify会自动注入所需的环境变量。

**Q: 为什么本地开发也显示0？**  
A: 本地使用localStorage，清除浏览器缓存后会重置。

**Q: 生产环境数据会丢失吗？**  
A: 不会，Netlify Blobs提供可靠的持久化存储。

