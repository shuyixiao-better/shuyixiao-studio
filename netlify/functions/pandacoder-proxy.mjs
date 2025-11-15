/**
 * PandaCoder 周报服务代理
 *
 * 功能：
 * 1. 代理前端页面请求，重写资源链接
 * 2. 代理后端 API 请求，解决跨域问题
 * 3. 注入 API 拦截器，自动代理前端的 API 调用
 * 4. 允许 iframe 嵌入
 */

// 获取环境变量配置
const PANDACODER_FRONTEND_URL = process.env.PANDACODER_FRONTEND_URL || 'http://81.69.17.52';
const PANDACODER_BACKEND_URL = process.env.PANDACODER_BACKEND_URL || 'http://81.69.17.52:8080';

export default async (req, context) => {
  // CORS 头部配置
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const type = url.searchParams.get('type') || 'frontend';

    // 确定目标 URL
    let targetUrl;
    if (type === 'api') {
      // 代理后端 API 请求
      targetUrl = `${PANDACODER_BACKEND_URL}${path}`;
      console.log(`🔄 [API] ${req.method} ${path}`);
    } else {
      // 代理前端页面请求
      targetUrl = `${PANDACODER_FRONTEND_URL}${path}`;
      console.log(`🔄 [Frontend] ${req.method} ${path}`);
    }

    // 构建代理请求
    const proxyHeaders = new Headers();

    // 复制必要的请求头
    for (const [key, value] of req.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // 跳过这些头部
      if (!['host', 'connection', 'x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-host'].includes(lowerKey)) {
        proxyHeaders.set(key, value);
      }
    }

    // 发起代理请求
    const proxyOptions = {
      method: req.method,
      headers: proxyHeaders,
    };

    // 如果有请求体，添加到代理请求中
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.arrayBuffer();
      if (body.byteLength > 0) {
        proxyOptions.body = body;
      }
    }

    const response = await fetch(targetUrl, proxyOptions);

    console.log(`✅ [frontend] ${response.status} ${response.statusText}`);

    // 获取 Content-Type
    const contentType = response.headers.get('content-type') || '';

    // 根据文件扩展名推断 Content-Type（优先使用扩展名判断）
    let finalContentType = contentType;

    // 检查文件扩展名
    if (path.endsWith('.css')) {
      finalContentType = 'text/css; charset=utf-8';
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      finalContentType = 'application/javascript; charset=utf-8';
    } else if (path.endsWith('.json')) {
      finalContentType = 'application/json; charset=utf-8';
    } else if (path.endsWith('.html') || path === '/') {
      finalContentType = 'text/html; charset=utf-8';
    } else if (path.endsWith('.png')) {
      finalContentType = 'image/png';
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      finalContentType = 'image/jpeg';
    } else if (path.endsWith('.svg')) {
      finalContentType = 'image/svg+xml';
    } else if (path.endsWith('.woff') || path.endsWith('.woff2')) {
      finalContentType = 'font/woff2';
    } else if (path.endsWith('.ttf')) {
      finalContentType = 'font/ttf';
    } else if (!contentType || contentType === 'application/octet-stream') {
      // 如果没有扩展名匹配且没有 Content-Type，默认为 HTML
      finalContentType = 'text/html; charset=utf-8';
    }

    let responseBody;

    // API 请求直接返回，但对401响应做特殊处理
    if (type === 'api') {
      // 对于401响应，返回自定义的登录页面HTML
      if (response.status === 401) {
        console.log('🔒 [API] 收到401响应，返回登录提示页面');
        responseBody = generateLoginPage(path);
        finalContentType = 'text/html; charset=utf-8';
      } else {
        // 对于其他JSON响应，返回文本
        if (finalContentType.includes('application/json') || finalContentType.includes('text/')) {
          responseBody = await response.text();
        } else {
          responseBody = await response.arrayBuffer();
        }
      }
    }
    // 前端资源需要重写
    else {
      // 处理文本内容（HTML/CSS/JS）需要重写
      if (finalContentType.includes('text/html') || finalContentType.includes('text/css') ||
          finalContentType.includes('javascript') || finalContentType.includes('application/json')) {

        const text = await response.text();

        // HTML 需要重写链接并注入拦截器
        if (finalContentType.includes('text/html')) {
          responseBody = rewriteHtml(text);
        }
        // CSS 需要重写 url()
        else if (finalContentType.includes('text/css')) {
          responseBody = rewriteCss(text);
        }
        // 其他文本直接返回
        else {
          responseBody = text;
        }
      } else {
        // 二进制内容直接返回
        responseBody = await response.arrayBuffer();
      }
    }

    // 构建响应头
    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': finalContentType,
    };

    // 复制其他响应头
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // 跳过可能阻止 iframe 的头部和已设置的头部
      if (!['x-frame-options', 'content-security-policy', 'content-type',
            'access-control-allow-origin', 'access-control-allow-methods',
            'access-control-allow-headers'].includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    }

    // 确保允许 iframe 嵌入
    responseHeaders['X-Frame-Options'] = 'ALLOWALL';

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('❌ 代理错误:', error);

    return new Response(
      JSON.stringify({
        error: '代理服务暂时不可用',
        message: error.message,
        type: 'PROXY_ERROR'
      }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

/**
 * 重写 HTML 内容
 * 1. 重写资源链接（script, link, img 等）
 * 2. 注入后端 API 重定向脚本
 */
function rewriteHtml(html) {
  // 辅助函数：规范化路径
  const normalizePath = (path) => {
    // 确保路径以 / 开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  };

  // 重写 script src
  html = html.replace(
    /<script([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      // 跳过外部链接
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
        return match;
      }
      const normalizedSrc = normalizePath(src);
      const newSrc = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedSrc)}`;
      return `<script${attrs} src="${newSrc}"`;
    }
  );

  // 重写 link href (CSS)
  html = html.replace(
    /<link([^>]*)\shref=["']([^"']+)["']/gi,
    (match, attrs, href) => {
      // 跳过外部链接
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return match;
      }
      const normalizedHref = normalizePath(href);
      const newHref = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedHref)}`;
      return `<link${attrs} href="${newHref}"`;
    }
  );

  // 重写 img src
  html = html.replace(
    /<img([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      // 跳过外部链接和 data URI
      if (src.startsWith('http://') || src.startsWith('https://') ||
          src.startsWith('//') || src.startsWith('data:')) {
        return match;
      }
      const normalizedSrc = normalizePath(src);
      const newSrc = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedSrc)}`;
      return `<img${attrs} src="${newSrc}"`;
    }
  );

  // 注入配置脚本，让前端通过代理访问后端 API
  const interceptorScript = `
<script>
(function() {
  // 拦截 fetch - 将 /api/ 请求重定向到代理
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + encodeURIComponent(url);
      return originalFetch(proxyUrl, options);
    }
    return originalFetch(url, options);
  };

  // 拦截 XMLHttpRequest - 将 /api/ 请求重定向到代理
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;

    xhr.open = function(method, url, ...args) {
      if (typeof url === 'string' && url.startsWith('/api/')) {
        const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + encodeURIComponent(url);
        return originalOpen.call(this, method, proxyUrl, ...args);
      }
      return originalOpen.call(this, method, url, ...args);
    };

    return xhr;
  };

  // 拦截 axios - 将 /api/ 请求重定向到代理
  let axiosIntercepted = false;

  const interceptAxios = (axiosInstance) => {
    if (!axiosInstance || axiosIntercepted) return;

    try {
      axiosInstance.interceptors.request.use(config => {
        if (config.url && config.url.startsWith('/api/')) {
          config.url = '/api/pandacoder-proxy?type=api&path=' + encodeURIComponent(config.url);
        }
        return config;
      }, error => Promise.reject(error));
      axiosIntercepted = true;
    } catch (e) {
      console.warn('⚠️ API 拦截器配置失败:', e);
    }
  };

  // 劫持 window.axios
  let _axios = window.axios;
  Object.defineProperty(window, 'axios', {
    get() {
      return _axios;
    },
    set(value) {
      _axios = value;
      if (value) {
        interceptAxios(value);
      }
    },
    configurable: true
  });

  // 如果 axios 已存在
  if (window.axios) {
    interceptAxios(window.axios);
  }

  // 延迟检查
  setTimeout(() => window.axios && interceptAxios(window.axios), 100);
  setTimeout(() => window.axios && interceptAxios(window.axios), 500);
  setTimeout(() => window.axios && interceptAxios(window.axios), 1000);
})();
</script>
`;

  // 添加 CSS 样式来隐藏遮罩元素
  const curtainRemovalStyle = `
