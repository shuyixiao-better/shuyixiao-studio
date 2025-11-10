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

    // 构建代理请求
    const proxyHeaders = new Headers();
    
    // 复制原始请求头（排除 host）
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() !== 'host') {
        proxyHeaders.set(key, value);
      }
    }

    // 发起代理请求
    const proxyRequest = {
      method: req.method,
      headers: proxyHeaders,
    };

    // 如果有请求体，添加到代理请求中
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      proxyRequest.body = await req.text();
    }

    const response = await fetch(targetUrl, proxyRequest);

    // 获取响应内容
    const contentType = response.headers.get('content-type') || '';
    let responseBody;

    if (contentType.includes('application/json')) {
      responseBody = await response.json();
      responseBody = JSON.stringify(responseBody);
    } else if (contentType.includes('text/')) {
      responseBody = await response.text();
      
      // 如果是 HTML，需要重写内部链接
      if (contentType.includes('text/html')) {
        responseBody = rewriteHtmlLinks(responseBody, type);
      }
    } else {
      responseBody = await response.arrayBuffer();
    }

    // 构建响应头
    const responseHeaders = {
      ...headers,
      'Content-Type': contentType,
    };

    // 复制其他必要的响应头
    const headersToKeep = ['cache-control', 'etag', 'last-modified'];
    headersToKeep.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders[header] = value;
      }
    });

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
  // 重写 script src
  html = html.replace(
    /src="(\/[^"]+)"/g, 
    `src="/api/pandacoder-proxy?type=${type}&path=$1"`
  );
  
  // 重写 link href (CSS)
  html = html.replace(
    /href="(\/[^"]+\.css[^"]*)"/g, 
    `href="/api/pandacoder-proxy?type=${type}&path=$1"`
  );
  
  // 重写 API 调用（假设前端使用 /api/ 前缀）
  html = html.replace(
    /fetch\(['"]\/api\//g,
    `fetch('/api/pandacoder-proxy?type=api&path=/api/`
  );
  
  return html;
}

export const config = {
  path: "/api/pandacoder-proxy"
};

