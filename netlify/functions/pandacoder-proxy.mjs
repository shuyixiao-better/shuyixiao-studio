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

    // 只代理前端页面，API 请求直接返回错误提示
    if (type === 'api') {
      return new Response(
        JSON.stringify({
          error: 'API 请求不通过代理，请直接访问后端地址',
          backend: PANDACODER_BACKEND_URL
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 确定目标 URL（只处理前端）
    const targetUrl = `${PANDACODER_FRONTEND_URL}${path}`;

    console.log(`🔄 [frontend] ${req.method} ${targetUrl}`);

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

  // 注入配置脚本，让前端直接请求后端 IP
  const backendUrl = PANDACODER_BACKEND_URL;
  const interceptorScript = `
<script>
(function() {
  console.log('🐼 PandaCoder 配置已加载');
  console.log('📍 后端地址: ${backendUrl}');

  // 拦截 fetch - 将 /api/ 请求重定向到后端 IP
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const backendUrl = '${backendUrl}' + url;
      console.log('🔄 重定向 fetch:', url, '→', backendUrl);
      return originalFetch(backendUrl, options);
    }
    return originalFetch(url, options);
  };

  // 拦截 XMLHttpRequest - 将 /api/ 请求重定向到后端 IP
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;

    xhr.open = function(method, url, ...args) {
      if (typeof url === 'string' && url.startsWith('/api/')) {
        const backendUrl = '${backendUrl}' + url;
        console.log('🔄 重定向 XHR:', url, '→', backendUrl);
        return originalOpen.call(this, method, backendUrl, ...args);
      }
      return originalOpen.call(this, method, url, ...args);
    };

    return xhr;
  };

  // 拦截 axios - 将 /api/ 请求重定向到后端 IP
  let axiosIntercepted = false;

  const interceptAxios = (axiosInstance) => {
    if (!axiosInstance || axiosIntercepted) return;

    try {
      console.log('🔧 为 axios 添加拦截器');
      axiosInstance.interceptors.request.use(config => {
        if (config.url && config.url.startsWith('/api/')) {
          const originalUrl = config.url;
          config.url = '${backendUrl}' + config.url;
          console.log('🔄 重定向 axios:', originalUrl, '→', config.url);
        }
        return config;
      }, error => Promise.reject(error));
      axiosIntercepted = true;
    } catch (e) {
      console.warn('⚠️ axios 拦截器添加失败:', e);
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

  console.log('✅ 后端 API 重定向配置完成');
})();
</script>
`;

  // 在 <head> 之后立即插入拦截器（确保最先执行）
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + interceptorScript);
  } else if (html.includes('<head ')) {
    html = html.replace(/<head([^>]*)>/, '<head$1>' + interceptorScript);
  } else if (html.includes('</head>')) {
    // 如果找不到 <head>，在 </head> 之前插入
    html = html.replace('</head>', interceptorScript + '</head>');
  } else if (html.includes('<body')) {
    // 如果没有 head，在 <body> 之前插入
    html = html.replace('<body', interceptorScript + '<body');
  } else {
    // 最后的兜底方案：在 HTML 开头插入
    html = interceptorScript + html;
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

export const config = {
  path: "/api/pandacoder-proxy"
};

