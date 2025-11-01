// 消费决策AI助手 - Netlify Function
// 对接魔力方舟（Gitee AI）API

// 简单的防刷机制
const requestCache = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分钟
const MAX_REQUESTS = 10; // 每分钟最多10次

// 获取客户端IP
function getClientIP(headers) {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || headers.get('x-real-ip') 
    || 'unknown';
  return ip;
}

// 检查频率限制
function checkRateLimit(ip) {
  const now = Date.now();
  const requests = requestCache.get(ip) || [];
  
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  requestCache.set(ip, recentRequests);
  return true;
}

// 清理和验证输入
function sanitizeInput(input, maxLength = 5000) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export default async (req, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers }
    );
  }

  try {
    // 获取环境变量
    const {
      MOFA_API_KEY,           // API Key
      MOFA_BASE_URL,          // API 基础地址（默认：https://ai.gitee.com/v1）
      MOFA_MODEL,             // 模型名称
      MOFA_SYSTEM_PROMPT,      // 系统提示词
      MOFA_TEMPERATURE,       // 温度参数
      MOFA_MAX_TOKENS         // 最大token数
    } = process.env;

    // 检查必需的环境变量
    if (!MOFA_API_KEY) {
      console.error('❌ Missing MOFA_API_KEY');
      return new Response(
        JSON.stringify({ 
          error: 'AI服务配置错误，请联系管理员',
          details: 'Missing API Key'
        }), 
        { status: 500, headers }
      );
    }

    // 获取客户端IP并检查频率限制
    const clientIP = getClientIP(req.headers);
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ 
          error: '请求过于频繁，请稍后再试',
          retryAfter: 60
        }), 
        { status: 429, headers }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { 
      message,           // 用户消息
      conversation,      // 对话历史（可选）
      stream = false    // 是否流式输出
    } = body;

    // 验证必填字段
    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: '消息内容不能为空' }), 
        { status: 400, headers }
      );
    }

    // 清理输入
    const cleanMessage = sanitizeInput(message);
    
    // 构建消息历史
    let messages = [];
    
    // 添加系统提示词（如果有）
    if (MOFA_SYSTEM_PROMPT) {
      messages.push({
        role: 'system',
        content: MOFA_SYSTEM_PROMPT
      });
    }

    // 添加对话历史（如果有）
    if (conversation && Array.isArray(conversation)) {
      messages = messages.concat(conversation.map(msg => ({
        role: msg.role || 'user',
        content: sanitizeInput(msg.content || '')
      })).filter(msg => msg.content.length > 0));
    }

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: cleanMessage
    });

    // 构建API请求参数
    const apiUrl = (MOFA_BASE_URL || 'https://ai.gitee.com/v1') + '/chat/completions';
    const requestBody = {
      model: MOFA_MODEL || 'Qwen3-235B-A22B-Instruct-2507',
      messages: messages,
      stream: stream,
      temperature: MOFA_TEMPERATURE ? parseFloat(MOFA_TEMPERATURE) : 1,
      max_tokens: MOFA_MAX_TOKENS ? parseInt(MOFA_MAX_TOKENS) : 0,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    console.log('📤 Calling AI API:', {
      url: apiUrl.replace(/\/\/[^@]+@/, '//***@'), // 隐藏可能的认证信息
      model: requestBody.model,
      messageCount: messages.length,
      stream: stream
    });

    // 调用魔力方舟API
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOFA_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ AI API error:', apiResponse.status, errorText);
      
      let errorMessage = 'AI服务请求失败';
      if (apiResponse.status === 401) {
        errorMessage = 'API Key认证失败';
      } else if (apiResponse.status === 429) {
        errorMessage = 'API请求频率过高，请稍后重试';
      } else if (apiResponse.status >= 500) {
        errorMessage = 'AI服务暂时不可用，请稍后重试';
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        }), 
        { status: apiResponse.status, headers }
      );
    }

    // 处理响应
    const data = await apiResponse.json();

    // 提取回复内容
    let responseText = '';
    if (data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      if (choice.message && choice.message.content) {
        responseText = choice.message.content;
      } else if (choice.text) {
        responseText = choice.text;
      }
    }

    console.log('✅ AI response received:', {
      id: data.id,
      model: data.model,
      finishReason: data.choices?.[0]?.finish_reason,
      usage: data.usage
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        model: data.model,
        usage: data.usage,
        conversation_id: data.id
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('❌ Chat function error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    let errorMessage = '请求失败，请稍后重试';

    if (error.message.includes('fetch')) {
      errorMessage = '无法连接到AI服务，请检查网络';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'AI服务响应格式错误';
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时，请稍后重试';
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/chat"
};

