/**
 * 生成 PandaCoder 代理相关文件（用于 GitHub Pages）
 * 
 * 由于 GitHub Pages 不支持服务器端函数，我们需要：
 * 1. 创建 Service Worker 来拦截请求
 * 2. 创建代理配置页面
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 从环境变量获取配置
const FRONTEND_URL = process.env.PANDACODER_FRONTEND_URL || 'http://81.69.17.52';
const BACKEND_URL = process.env.PANDACODER_BACKEND_URL || 'http://81.69.17.52:8080';

// 生成 Service Worker
const serviceWorkerJs = `// PandaCoder 代理 Service Worker
// 用于在 GitHub Pages 中代理请求

const FRONTEND_URL = '${FRONTEND_URL}';
const BACKEND_URL = '${BACKEND_URL}';

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('🐼 PandaCoder Service Worker 已安装');
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('🐼 PandaCoder Service Worker 已激活');
  event.waitUntil(self.clients.claim());
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 只处理 /api/pandacoder-proxy 请求
  if (url.pathname.startsWith('/api/pandacoder-proxy')) {
    event.respondWith(handleProxyRequest(event.request));
  }
});

/**
 * 处理代理请求
 */
async function handleProxyRequest(request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';
    const type = url.searchParams.get('type') || 'frontend';
    
    // 确定目标 URL
    const targetUrl = type === 'api' 
      ? BACKEND_URL + path 
      : FRONTEND_URL + path;
    
    console.log('🔄 [Service Worker] 代理请求:', { type, path, targetUrl });
    
    // 构建代理请求
    const proxyHeaders = new Headers();
    
    // 复制必要的请求头
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (!['host', 'connection', 'x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-host'].includes(lowerKey)) {
        proxyHeaders.set(key, value);
      }
    }
    
    // 发起代理请求
    const proxyOptions = {
      method: request.method,
      headers: proxyHeaders,
      mode: 'cors',
      credentials: 'omit'
    };
    
    // 如果有请求体，添加到代理请求中
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const body = await request.arrayBuffer();
      if (body.byteLength > 0) {
        proxyOptions.body = body;
      }
    }
    
    const response = await fetch(targetUrl, proxyOptions);
    
    console.log('✅ [Service Worker] 响应状态:', response.status);
    
    // 获取 Content-Type
    const contentType = response.headers.get('content-type') || '';
    
    // 根据文件扩展名推断 Content-Type
    let finalContentType = contentType;
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
      finalContentType = 'text/html; charset=utf-8';
    }
    
    let responseBody;
    
    // API 请求直接返回
    if (type === 'api') {
      if (finalContentType.includes('application/json') || finalContentType.includes('text/')) {
        responseBody = await response.text();
      } else {
        responseBody = await response.arrayBuffer();
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
      'Content-Type': finalContentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': '*',
      'X-Frame-Options': 'ALLOWALL'
    };
    
    // 复制其他响应头
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (!['x-frame-options', 'content-security-policy', 'content-type',
            'access-control-allow-origin', 'access-control-allow-methods',
            'access-control-allow-headers'].includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    }
    
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('❌ [Service Worker] 代理错误:', error);
    
    return new Response(
      JSON.stringify({
        error: '代理服务暂时不可用',
        message: error.message,
        type: 'PROXY_ERROR'
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

/**
 * 重写 HTML 内容
 */
function rewriteHtml(html) {
  const normalizePath = (path) => {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  };
  
  // 重写 script src
  html = html.replace(
    /<script([^>]*)\\s+src=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
        return match;
      }
      const normalizedSrc = normalizePath(src);
      const newSrc = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(normalizedSrc);
      return '<script' + attrs + ' src="' + newSrc + '"';
    }
  );
  
  // 重写 link href (CSS)
  html = html.replace(
    /<link([^>]*)\\s+href=["']([^"']+)["']/gi,
    (match, attrs, href) => {
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return match;
      }
      const normalizedHref = normalizePath(href);
      const newHref = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(normalizedHref);
      return '<link' + attrs + ' href="' + newHref + '"';
    }
  );
  
  // 重写 img src
  html = html.replace(
    /<img([^>]*)\\s+src=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      if (src.startsWith('http://') || src.startsWith('https://') ||
          src.startsWith('//') || src.startsWith('data:')) {
        return match;
      }
      const normalizedSrc = normalizePath(src);
      const newSrc = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(normalizedSrc);
      return '<img' + attrs + ' src="' + newSrc + '"';
    }
  );
  
  // 注入配置脚本，让前端通过代理访问后端 API
  const interceptorScript = \`
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
\`;
  
  // 在 <head> 之后立即插入拦截器（确保最先执行）
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + interceptorScript);
  } else if (html.includes('<head ')) {
    html = html.replace(/<head([^>]*)>/, '<head$1>' + interceptorScript);
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', interceptorScript + '</head>');
  } else if (html.includes('<body')) {
    html = html.replace('<body', interceptorScript + '<body');
  } else {
    html = interceptorScript + html;
  }
  
  return html;
}

/**
 * 重写 CSS 内容
 * 重写 url() 引用
 */
function rewriteCss(css) {
  const normalizePath = (path) => {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return path;
  };
  
  // 重写 url()
  css = css.replace(
    /url\\(["']?([^"')]+)["']?\\)/gi,
    (match, url) => {
      if (url.startsWith('http://') || url.startsWith('https://') ||
          url.startsWith('//') || url.startsWith('data:')) {
        return match;
      }
      const normalizedUrl = normalizePath(url);
      const newUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(normalizedUrl);
      return \`url("\${newUrl}")\`;
    }
  );
  
  return css;
}
`;

// 生成 Service Worker 注册脚本
const swRegisterJs = `// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pandacoder-proxy-sw.js')
      .then(registration => {
        console.log('🐼 PandaCoder Service Worker 注册成功:', registration.scope);
      })
      .catch(error => {
        console.error('❌ PandaCoder Service Worker 注册失败:', error);
      });
  });
}
`;

// 确保目录存在
const distDir = join(rootDir, 'docs', '.vitepress', 'dist');
mkdirSync(distDir, { recursive: true });

// 写入 Service Worker
const swPath = join(distDir, 'pandacoder-proxy-sw.js');
writeFileSync(swPath, serviceWorkerJs, 'utf-8');

// 写入 Service Worker 注册脚本
const swRegisterPath = join(distDir, 'pandacoder-proxy-sw-register.js');
writeFileSync(swRegisterPath, swRegisterJs, 'utf-8');

console.log('✅ 已生成 PandaCoder Service Worker:', swPath);
console.log('✅ 已生成 Service Worker 注册脚本:', swRegisterPath);
console.log('📍 前端地址:', FRONTEND_URL);
console.log('📍 后端地址:', BACKEND_URL);

