import nodemailer from 'nodemailer';

// 简单的防刷机制：记录IP和提交时间
const submissionCache = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分钟
const MAX_SUBMISSIONS = 3; // 每分钟最多3次

// 获取客户端IP
function getClientIP(headers) {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || headers.get('x-real-ip') 
    || 'unknown';
  return ip;
}

// 检查是否超过频率限制
function checkRateLimit(ip) {
  const now = Date.now();
  const submissions = submissionCache.get(ip) || [];
  
  // 清理过期的提交记录
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissionCache.set(ip, recentSubmissions);
  return true;
}

// 验证邮箱格式
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 清理和验证输入
function sanitizeInput(input, maxLength = 1000) {
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
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      FEEDBACK_RECEIVER
    } = process.env;

    // 检查必需的环境变量
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FEEDBACK_RECEIVER) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ 
          error: '邮件服务配置错误，请联系管理员',
          details: 'Missing SMTP configuration'
        }), 
        { status: 500, headers }
      );
    }

    // 获取客户端IP并检查频率限制
    const clientIP = getClientIP(req.headers);
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ 
          error: '提交过于频繁，请稍后再试',
          retryAfter: 60
        }), 
        { status: 429, headers }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { name, email, contact, content, articleUrl, articleTitle } = body;

    // 验证必填字段
    if (!content || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: '反馈内容不能为空' }), 
        { status: 400, headers }
      );
    }

    // 清理和验证输入
    const cleanName = sanitizeInput(name, 100) || '匿名用户';
    const cleanEmail = sanitizeInput(email, 100);
    const cleanContact = sanitizeInput(contact, 100);
    const cleanContent = sanitizeInput(content, 5000);
    const cleanArticleUrl = sanitizeInput(articleUrl, 500);
    const cleanArticleTitle = sanitizeInput(articleTitle, 200);

    // 验证邮箱格式（如果提供）
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: '邮箱格式不正确' }), 
        { status: 400, headers }
      );
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '465'),
      secure: true, // 使用SSL
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 构建邮件内容
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #3eaf7c, #42d392); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .field { margin-bottom: 20px; }
    .field-label { font-weight: 600; color: #3eaf7c; margin-bottom: 5px; }
    .field-value { background: #f5f5f5; padding: 10px; border-radius: 4px; word-wrap: break-word; }
    .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
    .article-link { color: #3eaf7c; text-decoration: none; }
    .article-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 新的用户反馈</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">👤 用户姓名：</div>
        <div class="field-value">${cleanName}</div>
      </div>
      
      ${cleanEmail ? `
      <div class="field">
        <div class="field-label">📧 邮箱地址：</div>
        <div class="field-value">${cleanEmail}</div>
      </div>
      ` : ''}
      
      ${cleanContact ? `
      <div class="field">
        <div class="field-label">📱 联系方式：</div>
        <div class="field-value">${cleanContact}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">💬 反馈内容：</div>
        <div class="field-value">${cleanContent.replace(/\n/g, '<br>')}</div>
      </div>
      
      ${cleanArticleTitle ? `
      <div class="field">
        <div class="field-label">📄 文章标题：</div>
        <div class="field-value">${cleanArticleTitle}</div>
      </div>
      ` : ''}
      
      ${cleanArticleUrl ? `
      <div class="field">
        <div class="field-label">🔗 文章链接：</div>
        <div class="field-value">
          <a href="${cleanArticleUrl}" class="article-link" target="_blank">${cleanArticleUrl}</a>
        </div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">🕒 提交时间：</div>
        <div class="field-value">${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
      </div>
      
      <div class="field">
        <div class="field-label">🌐 IP地址：</div>
        <div class="field-value">${clientIP}</div>
      </div>
    </div>
    <div class="footer">
      <p>此邮件由舒一笑博客反馈系统自动发送</p>
    </div>
  </div>
</body>
</html>
    `;

    // 发送邮件
    const info = await transporter.sendMail({
      from: `"博客反馈系统" <${SMTP_USER}>`,
      to: FEEDBACK_RECEIVER,
      subject: `📬 新反馈${cleanArticleTitle ? `：${cleanArticleTitle}` : ''} - ${cleanName}`,
      html: emailContent,
      // 纯文本备用
      text: `
用户反馈

姓名：${cleanName}
邮箱：${cleanEmail || '未提供'}
联系方式：${cleanContact || '未提供'}
反馈内容：${cleanContent}
文章标题：${cleanArticleTitle || '未提供'}
文章链接：${cleanArticleUrl || '未提供'}
提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
IP地址：${clientIP}
      `.trim()
    });

    console.log('Feedback email sent:', info.messageId);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: '反馈已发送成功，感谢您的反馈！'
      }), 
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Feedback function error:', error);
    
    // 根据错误类型返回不同的消息
    let errorMessage = '发送失败，请稍后重试';
    
    if (error.message.includes('auth')) {
      errorMessage = 'SMTP认证失败，请联系管理员';
    } else if (error.message.includes('timeout')) {
      errorMessage = '发送超时，请检查网络连接';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = '邮箱配置错误';
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
  path: "/api/feedback"
};

