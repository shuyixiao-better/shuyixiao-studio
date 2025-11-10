# PandaCoder 周报功能 - 部署指南

## 📋 功能说明

通过 iframe 内嵌 PandaCoder 周报前端页面，并自动将前端的 API 请求重定向到后端服务器。

### 工作原理

1. **前端页面代理**：通过 Netlify Functions 代理前端页面，避免 iframe 跨域问题
2. **API 请求重定向**：注入 JavaScript 拦截器，将前端的 `/api/` 请求自动重定向到后端 IP 地址
3. **资源重写**：自动重写 HTML 中的 script、link、img 等资源链接

## 🚀 部署步骤

### 1. 配置 Netlify 环境变量

在 Netlify 项目设置中添加以下环境变量：

```
PANDACODER_FRONTEND_URL=http://81.69.17.52
PANDACODER_BACKEND_URL=http://81.69.17.52:8080
```

**配置路径**：
1. 登录 Netlify
2. 进入你的项目
3. 点击 `Site settings` → `Environment variables`
4. 点击 `Add a variable`
5. 添加上述两个变量

### 2. 部署代码

```bash
# 提交代码
git add .
git commit -m "feat: 添加 PandaCoder 周报功能"
git push origin main
```

Netlify 会自动触发部署。

### 3. 验证部署

部署完成后，访问以下地址：

```
https://你的域名/tools/pandacoder-weekly/
```

## 🧪 测试功能

### 测试前端页面加载

1. 打开浏览器访问 `https://你的域名/tools/pandacoder-weekly/`
2. 应该能看到 PandaCoder 周报的前端页面
3. 打开浏览器控制台（F12），应该能看到：
   ```
   🐼 PandaCoder 配置已加载
   📍 后端地址: http://81.69.17.52:8080
   ✅ 后端 API 重定向配置完成
   ```

### 测试 API 请求

1. 在 PandaCoder 页面中进行登录操作
2. 打开浏览器控制台（F12）→ Network 标签
3. 应该能看到 API 请求被重定向到 `http://81.69.17.52:8080/api/...`
4. 控制台应该显示：
   ```
   🔄 重定向 axios: /api/auth/login → http://81.69.17.52:8080/api/auth/login
   ```

## 📁 相关文件

- `netlify/functions/pandacoder-proxy.mjs` - 代理函数
- `docs/tools/pandacoder-weekly/index.md` - 前端页面
- `netlify.toml` - Netlify 配置

## 🔧 故障排查

### 问题 1: 页面一直显示加载中

**原因**：代理函数未正确加载或环境变量未配置

**解决方案**：
1. 检查 Netlify Functions 日志
2. 确认环境变量已正确配置
3. 重新部署

### 问题 2: API 请求 403 错误

**原因**：后端服务器拒绝跨域请求

**解决方案**：
1. 检查浏览器控制台，确认请求是否被重定向到后端 IP
2. 确认后端服务器已开启 CORS
3. 如果后端不支持 CORS，需要在后端添加 CORS 头部：
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

### 问题 3: 资源加载失败

**原因**：资源链接未正确重写

**解决方案**：
1. 检查浏览器控制台的 Network 标签
2. 确认资源请求是否通过代理
3. 检查代理函数日志

## 💡 注意事项

1. **后端 CORS 配置**：确保后端服务器允许跨域请求
2. **HTTPS 混合内容**：如果你的 Netlify 站点使用 HTTPS，而后端使用 HTTP，浏览器可能会阻止请求
3. **性能考虑**：代理会增加一定的延迟，建议后端服务器性能良好

## 📞 技术支持

如有问题，请检查：
1. Netlify Functions 日志
2. 浏览器控制台日志
3. 后端服务器日志

