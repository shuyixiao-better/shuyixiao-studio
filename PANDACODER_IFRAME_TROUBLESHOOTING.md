# 🔧 PandaCoder iframe 内嵌问题排查指南

## 📋 问题描述

在 Netlify 部署后，`/tools/pandacoder-weekly/` 页面的 iframe 内嵌内容无法显示。

---

## 🔍 可能的原因

### 1. **环境变量未配置**
iframe 通过代理访问 PandaCoder 服务，需要在 Netlify 配置环境变量。

### 2. **X-Frame-Options 限制**
PandaCoder 前端服务可能设置了 `X-Frame-Options: DENY` 或 `SAMEORIGIN`，阻止 iframe 嵌入。

### 3. **CSP (Content Security Policy) 限制**
内容安全策略可能限制了 iframe 的加载。

### 4. **CORS 跨域问题**
虽然代理设置了 CORS 头，但可能还有其他跨域限制。

### 5. **资源加载失败**
HTML 中的 JS、CSS 等静态资源可能没有正确通过代理加载。

### 6. **网络连接问题**
Netlify 服务器无法访问你的 PandaCoder 服务（IP 或端口不可达）。

---

## ✅ 解决方案（已实施）

### 1. **增强 iframe sandbox 权限**

**修改文件**: `docs/tools/pandacoder-weekly/index.md`

```html
<iframe 
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups 
           allow-popups-to-escape-sandbox allow-modals allow-downloads"
  allow="fullscreen"
/>
```

**说明**: 添加了更多必要的权限，确保 iframe 内的页面可以正常运行。

---

### 2. **移除 X-Frame-Options 限制**

**修改文件**: `netlify/functions/pandacoder-proxy.mjs`

```javascript
// 移除可能阻止 iframe 嵌入的响应头
delete responseHeaders['x-frame-options'];
delete responseHeaders['content-security-policy'];

// 添加允许 iframe 嵌入的头部
responseHeaders['X-Frame-Options'] = 'ALLOWALL';
```

**说明**: 确保代理返回的响应允许 iframe 嵌入。

---

### 3. **改进资源链接重写**

**修改文件**: `netlify/functions/pandacoder-proxy.mjs`

增强了 `rewriteHtmlLinks` 函数，支持：
- JS 文件重写
- CSS 文件重写
- 图片资源重写
- API 调用重写（fetch 和 axios）
- 添加 `<base>` 标签确保相对路径正确

---

### 4. **添加错误监听和调试**

**修改文件**: `docs/tools/pandacoder-weekly/index.md`

```javascript
// 监听 iframe 加载事件
const handleIframeLoad = () => {
  console.log('✅ iframe 加载成功')
}

const handleIframeError = () => {
  console.error('❌ iframe 加载失败')
  error.value = 'iframe_load_error'
}
```

**说明**: 添加了 iframe 加载成功/失败的监听，方便调试。

---

## 🧪 测试步骤

### 步骤 1: 检查环境变量配置

访问测试端点：
```
https://www.poeticcoder.com/api/pandacoder-test
```

应该看到类似输出：
```json
{
  "timestamp": "2025-11-10T13:41:19.000Z",
  "environment": {
    "frontendConfigured": true,
    "backendConfigured": true,
    "frontendUrl": "已配置 (隐藏)",
    "backendUrl": "已配置 (隐藏)"
  },
  "tests": [
    {
      "name": "前端服务连接",
      "status": "success",
      "statusCode": 200,
      "message": "前端服务可访问"
    },
    {
      "name": "后端服务连接",
      "status": "success",
      "statusCode": 200,
      "message": "后端服务可访问"
    }
  ]
}
```

**如果环境变量未配置**:
1. 登录 Netlify 后台
2. 进入你的站点 → Site settings → Environment variables
3. 添加以下变量：
   - `PANDACODER_FRONTEND_URL`: 你的前端服务地址（如 `http://your-ip:5174`）
   - `PANDACODER_BACKEND_URL`: 你的后端服务地址（如 `http://your-ip:8080`）
4. 重新部署站点

---

### 步骤 2: 检查代理服务

访问代理端点：
```
https://www.poeticcoder.com/api/pandacoder-proxy?type=frontend&path=/
```

**预期结果**: 应该返回 PandaCoder 前端的 HTML 内容。

**如果返回 503 错误**: 环境变量未配置，参考步骤 1。

