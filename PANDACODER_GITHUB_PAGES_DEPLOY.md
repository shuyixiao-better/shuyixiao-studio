# PandaCoder 周报功能 - GitHub Pages 部署指南

## 📋 功能说明

本文档说明如何在 GitHub Pages 中部署 PandaCoder 周报功能，使其与 Netlify 环境中的效果一致。

### 工作原理

由于 GitHub Pages 是静态托管，不支持服务器端函数（如 Netlify Functions），我们使用 **Service Worker** 来实现客户端代理功能：

1. **Service Worker 代理**：在构建时生成 Service Worker，拦截 `/api/pandacoder-proxy` 请求并转发到目标服务器
2. **HTML/CSS 重写**：自动重写 HTML 中的 script、link、img 等资源链接
3. **API 拦截器**：注入 JavaScript 拦截器，将前端的 `/api/` 请求自动重定向到代理

---

## 🚀 部署步骤

### 第一步：配置 GitHub Secrets

在 GitHub 仓库中配置环境变量：

1. 进入仓库：**Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下两个 Secrets：

```
Name: PANDACODER_FRONTEND_URL
Secret: http://your-server-ip:5174

Name: PANDACODER_BACKEND_URL
Secret: http://your-server-ip:8080
```

> ⚠️ **重要**: 
> - 将 `your-server-ip` 替换为你的实际服务器 IP 地址
> - 如果使用域名，格式为 `http://your-domain.com:port`
> - 确保端口号正确

### 第二步：推送代码触发部署

```bash
git add .
git commit -m "feat: 添加 PandaCoder 周报 GitHub Pages 支持"
git push origin write
```

GitHub Actions 会自动触发部署。

### 第三步：验证部署

部署完成后，访问以下地址：

```
https://your-username.github.io/tools/pandacoder-weekly/
```

或者如果配置了自定义域名：

```
https://www.poeticcoder.cn/tools/pandacoder-weekly/
```

---

## 🔍 技术实现

### 1. Service Worker 代理

在构建时，`scripts/generate-pandacoder-proxy.mjs` 会生成：

- **`pandacoder-proxy-sw.js`**: Service Worker 脚本，拦截并代理请求
- **`pandacoder-proxy-sw-register.js`**: Service Worker 注册脚本

### 2. 构建流程

构建脚本执行顺序：

1. `vitepress build docs` - 构建 VitePress 站点
2. `node scripts/generate-rss.mjs` - 生成 RSS Feed
3. `node scripts/generate-version.mjs` - 生成版本信息
4. `node scripts/generate-pandacoder-proxy.mjs` - 生成 Service Worker

### 3. 自动注册

`docs/tools/pandacoder-weekly/index.md` 页面会在加载时自动注册 Service Worker。

---

## 🧪 测试功能

### 测试前端页面加载

1. 打开浏览器访问 `/tools/pandacoder-weekly/`
2. 应该能看到 PandaCoder 周报的前端页面
3. 打开浏览器控制台（F12），应该能看到：
   ```
   🐼 PandaCoder Service Worker 注册成功: /
   🐼 PandaCoder 周报页面加载
   📍 代理地址: /api/pandacoder-proxy?type=frontend&path=/
   ```

### 测试 API 请求

1. 在 PandaCoder 页面中进行登录操作
2. 打开浏览器控制台（F12）→ Network 标签
3. 应该能看到 API 请求被代理到目标服务器
4. 控制台应该显示：
   ```
   🔄 [Service Worker] 代理请求: { type: 'api', path: '/api/auth/login', ... }
   ✅ [Service Worker] 响应状态: 200
   ```

---

## 🔧 故障排查

### 问题 1: Service Worker 注册失败

**原因**: Service Worker 文件未正确生成或路径错误

**解决**:
1. 检查构建日志，确认 `generate-pandacoder-proxy.mjs` 已执行
2. 检查 `docs/.vitepress/dist/pandacoder-proxy-sw.js` 文件是否存在
3. 确认 GitHub Secrets 已正确配置

### 问题 2: 代理请求失败

**原因**: 目标服务器无法访问或 CORS 配置问题

**解决**:
1. 检查目标服务器是否正常运行
2. 检查服务器防火墙是否开放端口
3. 检查 IP 地址和端口是否正确
4. 确认目标服务器支持 CORS（Service Worker 可以绕过部分 CORS 限制）

### 问题 3: 页面显示空白

**原因**: iframe 加载失败或 Service Worker 未正确拦截请求

**解决**:
1. 打开浏览器控制台查看错误信息
2. 检查 Network 标签，查看请求是否被正确代理
3. 确认 Service Worker 已注册并激活
4. 尝试清除浏览器缓存并重新加载

---

## 📁 相关文件

- `scripts/generate-pandacoder-proxy.mjs` - Service Worker 生成脚本
- `docs/tools/pandacoder-weekly/index.md` - 周报页面
- `.github/workflows/deploy.yml` - GitHub Actions 工作流
- `package.json` - 构建脚本配置

---

## 🔄 与 Netlify 的对比

| 功能 | Netlify | GitHub Pages |
|------|---------|--------------|
| 代理方式 | Netlify Functions | Service Worker |
| 服务器端支持 | ✅ 支持 | ❌ 不支持 |
| 客户端代理 | ✅ 支持 | ✅ 支持 |
| 环境变量 | Netlify 后台配置 | GitHub Secrets |
| 部署方式 | 自动部署 | GitHub Actions |

---

## 📝 注意事项

1. **Service Worker 限制**:
   - Service Worker 需要 HTTPS（GitHub Pages 自动提供）
   - Service Worker 只能拦截同源请求（但可以通过 fetch 代理跨域请求）
   - Service Worker 需要浏览器支持

2. **CORS 问题**:
   - 如果目标服务器不支持 CORS，Service Worker 可能无法正常工作
   - 建议在目标服务器上配置 CORS 头部

3. **缓存问题**:
   - Service Worker 会缓存，更新后可能需要清除浏览器缓存
   - 可以通过更新 Service Worker 版本来强制更新

---

## 🎉 完成

现在你的 PandaCoder 周报功能已经在 GitHub Pages 中部署完成，功能与 Netlify 环境中的效果一致！

如有问题，请查看故障排查部分或检查构建日志。

