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

    console.log('📥 收到请求:', { 
      url: req.url, 
      path, 
      type,
      FRONTEND_URL: PANDACODER_FRONTEND_URL,
      BACKEND_URL: PANDACODER_BACKEND_URL
    });

    // 确定目标 URL
    let targetUrl;
    if (type === 'api') {
      // 代理后端 API 请求
      targetUrl = `${PANDACODER_BACKEND_URL}${path}`;
      console.log(`🔄 [API] ${req.method} ${path} → ${targetUrl}`);
    } else {
      // 代理前端页面请求
      targetUrl = `${PANDACODER_FRONTEND_URL}${path}`;
      console.log(`🔄 [Frontend] ${req.method} ${path} → ${targetUrl}`);
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
    } else if (path.endsWith('.html') || path === '/' || path === '/login' || !path.includes('.')) {
      // 对于没有扩展名的路径（如 /login），默认为 HTML
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

    // API 请求直接返回，不做任何处理
    if (type === 'api') {
      // 对于 JSON 响应，返回文本
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
  
  // 重写 a href - 确保内部链接（如登录页）也通过代理
  html = html.replace(
    /<a([^>]*)\shref=["']([^"']+)["']/gi,
    (match, attrs, href) => {
      // 跳过外部链接、锚点、javascript 和 mailto
      if (href.startsWith('http://') || href.startsWith('https://') || 
          href.startsWith('//') || href.startsWith('#') || 
          href.startsWith('javascript:') || href.startsWith('mailto:')) {
        return match;
      }
      // 对于内部链接（如 /login），通过代理
      const normalizedHref = normalizePath(href);
      const newHref = `/api/pandacoder-proxy?type=frontend&path=${encodeURIComponent(normalizedHref)}`;
      return `<a${attrs} href="${newHref}"`;
    }
  );

  // 注入配置脚本，让前端通过代理访问后端 API
  const interceptorScript = `
<script>
(function() {
  console.log('🐼 PandaCoder 代理拦截器已加载');
  
  const realOrigin = window.location.origin;
  const fakeOrigin = '${PANDACODER_FRONTEND_URL}';
  
  console.log('🔧 真实 origin:', realOrigin);
  console.log('🔧 伪装 origin:', fakeOrigin);
  
  // 辅助函数：提取路径并构造代理 URL
  function getProxyUrl(url, type = 'frontend') {
    let path = url;
    
    // 如果是完整 URL，提取路径部分
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const urlObj = new URL(url);
        path = urlObj.pathname + urlObj.search + urlObj.hash;
      } catch (e) {
        console.warn('⚠️ 无法解析 URL:', url);
      }
    }
    
    return '/api/pandacoder-proxy?type=' + type + '&path=' + encodeURIComponent(path);
  }
  
  // 拦截 window.location 的各种方法
  const originalLocation = window.location;
  const locationMethods = {
    assign: originalLocation.assign.bind(originalLocation),
    replace: originalLocation.replace.bind(originalLocation),
    reload: originalLocation.reload.bind(originalLocation)
  };
  
  window.location.assign = function(url) {
    console.log('🔄 拦截 location.assign:', url);
    if (typeof url === 'string' && url.includes('/login')) {
      const proxyUrl = getProxyUrl(url);
      console.log('  → 重定向到:', proxyUrl);
      return locationMethods.assign(proxyUrl);
    }
    return locationMethods.assign(url);
  };
  
  window.location.replace = function(url) {
    console.log('🔄 拦截 location.replace:', url);
    if (typeof url === 'string' && url.includes('/login')) {
      const proxyUrl = getProxyUrl(url);
      console.log('  → 重定向到:', proxyUrl);
      return locationMethods.replace(proxyUrl);
    }
    return locationMethods.replace(url);
  };
  
  // 拦截页面导航 - 防止登录页跳转到错误的域名
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(state, title, url) {
    if (url && url.includes('/login')) {
      console.log('🔄 拦截 pushState 登录页跳转:', url);
      const proxyUrl = getProxyUrl(url);
      console.log('  → 重定向到:', proxyUrl);
      return originalPushState.call(this, state, title, proxyUrl);
    }
    return originalPushState.call(this, state, title, url);
  };
  
  history.replaceState = function(state, title, url) {
    if (url && url.includes('/login')) {
      console.log('🔄 拦截 replaceState 登录页跳转:', url);
      const proxyUrl = getProxyUrl(url);
      console.log('  → 重定向到:', proxyUrl);
      return originalReplaceState.call(this, state, title, proxyUrl);
    }
    return originalReplaceState.call(this, state, title, url);
  };

  // 拦截 fetch - 将 /api/ 和 /login 请求重定向到代理
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      if (url.startsWith('/api/') || (url.startsWith('http') && url.includes('/api/'))) {
        const proxyUrl = getProxyUrl(url, 'api');
        console.log('🔄 重定向 fetch API:', url, '→', proxyUrl);
        return originalFetch(proxyUrl, options);
      } else if (url.includes('/login')) {
        const proxyUrl = getProxyUrl(url, 'frontend');
        console.log('🔄 重定向 fetch 登录页:', url, '→', proxyUrl);
        return originalFetch(proxyUrl, options);
      }
    }
    return originalFetch(url, options);
  };

  // 拦截 XMLHttpRequest - 将 /api/ 和 /login 请求重定向到代理
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;

    xhr.open = function(method, url, ...args) {
      if (typeof url === 'string') {
        if (url.startsWith('/api/') || (url.startsWith('http') && url.includes('/api/'))) {
          const proxyUrl = getProxyUrl(url, 'api');
          console.log('🔄 重定向 XHR API:', url, '→', proxyUrl);
          return originalOpen.call(this, method, proxyUrl, ...args);
        } else if (url.includes('/login')) {
          const proxyUrl = getProxyUrl(url, 'frontend');
          console.log('🔄 重定向 XHR 登录页:', url, '→', proxyUrl);
          return originalOpen.call(this, method, proxyUrl, ...args);
        }
      }
      return originalOpen.call(this, method, url, ...args);
    };

    return xhr;
  };

  // 拦截 axios - 将 /api/ 和 /login 请求重定向到代理
  let axiosIntercepted = false;

  const interceptAxios = (axiosInstance) => {
    if (!axiosInstance || axiosIntercepted) return;

    try {
      axiosInstance.interceptors.request.use(config => {
        if (config.url) {
          if (config.url.startsWith('/api/') || (config.url.startsWith('http') && config.url.includes('/api/'))) {
            const originalUrl = config.url;
            config.url = getProxyUrl(config.url, 'api');
            console.log('🔄 重定向 axios API:', originalUrl, '→', config.url);
          } else if (config.url.includes('/login')) {
            const originalUrl = config.url;
            config.url = getProxyUrl(config.url, 'frontend');
            console.log('🔄 重定向 axios 登录页:', originalUrl, '→', config.url);
          }
        }
        return config;
      }, error => Promise.reject(error));
      
      // 拦截响应，处理登录跳转
      axiosInstance.interceptors.response.use(
        response => response,
        error => {
          if (error.response && error.response.status === 401) {
            console.log('🔐 检测到 401 未授权，准备跳转登录页');
            // 不要直接跳转，让应用自己处理
          }
          return Promise.reject(error);
        }
      );
      
      axiosIntercepted = true;
      console.log('✅ axios 拦截器配置成功');
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
  
  console.log('✅ PandaCoder 代理拦截器配置完成');
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

  // 添加一个最高优先级的拦截器 - 在所有代码执行之前
  const earlyInterceptor = `
<script>
// 最早期拦截 - 在任何代码执行之前
(function() {
  console.log('🔧 [早期拦截器] 开始初始化...');
  
  // 保存原始的 location 对象和方法
  const originalLocation = window.location;
  const originalAssign = originalLocation.assign.bind(originalLocation);
  const originalReplace = originalLocation.replace.bind(originalLocation);
  
  // 辅助函数：处理 URL 并返回代理 URL
  function processUrl(url, method) {
    if (typeof url !== 'string') return url;
    
    // 检查是否包含 /login
    if (!url.includes('/login')) return url;
    
    console.log('🔄 [早期拦截] ' + method + ':', url);
    
    // 提取路径
    let path = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const urlObj = new URL(url);
        path = urlObj.pathname + urlObj.search + urlObj.hash;
      } catch (e) {
        console.warn('⚠️ 无法解析 URL:', url);
      }
    }
    
    const proxyUrl = '/api/pandacoder-proxy?type=frontend&path=' + encodeURIComponent(path);
    console.log('  → 重定向到:', proxyUrl);
    return proxyUrl;
  }
  
  // 重写 location.assign
  try {
    Object.defineProperty(window.location, 'assign', {
      value: function(url) {
        const processedUrl = processUrl(url, 'location.assign');
        return originalAssign(processedUrl);
      },
      writable: true,
      configurable: true
    });
    console.log('✅ location.assign 已拦截');
  } catch (e) {
    console.warn('⚠️ 无法重写 location.assign:', e.message);
    // 备选方案：直接替换
    window.location.assign = function(url) {
      const processedUrl = processUrl(url, 'location.assign');
      return originalAssign(processedUrl);
    };
  }
  
  // 重写 location.replace
  try {
    Object.defineProperty(window.location, 'replace', {
      value: function(url) {
        const processedUrl = processUrl(url, 'location.replace');
        return originalReplace(processedUrl);
      },
      writable: true,
      configurable: true
    });
    console.log('✅ location.replace 已拦截');
  } catch (e) {
    console.warn('⚠️ 无法重写 location.replace:', e.message);
    // 备选方案：直接替换
    window.location.replace = function(url) {
      const processedUrl = processUrl(url, 'location.replace');
      return originalReplace(processedUrl);
    };
  }
  
  console.log('✅ [早期拦截器] 初始化完成');
})();
</script>
`;

  // 在 <head> 之后立即插入拦截器和隐藏遮罩元素的样式（确保最先执行）
  const combinedScript = earlyInterceptor + interceptorScript + curtainRemovalStyle;
  
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

export const config = {
  path: "/api/pandacoder-proxy"
};