**如果返回 502 错误**: Netlify 无法访问你的 PandaCoder 服务，检查：
- PandaCoder 服务是否正在运行
- IP 地址和端口是否正确
- 防火墙是否允许 Netlify 访问（可能需要公网 IP）

---

### 步骤 3: 检查浏览器控制台

1. 访问 `https://www.poeticcoder.com/tools/pandacoder-weekly/`
2. 打开浏览器开发者工具（F12）
3. 查看 Console 标签页

**正常情况**: 应该看到 `✅ iframe 加载成功`

**异常情况**: 
- 如果看到 `❌ iframe 加载失败`，检查 Network 标签页的请求
- 如果看到 CORS 错误，检查代理服务的 CORS 配置
- 如果看到 X-Frame-Options 错误，说明修改未生效，需要重新部署

---

### 步骤 4: 检查 Network 请求

在浏览器开发者工具的 Network 标签页：

1. 刷新页面
2. 查找 `/api/pandacoder-proxy?type=frontend&path=/` 请求
3. 检查响应头：
   - `X-Frame-Options` 应该是 `ALLOWALL`
   - `Access-Control-Allow-Origin` 应该是 `*`
   - `Content-Type` 应该是 `text/html`

---

## 🚨 常见问题

### Q1: iframe 显示空白

**原因**: 可能是 PandaCoder 服务未启动或网络不可达。

**解决**:
1. 确认 PandaCoder 前后端服务都在运行
2. 访问 `/api/pandacoder-test` 检查连接状态
3. 检查防火墙设置

---

### Q2: 显示 "服务未配置"

**原因**: Netlify 环境变量未设置。

**解决**:
1. 登录 Netlify 后台配置环境变量
2. 重新部署站点
3. 清除浏览器缓存后重试

---

### Q3: 显示 "服务暂时不可用"

**原因**: Netlify 无法访问你的 PandaCoder 服务。

**解决**:
1. 确认 PandaCoder 服务使用的是公网 IP（不是 localhost）
2. 检查服务器防火墙是否开放对应端口
3. 如果使用内网 IP，考虑使用 ngrok 等工具暴露服务

---

### Q4: iframe 加载很慢

**原因**: 网络延迟或资源较大。

**解决**:
1. 优化 PandaCoder 前端资源（压缩、CDN）
2. 考虑在 Netlify 添加缓存策略
3. 检查网络带宽

---

## 📝 部署检查清单

部署前确认：

- [ ] PandaCoder 前端服务正在运行
- [ ] PandaCoder 后端服务正在运行
- [ ] 服务使用公网 IP 或域名（不是 localhost）
- [ ] Netlify 环境变量已配置
- [ ] 防火墙已开放对应端口
- [ ] 代码已推送到 Git 仓库
- [ ] Netlify 自动部署已触发

部署后测试：

- [ ] 访问 `/api/pandacoder-test` 检查服务状态
- [ ] 访问 `/api/pandacoder-proxy?type=frontend&path=/` 检查代理
- [ ] 访问 `/tools/pandacoder-weekly/` 检查页面
- [ ] 打开 F12 检查控制台无错误
- [ ] 检查 iframe 内容正常显示

---

## 🔗 相关文档

- [快速启动指南](./PANDACODER_WEEKLY_QUICK_START.md)
- [配置指南](./PANDACODER_WEEKLY_SETUP_GUIDE.md)
- [可行性分析](./PANDACODER_WEEKLY_INTEGRATION_FEASIBILITY.md)

---

## 💡 高级调试

如果以上步骤都无法解决问题，尝试：

1. **本地测试代理**:
   ```bash
   netlify dev
   ```
   访问 `http://localhost:8888/tools/pandacoder-weekly/`

2. **查看 Netlify Functions 日志**:
   - 登录 Netlify 后台
   - 进入 Functions 标签页
   - 查看 `pandacoder-proxy` 的日志

3. **使用 curl 测试**:
   ```bash
   curl -I "https://www.poeticcoder.com/api/pandacoder-proxy?type=frontend&path=/"
   ```

4. **检查 PandaCoder 服务的响应头**:
   ```bash
   curl -I http://your-ip:5174
   ```
   查看是否有 `X-Frame-Options` 或 CSP 限制

---

## 📞 获取帮助

如果问题仍未解决，请提供以下信息：

1. `/api/pandacoder-test` 的完整输出
2. 浏览器控制台的错误信息（截图）
3. Network 标签页的请求详情（截图）
4. Netlify Functions 日志（如果可以访问）

---

**最后更新**: 2025-11-10