<style>
/* 隐藏 PandaCoder 页面中的遮罩元素 */
.aside-curtain {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  pointer-events: none !important;
}
</style>
`;

  // 在 <head> 之后立即插入拦截器和隐藏遮罩元素的样式（确保最先执行）
  const combinedScript = interceptorScript + curtainRemovalStyle;
  
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + combinedScript);
  } else if (html.includes('<head ')) {
    html = html.replace(/<head([^>]*)>/, '<head$1>' + combinedScript);
  } else if (html.includes('</head>')) {
    // 如果找不到 <head>，在 </head> 之前插入
    html = html.replace('</head>', combinedScript + '</head>');
  } else if (html.includes('<body')) {
    // 如果没有 head，在 <body> 之前插入
    html = html.replace('<body', combinedScript + '<body');
  } else {
    // 最后的兜底方案：在 HTML 开头插入
    html = combinedScript + html;
  }

  return html;
}

/**
 * 重写 CSS 内容
 * 重写 url() 引用
 */
function rewriteCss(css) {
  // 辅助函数：规范化路径
  const normalizePath = (path) => {
    // 确保路径以 / 开头
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  };

  // 重写 url()
  css = css.replace(
    /url\(["']?([^"')]+)["']?\)/gi,
    (match, url) => {
      // 跳过外部链接和 data URI
      if (url.startsWith('http://') || url.startsWith('https://') ||
          url.startsWith('//') || url.startsWith('data:')) {
        return match;
      }
      const normalizedUrl = normalizePath(url);
      const newUrl = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedUrl)}`;
      return `url("${newUrl}")`;
    }
  );

  return css;
}

