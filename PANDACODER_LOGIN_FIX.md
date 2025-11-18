# PandaCoder 登录页跳转修复

## 问题描述

当内嵌的 PandaCoder 服务（http://81.69.17.52）鉴权失败时，会尝试跳转到 `/login` 路径。由于是在 iframe 中嵌入，它会尝试访问 `https://www.poeticcoder.com/login`，导致 404 错误，无法显示登录页面。

## 错误信息

```
GET https://www.poeticcoder.com/login 404 (Not Found)
```

## 解决方案

修改了 `netlify/functions/pandacoder-proxy.mjs` 文件，增强了代理拦截器的功能：

### 1. 劫持 window.location.origin

这是关键修复！PandaCoder 的代码使用了 `window.location.origin + '/login'` 构造完整 URL，导致跳转到 `https://www.poeticcoder.com/login`。通过劫持 `location.origin`，让前端代码认为自己在原始服务器上：

```javascript
const realOrigin = window.location.origin; // https://www.poeticcoder.com
const fakeOrigin = 'http://81.69.17.52';   // 伪装的 origin

Object.defineProperty(window.location, 'origin', {
  get() {
    return fakeOrigin; // 返回原始服务器地址
  },
  configurable: true
});
```

### 2. 拦截完整 URL 请求

所有网络请求拦截器（fetch、XHR、axios）都增加了对完整 URL 的处理：

```javascript
// 处理完整 URL（包含 origin）
if (url.startsWith(realOrigin)) {
  const path = url.substring(realOrigin.length);
  if (path === '/login' || path.includes('/login')) {
    const proxyUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(path);
    return originalFetch(proxyUrl, options);
  }
}
```

### 3. 拦截页面导航

添加了对 `history.pushState` 和 `history.replaceState` 的拦截，确保当应用尝试跳转到 `/login` 时，会通过代理加载：

```javascript
history.pushState = function(state, title, url) {
  if (url && (url === '/login' || url.includes('/login'))) {
    const proxyUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent('/login');
    return originalPushState.call(this, state, title, proxyUrl);
  }
  return originalPushState.call(this, state, title, url);
};
```

### 2. 拦截 window.location 赋值

防止直接通过 `window.location = '/login'` 跳转：

```javascript
Object.defineProperty(window, 'location', {
  set(value) {
    if (typeof value === 'string' && (value === '/login' || value.includes('/login'))) {
      const proxyUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent('/login');
      _location.href = proxyUrl;
    } else {
      _location.href = value;
    }
  }
});
```

### 3. 增强 fetch/XHR/axios 拦截

所有的网络请求拦截器都增加了对 `/login` 路径的处理：

```javascript
// fetch 示例
if (url === '/login' || url.includes('/login')) {
  const proxyUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(url);
  return originalFetch(proxyUrl, options);
}
```

### 4. 重写 HTML 中的链接

添加了对 `<a>` 标签的重写，确保登录页链接也通过代理：

```javascript
html = html.replace(
  /<a([^>]*)\shref=["']([^"']+)["']/gi,
  (match, attrs, href) => {
    // 内部链接通过代理
    const normalizedHref = normalizePath(href);
    const newHref = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedHref)}`;
    return `<a${attrs} href="${newHref}"`;
  }
);
```

## 工作原理

1. **劫持 origin**: 让前端代码认为 `window.location.origin` 是 `http://81.69.17.52` 而不是 `https://www.poeticcoder.com`
2. **拦截完整 URL**: 当代码构造 `https://www.poeticcoder.com/login` 时，拦截器会识别并提取路径 `/login`
3. **代理转发**: 拦截到的请求会被转发到 `/api/pandacoder-proxy?type=frontend&path=/login`
4. **加载实际登录页**: 代理函数会从 `http://81.69.17.52/login` 获取真实的登录页面
5. **重写资源**: 登录页中的所有资源（CSS、JS、图片等）也会被重写，确保通过代理加载

### 请求流程示例

```
前端代码: window.location.origin + '/login'
         ↓
劫持后:   'http://81.69.17.52' + '/login' = 'http://81.69.17.52/login'
         ↓
拦截器:   检测到完整 URL 以 realOrigin 开头
         ↓
提取路径: '/login'
         ↓
代理转发: '/api/pandacoder-proxy?type=frontend&path=%2Flogin'
         ↓
Netlify:  代理到 http://81.69.17.52/login
         ↓
返回:     真实的登录页面
```

## 测试步骤

1. 部署更新后的代码到 Netlify
2. 访问包含 PandaCoder iframe 的页面
3. 等待会话过期或手动触发鉴权失败
4. 观察是否能正确显示登录页面（来自 http://81.69.17.52/login）
5. 检查浏览器控制台，应该能看到类似的日志：

```
🐼 PandaCoder 代理拦截器已加载
🔄 拦截登录页跳转: /login
✅ PandaCoder 代理拦截器配置完成
```

## 调试信息

修改后的拦截器会在控制台输出详细的日志：

- `🐼 PandaCoder 代理拦截器已加载` - 拦截器初始化
- `🔧 真实 origin: https://www.poeticcoder.com` - 显示真实的 origin
- `🔧 伪装 origin: http://81.69.17.52` - 显示伪装的 origin
- `🔄 拦截登录页跳转: /login` - 检测到登录页跳转
- `🔄 重定向 fetch/XHR/axios 登录页 (完整URL)` - 完整 URL 被重定向
- `🔄 重定向 fetch/XHR/axios 登录页` - 相对路径被重定向
- `✅ axios 拦截器配置成功` - axios 拦截器配置完成
- `✅ PandaCoder 代理拦截器配置完成` - 所有拦截器配置完成

### 验证 origin 劫持

在浏览器控制台中运行：

```javascript
console.log(window.location.origin); // 应该输出: http://81.69.17.52
```

## 注意事项

1. 确保 Netlify 环境变量中配置了正确的服务地址：
   - `PANDACODER_FRONTEND_URL=http://81.69.17.52`
   - `PANDACODER_BACKEND_URL=http://81.69.17.52:8080`

2. 登录页的所有资源（CSS、JS、API 调用）都会通过代理加载

3. 如果登录页有特殊的跳转逻辑，可能需要进一步调整

## 相关文件

- `netlify/functions/pandacoder-proxy.mjs` - 代理函数（已修改）
- `PANDACODER_DEPLOY_GUIDE.md` - 部署指南
- `PANDACODER_IFRAME_TROUBLESHOOTING.md` - 故障排查指南
