# Netlify 部署指南

## 问题修复说明

之前的实现使用了文件系统存储，但Netlify Functions是**无状态**的，不能直接写文件。现已修复为使用**Netlify Blobs**进行数据持久化存储。

## 部署步骤

### 1. 安装依赖

```bash
pnpm install
```

### 2. 推送代码到Git仓库

```bash
git add .
git commit -m "Update article stats with Netlify Blobs"
git push
```

### 3. Netlify自动部署

Netlify会自动检测到代码变更并开始部署。

### 4. 环境变量配置

**重要**: Netlify会自动注入以下环境变量，无需手动配置：
- `SITE_ID` - 站点ID
- `NETLIFY_TOKEN` - 访问令牌

这些变量会在Functions运行时自动可用。

## 验证部署

部署完成后，访问以下地址验证功能：

1. **任意文章页面** - 底部应显示统计组件
2. **管理面板** - `https://你的域名.netlify.app/admin/stats`
3. **API测试** - `https://你的域名.netlify.app/.netlify/functions/article-stats-admin`

## 数据存储说明

- **开发环境**: 使用 localStorage 模拟数据存储
- **生产环境**: 使用 Netlify Blobs 持久化存储
- **数据位置**: Netlify Blobs (自动管理，无需手动创建)

## 常见问题

### Q: 如何查看Blobs数据？

A: 登录Netlify控制台 → 选择你的站点 → Storage → Blobs

### Q: 数据会丢失吗？

A: 不会。Netlify Blobs提供可靠的持久化存储，数据会自动备份。

### Q: 有存储限制吗？

A: 免费版有一定的存储和请求限制，具体查看Netlify定价页面。

### Q: 本地开发如何测试？

A: 本地开发会自动使用localStorage，不需要连接Netlify Blobs。

## 技术栈

- **前端**: VitePress + Vue 3
- **后端**: Netlify Functions
- **存储**: Netlify Blobs
- **部署**: Netlify (自动化CI/CD)