/**
 * 生成登录提示页面
 * 当后端返回401时，显示这个页面而不是404错误
 */
function generateLoginPage(requestedPath) {
  const timestamp = new Date().toISOString();
  const frontendUrl = PANDACODER_FRONTEND_URL || '';
  const backendUrl = PANDACODER_BACKEND_URL || '';
  
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录已过期 - PandaCoder</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .login-container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    
    .panda-icon {
      font-size: 64px;
      margin-bottom: 20px;
      display: block;
    }
    
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      margin-bottom: 16px;
    }
    
    .message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    
    .details {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #888;
      text-align: left;
    }
    
    .details-item {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    
    .details-label {
      font-weight: 600;
    }
    
    .btn-container {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    
    .btn {
      flex: 1;
      border: none;
      border-radius: 8px;
      padding: 14px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #666;
    }
    
    .btn-secondary:hover {
      background: #e9e9e9;
    }
    
    /* 暗色模式支持 */
    @media (prefers-color-scheme: dark) {
      .login-container {
        background: #1e1e1e;
        color: #fff;
      }
      
      .title {
        color: #fff;
      }
      
      .message {
        color: #ccc;
      }
      
      .details {
        background: #2a2a2a;
        color: #ccc;
      }
      
      .btn-secondary {
        background: #2a2a2a;
        color: #ccc;
      }
      
      .btn-secondary:hover {
        background: #3a3a3a;
      }
    }
  </style>
</head>
<body>
  <div class="login-container">
    <span class="panda-icon">🐼</span>
    <h1 class="title">登录已过期</h1>
    <p class="message">
      您的登录会话已过期，请重新登录以继续访问 PandaCoder 周报系统。
    </p>
    
    <div class="details">
      <div class="details-item">
        <span class="details-label">请求路径:</span>
        <span>${requestedPath}</span>
      </div>
      <div class="details-item">
        <span class="details-label">状态:</span>
        <span>认证失败 (401)</span>
      </div>
      <div class="details-item">
        <span class="details-label">时间:</span>
        <span>${new Date(timestamp).toLocaleString()}</span>
      </div>
    </div>
    
    <div class="btn-container">
      <button class="btn btn-primary" id="reload-btn">
        刷新页面
      </button>
      <button class="btn btn-secondary" id="parent-reload-btn">
        刷新父页面
      </button>
    </div>
  </div>

  <script>
    // 刷新当前页面
    document.getElementById('reload-btn').addEventListener('click', function() {
      window.location.reload();
    });
    
    // 尝试刷新父页面（如果当前页面在iframe中）
    document.getElementById('parent-reload-btn').addEventListener('click', function() {
      if (window.parent && window.parent !== window) {
        // 在iframe中，尝试刷新父页面
        try {
          window.parent.location.href = '/tools/pandacoder-weekly/';
        } catch (e) {
          // 跨域限制，回退到刷新当前页面
          window.location.reload();
        }
      } else {
        // 不在iframe中，直接刷新当前页面
        window.location.reload();
      }
    });
    
    // 尝试通过消息通知父页面
    setTimeout(function() {
      try {
        window.parent.postMessage({
          type: 'TOKEN_EXPIRED',
          path: '${requestedPath}',
          timestamp: '${timestamp}'
        }, '*');
      } catch (e) {
        console.warn('无法向父页面发送消息:', e);
      }
    }, 1000);
  </script>
</body>
</html>
  `;
}

export const config = {
  path: "/api/pandacoder-proxy"
};

