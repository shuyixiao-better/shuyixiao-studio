/**
 * PandaCoder 周报服务代理
 * 
 * 功能：
 * 1. 代理前端页面请求，隐藏真实服务地址
 * 2. 代理后端 API 请求，隐藏真实 IP 和端口
 * 3. 支持环境变量动态配置
 * 4. 防止 F12 查看真实地址
 */

// 获取环境变量配置
const PANDACODER_FRONTEND_URL = process.env.PANDACODER_FRONTEND_URL;
const PANDACODER_BACKEND_URL = process.env.PANDACODER_BACKEND_URL;

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    // 移除 X-Frame-Options 限制，允许 iframe 嵌入
    'X-Frame-Options': 'ALLOWALL',
    // 设置 CSP 允许 iframe 嵌入
    'Content-Security-Policy': "frame-ancestors 'self' https://*.poeticcoder.com https://*.netlify.app",
  };

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // 检查环境变量是否配置
    if (!PANDACODER_FRONTEND_URL || !PANDACODER_BACKEND_URL) {
      console.error('❌ PandaCoder 服务未配置');
      return new Response(
        JSON.stringify({ 
          error: 'PandaCoder 服务未配置，请联系管理员',
          code: 'SERVICE_NOT_CONFIGURED'
        }), 
        { status: 503, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const type = url.searchParams.get('type') || 'frontend'; // frontend 或 api

    let targetUrl;
    
    if (type === 'frontend') {
      // 代理前端页面
      targetUrl = `${PANDACODER_FRONTEND_URL}${path}`;
    } else if (type === 'api') {
      // 代理后端 API
      targetUrl = `${PANDACODER_BACKEND_URL}${path}`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid proxy type' }), 
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔄 Proxying ${type} request to: ${targetUrl.replace(/\/\/[^@]+@/, '//***@')}`);

    // 构建代理请求头
    const proxyHeaders = new Headers();

    // 复制原始请求头（排除某些不应该转发的头）
    const headersToSkip = [
      'host',
      'connection',
      'x-forwarded-for',
      'x-forwarded-proto',
      'x-forwarded-host',
      'origin',  // 不转发原始 origin
      'referer'  // 不转发原始 referer
    ];

    for (const [key, value] of req.headers.entries()) {
      if (!headersToSkip.includes(key.toLowerCase())) {
        proxyHeaders.set(key, value);
      }
    }

    // 设置正确的 Origin 和 Referer（模拟从你的服务器直接访问）
    const backendOrigin = type === 'api'
      ? (PANDACODER_BACKEND_URL || 'http://81.69.17.52:8080')
      : (PANDACODER_FRONTEND_URL || 'http://81.69.17.52');

    proxyHeaders.set('Origin', backendOrigin);
    proxyHeaders.set('Referer', backendOrigin + '/');

    // 确保 Content-Type 正确传递
    if (req.headers.get('content-type')) {
      proxyHeaders.set('Content-Type', req.headers.get('content-type'));
    }

    // 发起代理请求
    const proxyRequest = {
      method: req.method,
      headers: proxyHeaders,
    };

    // 如果有请求体，添加到代理请求中
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.arrayBuffer();
      if (body.byteLength > 0) {
        proxyRequest.body = body;
      }
    }

    console.log(`📤 代理请求: ${req.method} ${targetUrl}`);
    console.log(`📋 请求头:`, Object.fromEntries(proxyHeaders.entries()));

    const response = await fetch(targetUrl, proxyRequest);

    console.log(`📥 代理响应: ${response.status} ${response.statusText}`);

    // 获取响应内容
    const contentType = response.headers.get('content-type') || '';
    let responseBody;
    let finalContentType = contentType;

    // 根据 URL 路径判断文件类型（如果 Content-Type 不准确）
    if (!contentType || contentType === 'application/octet-stream') {
      if (path.endsWith('.css')) {
        finalContentType = 'text/css';
      } else if (path.endsWith('.js')) {
        finalContentType = 'application/javascript';
      } else if (path.endsWith('.json')) {
        finalContentType = 'application/json';
      } else if (path.endsWith('.html')) {
        finalContentType = 'text/html';
      }
    }

    if (finalContentType.includes('application/json')) {
      responseBody = await response.json();
      responseBody = JSON.stringify(responseBody);
    } else if (finalContentType.includes('text/') || finalContentType.includes('javascript')) {
      responseBody = await response.text();

      // 如果是 HTML，需要重写内部链接
      if (finalContentType.includes('text/html')) {
        responseBody = rewriteHtmlLinks(responseBody, type);
      }
      // JavaScript 文件不需要重写（拦截器会处理）
    } else {
      responseBody = await response.arrayBuffer();
    }

    // 构建响应头
    const responseHeaders = {
      ...headers,
      'Content-Type': finalContentType,
    };

    // 复制其他必要的响应头
    const headersToKeep = ['cache-control', 'etag', 'last-modified'];
    headersToKeep.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders[header] = value;
      }
    });

    // 移除可能阻止 iframe 嵌入的响应头
    delete responseHeaders['x-frame-options'];
    delete responseHeaders['content-security-policy'];

    // 添加允许 iframe 嵌入的头部
    responseHeaders['X-Frame-Options'] = 'ALLOWALL';

    console.log(`✅ 返回响应: ${response.status}, Content-Type: ${finalContentType}`);

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('❌ Proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'PandaCoder 服务暂时不可用',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * 重写 HTML 中的链接，将直接链接改为通过代理访问
 */
function rewriteHtmlLinks(html, type) {
  // 重写 script src（包括相对路径和绝对路径）
  html = html.replace(
    /src="(\/[^"]+)"/g,
    (match, path) => `src="/api/pandacoder-proxy?type=${type}&path=${path}"`
  );

  // 重写 link href (CSS 和其他资源)
  html = html.replace(
    /href="(\/[^"]+)"/g,
    (match, path) => {
      // 跳过外部链接
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return match;
      }
      return `href="/api/pandacoder-proxy?type=${type}&path=${path}"`;
    }
  );

  // 在 <head> 中注入 API 拦截器脚本（必须在所有其他脚本之前执行）
  const interceptorScript = `
<script>
(function() {
  console.log('🔧 PandaCoder API 拦截器已加载');

  // 1. 拦截 fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + url;
      console.log('🔄 拦截 fetch:', url, '→', proxyUrl);
      return originalFetch(proxyUrl, options);
    }
    return originalFetch(url, options);
  };

  // 2. 拦截 XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + url;
      console.log('🔄 拦截 XHR:', url, '→', proxyUrl);
      return originalOpen.call(this, method, proxyUrl, ...args);
    }
    return originalOpen.call(this, method, url, ...args);
  };

  // 3. 拦截 axios（通过劫持 axios.create 和默认实例）
  let axiosInterceptorAdded = false;

  const addAxiosInterceptor = (axiosInstance) => {
    if (!axiosInstance || axiosInterceptorAdded) return;

    console.log('🔧 为 axios 实例添加拦截器');
    axiosInstance.interceptors.request.use(config => {
      if (config.url && config.url.startsWith('/api/')) {
        const originalUrl = config.url;
        config.url = '/api/pandacoder-proxy?type=api&path=' + config.url;
        console.log('🔄 拦截 axios:', originalUrl, '→', config.url);
      }
      return config;
    }, error => Promise.reject(error));

    axiosInterceptorAdded = true;
  };

  // 监听 axios 的加载
  Object.defineProperty(window, 'axios', {
    configurable: true,
    enumerable: true,
    get() {
      return this._axios;
    },
    set(value) {
      this._axios = value;
      if (value) {
        addAxiosInterceptor(value);
      }
    }
  });

  // 如果 axios 已经存在
  if (window.axios) {
    addAxiosInterceptor(window.axios);
  }

  console.log('✅ API 拦截器初始化完成');
})();
</script>
`;

  // 在 </head> 之前插入拦截器
  html = html.replace(/<\/head>/i, interceptorScript + '</head>');

  return html;
}

/**
 * 重写 JavaScript 中的 API 调用
 */
function rewriteJavaScript(js) {
  // 重写 fetch 调用
  js = js.replace(
    /fetch\s*\(\s*["'`](\/api\/[^"'`]+)["'`]/g,
    (match, path) => `fetch("/api/pandacoder-proxy?type=api&path=${path}"`
  );

  // 重写 axios 调用
  js = js.replace(
    /axios\.(get|post|put|delete|patch)\s*\(\s*["'`](\/api\/[^"'`]+)["'`]/g,
    (match, method, path) => `axios.${method}("/api/pandacoder-proxy?type=api&path=${path}"`
  );

  // 重写 baseURL 配置
  js = js.replace(
    /baseURL\s*:\s*["'`](\/api[^"'`]*)["'`]/g,
    'baseURL:"/api/pandacoder-proxy?type=api&path=/api"'
  );

  return js;
}

export const config = {
  path: "/api/pandacoder-proxy"
};

