import { getStore } from '@netlify/blobs';
import nodemailer from 'nodemailer';
import process from 'node:process';

// 邮件配置
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.163.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// 发送邮件通知
const sendEmailNotification = async (comment, articlePath) => {
  if (!process.env.ADMIN_EMAIL || !process.env.SMTP_USER) {
    console.log('邮件配置未设置，跳过邮件通知');
    return;
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `新评论通知 - ${articlePath}`,
      html: `
        <h2>您的博客收到新评论</h2>
        <p><strong>文章：</strong>${articlePath}</p>
        <p><strong>评论者：</strong>${comment.author}</p>
        <p><strong>评论时间：</strong>${new Date(comment.timestamp).toLocaleString('zh-CN')}</p>
        <p><strong>评论内容：</strong></p>
        <div style="padding: 10px; background: #f5f5f5; border-radius: 4px;">
          ${comment.content}
        </div>
        ${comment.images && comment.images.length > 0 ? `
          <p><strong>图片：</strong></p>
          ${comment.images.map(img => `<img src="${img}" style="max-width: 300px; margin: 5px;" />`).join('')}
        ` : ''}
        <p style="margin-top: 20px;">
          <a href="https://www.poeticcoder.com${articlePath}">查看评论</a>
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('邮件通知发送成功');
  } catch (error) {
    console.error('发送邮件失败:', error);
  }
};

export default async (req, context) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const store = getStore('comments');
  const url = new URL(req.url);
  const articlePath = url.searchParams.get('path');

  try {
    // GET - 获取评论列表
    if (req.method === 'GET') {
      if (!articlePath) {
        return new Response(
          JSON.stringify({ error: '缺少文章路径参数' }),
          { status: 400, headers }
        );
      }

      const commentsData = await store.get(articlePath, { type: 'json' });
      const comments = commentsData || [];

      return new Response(
        JSON.stringify({ comments }),
        { status: 200, headers }
      );
    }

    // POST - 添加评论
    if (req.method === 'POST') {
      const body = await req.json();
      const { author, content, images = [], path } = body;

      if (!author || !content || !path) {
        return new Response(
          JSON.stringify({ error: '缺少必要参数' }),
          { status: 400, headers }
        );
      }

      // 获取现有评论
      const commentsData = await store.get(path, { type: 'json' });
      const comments = commentsData || [];

      // 创建新评论
      const newComment = {
        id: Date.now().toString(),
        author: author.trim(),
        content: content.trim(),
        images: images,
        timestamp: new Date().toISOString(),
      };

      // 添加到评论列表
      comments.push(newComment);

      // 保存评论
      await store.setJSON(path, comments);

      // 发送邮件通知
      await sendEmailNotification(newComment, path);

      return new Response(
        JSON.stringify({ success: true, comment: newComment }),
        { status: 201, headers }
      );
    }

    // DELETE - 删除评论
    if (req.method === 'DELETE') {
      const body = await req.json();
      const { path, commentId, password } = body;

      if (!path || !commentId || !password) {
        return new Response(
          JSON.stringify({ error: '缺少必要参数' }),
          { status: 400, headers }
        );
      }

      // 验证管理员密码
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || password !== adminPassword) {
        return new Response(
          JSON.stringify({ error: '密码错误' }),
          { status: 403, headers }
        );
      }

      // 获取现有评论
      const commentsData = await store.get(path, { type: 'json' });
      const comments = commentsData || [];

      // 删除指定评论
      const filteredComments = comments.filter(c => c.id !== commentId);

      // 保存更新后的评论列表
      await store.setJSON(path, filteredComments);

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: '不支持的请求方法' }),
      { status: 405, headers }
    );
  } catch (error) {
    console.error('评论功能错误:', error);
    return new Response(
      JSON.stringify({ error: '服务器错误', message: error.message }),
      { status: 500, headers }
    );
  }
};
