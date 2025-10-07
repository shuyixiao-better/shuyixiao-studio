# GitHub Pages 快速设置指南

## 📋 前提条件

- ✅ 仓库名称：`shuyixiao.github.io`
- ✅ GitHub 账号：`shuyixiao`
- ✅ 工作流文件：已创建在 `.github/workflows/deploy.yml`

## 🚀 三步启用 GitHub Pages

### 步骤 1：启用 Pages 功能

1. 访问你的仓库：`https://github.com/shuyixiao/shuyixiao.github.io`
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 "Build and deployment" 部分：
   - **Source** 选择：`GitHub Actions` 
   - （重要：不要选择 "Deploy from a branch"）
5. 保存设置

### 步骤 2：提交并推送代码

```bash
# 确保你在项目根目录
cd /Users/shuyixiao/WebstormProjects/shuyixiao-studio

# 查看更改
git status

# 添加新文件
git add .github/workflows/deploy.yml
git add DEPLOY.md
git add README.md
git add .github/GITHUB_PAGES_SETUP.md

# 提交
git commit -m "feat: 添加 GitHub Pages 自动部署支持

- 新增 GitHub Actions 工作流
- 添加详细的部署指南文档
- 支持 GitHub Pages 和 Netlify 双平台部署"

# 推送到 GitHub
git push origin main
```

### 步骤 3：查看部署状态

1. 推送成功后，访问：`https://github.com/shuyixiao/shuyixiao.github.io/actions`
2. 你会看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待约 2-3 分钟，直到显示绿色的 ✓ 标记
4. 访问你的网站：`https://shuyixiao.github.io`

## 🎉 完成！

现在你的博客已经：
- ✅ 自动部署到 GitHub Pages
- ✅ 每次推送到 main 分支都会自动更新
- ✅ 同时保持 Netlify 部署（两者互不影响）

## 🔍 验证部署

### 检查工作流状态

```bash
# 访问 Actions 页面
https://github.com/shuyixiao/shuyixiao.github.io/actions
```

### 检查部署环境

```bash
# 访问 Environments 页面
https://github.com/shuyixiao/shuyixiao.github.io/deployments
```

### 访问网站

```bash
# GitHub Pages 网址
https://shuyixiao.github.io
```

## 🔧 故障排查

### 问题 1：工作流失败 - 权限错误

**错误信息**：`Error: Resource not accessible by integration`

**解决方案**：
1. 进入 **Settings** → **Actions** → **General**
2. 找到 "Workflow permissions"
3. 选择 **"Read and write permissions"**
4. 勾选 **"Allow GitHub Actions to create and approve pull requests"**
5. 保存更改
6. 重新运行工作流

### 问题 2：Pages 未启用

**解决方案**：
1. 确保在 **Settings** → **Pages** 中
2. **Source** 选择了 `GitHub Actions`（不是 branch）
3. 如果看不到 Actions 选项，确保仓库是公开的或你有 GitHub Pro

### 问题 3：404 错误

**解决方案**：
1. 等待 5-10 分钟让 GitHub 传播更改
2. 检查 Actions 日志确认构建成功
3. 清除浏览器缓存并刷新
4. 确认访问的是正确的 URL：`https://shuyixiao.github.io`

### 问题 4：pnpm 相关错误

**解决方案**：
工作流已配置 pnpm 10.17.1，但如果仍有问题：
1. 检查 `pnpm-lock.yaml` 是否已提交
2. 确认 `package.json` 中的 `packageManager` 字段
3. 查看 Actions 日志中的具体错误

## 📊 部署状态徽章

在 README.md 中已添加部署状态徽章：

```markdown
![GitHub deployments](https://img.shields.io/github/deployments/shuyixiao/shuyixiao.github.io/github-pages?label=GitHub%20Pages)
```

这个徽章会实时显示你的部署状态：
- 🟢 绿色：部署成功
- 🟡 黄色：正在部署
- 🔴 红色：部署失败

## 🔄 后续推送

之后每次更新博客内容：

```bash
# 1. 修改文档
# 2. 提交更改
git add .
git commit -m "更新文章内容"
git push origin main

# 3. GitHub Actions 会自动：
#    - 构建你的网站
#    - 部署到 GitHub Pages
#    - 部署到 Netlify（如果配置了）
```

## 📚 更多信息

详细的部署指南请查看：[DEPLOY.md](../DEPLOY.md)

## 💡 提示

- 工作流文件位置：`.github/workflows/deploy.yml`
- 构建产物目录：`docs/.vitepress/dist`
- 每次推送都会触发自动部署
- 可以在 Actions 页面手动触发部署

---

**需要帮助？** 查看 [DEPLOY.md](../DEPLOY.md) 或 [GitHub Pages 文档](https://docs.github.com/pages)

