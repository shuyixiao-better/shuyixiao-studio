# 部署指南

本项目支持多平台部署，目前已配置 **Netlify** 和 **GitHub Pages** 两种部署方式。

## 📊 部署平台对比

| 特性 | GitHub Pages | Netlify |
|------|-------------|---------|
| 构建触发 | Git push 自动触发 | Git push 自动触发 |
| 构建时间 | 约 2-3 分钟 | 约 2-3 分钟 |
| 自定义域名 | ✅ 支持 | ✅ 支持 |
| HTTPS | ✅ 免费 | ✅ 免费 |
| CDN | ✅ GitHub CDN | ✅ Netlify CDN |
| 构建日志 | Actions 标签页 | Netlify 控制台 |
| 适用场景 | 个人博客、文档站点 | 个人博客、文档站点 |

## 🚀 GitHub Pages 部署

### 1. 仓库要求

- 仓库名称：`shuyixiao.github.io`（用户站点）
- 访问地址：`https://shuyixiao.github.io/`
- 可见性：公开或私有（GitHub Pro/Teams/Enterprise）

### 2. 配置步骤

#### 步骤一：启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 在 "Build and deployment" 部分：
   - **Source**: 选择 `GitHub Actions`
   - 保存设置

#### 步骤二：推送代码

```bash
# 确保工作流文件已提交
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

#### 步骤三：查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看 "Deploy to GitHub Pages" 工作流运行状态
3. 等待构建完成（约 2-3 分钟）

#### 步骤四：访问网站

构建成功后，访问：`https://shuyixiao.github.io/`

### 3. 工作流说明

工作流文件位置：`.github/workflows/deploy.yml`

**触发条件**：
- 推送到 `main` 分支时自动触发
- 可在 Actions 页面手动触发

**构建过程**：
1. 检出代码
2. 设置 Node.js 22 环境
3. 设置 pnpm 10.17.1
4. 安装依赖
5. 构建 VitePress 项目
6. 上传构建产物
7. 部署到 GitHub Pages

### 4. 自定义域名（可选）

如果要使用自定义域名（如 `blog.shuyixiao.com`）：

#### 4.1 添加 DNS 记录

在你的域名提供商处添加以下记录：

```
类型: CNAME
名称: blog（或 www）
值: shuyixiao.github.io
```

或者使用 A 记录指向 GitHub Pages IP：

```
类型: A
名称: @（或 blog）
值: 185.199.108.153
值: 185.199.109.153
值: 185.199.110.153
值: 185.199.111.153
```

#### 4.2 在 GitHub 配置自定义域名

1. 进入 **Settings** → **Pages**
2. 在 "Custom domain" 输入你的域名
3. 勾选 "Enforce HTTPS"
4. 保存设置

#### 4.3 更新 VitePress 配置

创建文件 `docs/public/CNAME`，内容为你的域名：

```
blog.shuyixiao.com
```

### 5. 常见问题

#### 问题 1: 404 错误

**原因**：GitHub Pages 未正确配置或构建失败

**解决方案**：
1. 确保 Pages 设置中 Source 选择了 `GitHub Actions`
2. 查看 Actions 日志，确认构建是否成功
3. 等待 DNS 传播（最多 24 小时）

#### 问题 2: 样式丢失

**原因**：base 路径配置错误

**解决方案**：
- 用户站点（`shuyixiao.github.io`）不需要配置 base
- 如果不慎配置了 base，请删除 `config.mts` 中的 base 配置

#### 问题 3: 工作流失败

**原因**：权限不足或依赖安装失败

**解决方案**：
1. 检查 **Settings** → **Actions** → **General**
2. 确保 "Workflow permissions" 设置为 "Read and write permissions"
3. 查看 Actions 日志中的具体错误信息

## 🌐 Netlify 部署

### 1. 当前配置

已通过 `netlify.toml` 配置好 Netlify 部署：

```toml
[build]
  command = "corepack enable && pnpm install && pnpm run docs:build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "10.17.1"
```

### 2. 部署方式

Netlify 支持两种部署方式：

#### 方式一：通过 Netlify 网站部署（推荐）

1. 访问 [Netlify](https://app.netlify.com/)
2. 登录并点击 "Add new site" → "Import an existing project"
3. 选择 GitHub 并授权
4. 选择 `shuyixiao.github.io` 仓库
5. Netlify 会自动检测 `netlify.toml` 配置
6. 点击 "Deploy site"

#### 方式二：通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化站点
netlify init

# 手动部署
netlify deploy --prod
```

### 3. 自动部署

Netlify 会自动：
- 监听 GitHub 仓库的 `main` 分支
- 在每次推送时自动构建和部署
- 提供预览部署（Pull Request）

### 4. 自定义域名

在 Netlify 控制台：
1. 进入 "Domain settings"
2. 添加自定义域名
3. 按照提示配置 DNS 记录

## 🔄 双平台部署

### 同时使用两个平台的优势

1. **高可用性**：一个平台故障时，另一个平台仍可访问
2. **测试环境**：可以用一个平台做预览测试
3. **性能对比**：对比不同 CDN 的访问速度
4. **备份保障**：降低单点故障风险

### 推荐配置

- **GitHub Pages**：作为主站点（`shuyixiao.github.io`）
- **Netlify**：作为备用站点或预览环境

### 域名分配建议

```
主站点（GitHub Pages）: https://shuyixiao.github.io/
备用站点（Netlify）:    https://shuyixiao-blog.netlify.app/
或自定义域名:           blog.shuyixiao.com  → GitHub Pages
                      preview.shuyixiao.com → Netlify
```

## 📝 本地测试

在部署前，建议先本地测试：

```bash
# 1. 构建生产版本
pnpm run docs:build

# 2. 预览生产版本
pnpm run docs:preview

# 3. 访问 http://localhost:4173
```

确认无误后再推送到 GitHub。

## 🛠️ 部署清单

部署前检查清单：

- [ ] 所有文章的图片链接正确
- [ ] Mermaid 图表正常显示
- [ ] 导航和侧边栏链接有效
- [ ] 搜索功能正常
- [ ] 响应式布局正常（移动端、平板、桌面）
- [ ] 社交链接正确
- [ ] favicon 正常显示
- [ ] 本地预览构建版本无问题

## 📊 部署监控

### GitHub Pages

查看部署状态：
```
https://github.com/shuyixiao/shuyixiao.github.io/actions
```

### Netlify

查看部署状态：
```
https://app.netlify.com/sites/your-site-name/deploys
```

## 🔧 故障排查

### 如果构建失败

1. **检查 Node 版本**：确保使用 Node 22
2. **检查依赖**：确认 `pnpm-lock.yaml` 已提交
3. **本地构建测试**：运行 `pnpm run docs:build` 确认可以本地构建
4. **查看日志**：查看 Actions 或 Netlify 的详细构建日志

### 获取帮助

- GitHub Pages 文档：https://docs.github.com/pages
- Netlify 文档：https://docs.netlify.com/
- VitePress 文档：https://vitepress.dev/guide/deploy

## 🎉 部署成功后

1. 测试所有页面和功能
2. 在浏览器中清除缓存并刷新
3. 测试移动端访问
4. 设置网站监控（如 UptimeRobot）
5. 提交 sitemap 到搜索引擎

---

**提示**：两个平台可以同时使用，互不影响。推送代码后，两个平台会同时自动构建和部署。

