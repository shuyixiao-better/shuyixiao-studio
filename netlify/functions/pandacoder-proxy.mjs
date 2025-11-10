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
    if (type === 'frontend') {
      targetUrl = `${PANDACODER_FRONTEND_URL}${path}`;
    } else if (type === 'api') {
      targetUrl = `${PANDACODER_BACKEND_URL}${path}`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type parameter. Use "frontend" or "api".' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`🔄 [${type}] ${req.method} ${targetUrl}`);

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

    console.log(`✅ [${type}] ${response.status} ${response.statusText}`);

    // 获取 Content-Type
    const contentType = response.headers.get('content-type') || '';

    // 根据文件扩展名推断 Content-Type
    let finalContentType = contentType;
    if (!contentType || contentType === 'application/octet-stream') {
      if (path.endsWith('.css')) {
        finalContentType = 'text/css; charset=utf-8';
      } else if (path.endsWith('.js')) {
        finalContentType = 'application/javascript; charset=utf-8';
      } else if (path.endsWith('.json')) {
        finalContentType = 'application/json; charset=utf-8';
      } else if (path.endsWith('.html') || path === '/') {
        finalContentType = 'text/html; charset=utf-8';
      }
    }

    let responseBody;

    // 处理文本内容（HTML/CSS/JS）需要重写
    if (finalContentType.includes('text/html') || finalContentType.includes('text/css') ||
        finalContentType.includes('javascript') || finalContentType.includes('application/json')) {

      const text = await response.text();

      // HTML 需要重写链接并注入拦截器
      if (finalContentType.includes('text/html')) {
        responseBody = rewriteHtml(text, type);
      }
      // CSS 需要重写 url()
      else if (finalContentType.includes('text/css')) {
        responseBody = rewriteCss(text, type);
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
 * 2. 注入 API 拦截器脚本
 */
function rewriteHtml(html, type) {
  // 重写 script src
  html = html.replace(
    /<script([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      // 跳过外部链接
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
        return match;
      }
      const newSrc = `/api/pandacoder-proxy?type=${type}&path=${src}`;
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
      const newHref = `/api/pandacoder-proxy?type=${type}&path=${href}`;
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
      const newSrc = `/api/pandacoder-proxy?type=${type}&path=${src}`;
      return `<img${attrs} src="${newSrc}"`;
    }
  );

  // 注入 API 拦截器脚本（在 </head> 之前）
  const interceptorScript = `
<script>
(function() {
  console.log('🐼 PandaCoder API 拦截器已加载');

  // 拦截 fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + url;
      console.log('🔄 拦截 fetch:', url, '→', proxyUrl);
      return originalFetch(proxyUrl, options);
    }
    return originalFetch(url, options);
  };

  // 拦截 XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const proxyUrl = '/api/pandacoder-proxy?type=api&path=' + url;
      console.log('🔄 拦截 XHR:', url, '→', proxyUrl);
      return originalOpen.call(this, method, proxyUrl, ...args);
    }
    return originalOpen.call(this, method, url, ...args);
  };

  // 拦截 axios
  const checkAxios = () => {
    if (window.axios && !window.__axiosIntercepted) {
      console.log('🔧 为 axios 添加拦截器');
      window.axios.interceptors.request.use(config => {
        if (config.url && config.url.startsWith('/api/')) {
          const originalUrl = config.url;
          config.url = '/api/pandacoder-proxy?type=api&path=' + config.url;
          console.log('🔄 拦截 axios:', originalUrl, '→', config.url);
        }
        return config;
      });
      window.__axiosIntercepted = true;
    }
  };

  // 立即检查
  checkAxios();

  // 延迟检查（防止 axios 晚加载）
  setTimeout(checkAxios, 100);
  setTimeout(checkAxios, 500);
  setTimeout(checkAxios, 1000);

  console.log('✅ API 拦截器初始化完成');
})();
</script>
`;

  // 在 </head> 之前插入拦截器
  if (html.includes('</head>')) {
    html = html.replace('</head>', interceptorScript + '</head>');
  } else if (html.includes('<body')) {
    // 如果没有 </head>，在 <body> 之前插入
    html = html.replace('<body', interceptorScript + '<body');
  }

  return html;
}

/**
 * 重写 CSS 内容
 * 重写 url() 引用
 */
function rewriteCss(css, type) {
  // 重写 url()
  css = css.replace(
    /url\(["']?([^"')]+)["']?\)/gi,
    (match, url) => {
      // 跳过外部链接和 data URI
      if (url.startsWith('http://') || url.startsWith('https://') ||
          url.startsWith('//') || url.startsWith('data:')) {
        return match;
      }
      const newUrl = `/api/pandacoder-proxy?type=${type}&path=${url}`;
      return `url("${newUrl}")`;
    }
  );

  return css;
}

export const config = {
  path: "/api/pandacoder-proxy"
};

