/**
 * PandaCoder 代理测试端点
 * 用于诊断 iframe 加载问题
 */

const PANDACODER_FRONTEND_URL = process.env.PANDACODER_FRONTEND_URL;
const PANDACODER_BACKEND_URL = process.env.PANDACODER_BACKEND_URL;

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      frontendConfigured: !!PANDACODER_FRONTEND_URL,
      backendConfigured: !!PANDACODER_BACKEND_URL,
      frontendUrl: PANDACODER_FRONTEND_URL ? '已配置 (隐藏)' : '未配置',
      backendUrl: PANDACODER_BACKEND_URL ? '已配置 (隐藏)' : '未配置',
    },
    tests: []
  };

  // 测试前端服务连接
  if (PANDACODER_FRONTEND_URL) {
    try {
      const response = await fetch(PANDACODER_FRONTEND_URL, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      diagnostics.tests.push({
        name: '前端服务连接',
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        message: response.ok ? '前端服务可访问' : `HTTP ${response.status}`
      });
    } catch (error) {
      diagnostics.tests.push({
        name: '前端服务连接',
        status: 'error',
        message: error.message
      });
    }
  }

  // 测试后端服务连接
  if (PANDACODER_BACKEND_URL) {
    try {
      const response = await fetch(PANDACODER_BACKEND_URL, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      diagnostics.tests.push({
        name: '后端服务连接',
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        message: response.ok ? '后端服务可访问' : `HTTP ${response.status}`
      });
    } catch (error) {
      diagnostics.tests.push({
        name: '后端服务连接',
        status: 'error',
        message: error.message
      });
    }
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers
  });
};

export const config = {
  path: "/api/pandacoder-test"
};

