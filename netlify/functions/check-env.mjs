export default async (req, context) => {
  const frontendConfigured = !!process.env.PANDACODER_FRONTEND_URL;
  const backendConfigured = !!process.env.PANDACODER_BACKEND_URL;
  
  return new Response(JSON.stringify({
    frontendConfigured,
    backendConfigured,
    message: frontendConfigured && backendConfigured 
      ? '✅ 环境变量已配置' 
      : '❌ 环境变量未配置'
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

export const config = {
  path: "/api/check-env"
};

