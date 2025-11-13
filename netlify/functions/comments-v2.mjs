// 完整版评论 API - 包含邮件通知
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
    console.log('📧 ========== 开始发送邮件通知 ==========');
    console.log('📧 文章路径:', articlePath);
    console.log('📧 评论者:', comment.author);
    console.log('📧 评论内容:', comment.content);
    
    console.log('📧 检查邮件配置:', {
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        adminEmail: process.env.ADMIN_EMAIL,
        hasSmtpUser: !!process.env.SMTP_USER,
        smtpUser: process.env.SMTP_USER,
        hasSmtpPass: !!process.env.SMTP_PASS,
        smtpHost: process.env.SMTP_HOST || 'smtp.163.com',
        smtpPort: process.env.SMTP_PORT || '465'
    });

    if (!process.env.ADMIN_EMAIL || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('⚠️ 邮件配置不完整，跳过邮件通知');
        console.log('需要配置: ADMIN_EMAIL, SMTP_USER, SMTP_PASS');
        return;
    }

    try {
        console.log('📧 创建邮件传输器...');
        const transporter = createTransporter();
        
        console.log('📧 验证 SMTP 连接...');
        await transporter.verify();
        console.log('✅ SMTP 连接验证成功');
        
        // 移除 .html 后缀
        const cleanPath = articlePath.replace('.html', '');
        
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `新评论通知 - ${comment.author}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">您的博客收到新评论</h2>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>文章：</strong>${cleanPath}</p>
                        <p><strong>评论者：</strong>${comment.author}</p>
                        <p><strong>评论时间：</strong>${new Date(comment.timestamp).toLocaleString('zh-CN')}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-left: 4px solid #42b883; margin: 20px 0;">
                        <p><strong>评论内容：</strong></p>
                        <p style="color: #333; line-height: 1.6;">${comment.content}</p>
                    </div>
                    ${comment.images && comment.images.length > 0 ? `
                        <div style="margin: 20px 0;">
                            <p><strong>图片：</strong></p>
                            ${comment.images.map(img => `<img src="${img}" style="max-width: 300px; margin: 5px; border-radius: 4px;" />`).join('')}
                        </div>
                    ` : ''}
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://www.poeticcoder.com${cleanPath}" 
                           style="display: inline-block; padding: 12px 24px; background: #42b883; color: white; text-decoration: none; border-radius: 6px;">
                            查看评论
                        </a>
                    </div>
                </div>
            `,
        };

        console.log('📧 发送邮件到:', mailOptions.to);
        console.log('📧 邮件主题:', mailOptions.subject);
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ 邮件发送成功!');
        console.log('✅ Message ID:', info.messageId);
        console.log('✅ Response:', info.response);
        console.log('📧 ========== 邮件发送完成 ==========');
    } catch (error) {
        console.error('❌ ========== 邮件发送失败 ==========');
        console.error('❌ 错误类型:', error.name);
        console.error('❌ 错误信息:', error.message);
        console.error('❌ 错误代码:', error.code);
        console.error('❌ 完整错误:', error);
        console.error('❌ 错误堆栈:', error.stack);
        throw error; // 重新抛出错误，让调用者知道失败了
    }
};

export default async (req) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        const store = getStore('comments');
        const url = new URL(req.url);
        const articlePath = url.searchParams.get('path');

        // GET - 获取评论列表
        if (req.method === 'GET') {
            if (!articlePath) {
                return new Response(
                    JSON.stringify({ error: '缺少文章路径参数' }),
                    { status: 400, headers }
                );
            }

            // 移除开头的斜杠
            const blobKey = articlePath.startsWith('/') ? articlePath.slice(1) : articlePath;
            console.log('📖 获取评论:', blobKey);

            try {
                const commentsData = await store.get(blobKey, { type: 'json' });
                const comments = commentsData || [];
                console.log('✅ 评论数量:', comments.length);

                return new Response(
                    JSON.stringify({ comments }),
                    { status: 200, headers }
                );
            } catch (error) {
                console.log('⚠️ 首次访问，返回空数组');
                return new Response(
                    JSON.stringify({ comments: [] }),
                    { status: 200, headers }
                );
            }
        }

        // POST - 添加评论
        if (req.method === 'POST') {
            const body = await req.json();
            const { author, content, images = [], path } = body;

            console.log('📝 收到评论:', { author, path });

            if (!author || !content || !path) {
                return new Response(
                    JSON.stringify({ error: '缺少必要参数' }),
                    { status: 400, headers }
                );
            }

            // 移除开头的斜杠
            const blobKey = path.startsWith('/') ? path.slice(1) : path;

            // 获取现有评论
            let comments = [];
            try {
                const commentsData = await store.get(blobKey, { type: 'json' });
                comments = commentsData || [];
            } catch (error) {
                console.log('⚠️ 首次创建评论列表');
            }

            // 创建新评论
            const newComment = {
                id: Date.now().toString(),
                author: author.trim(),
                content: content.trim(),
                images: images,
                timestamp: new Date().toISOString(),
            };

            comments.push(newComment);

            // 保存评论
            await store.setJSON(blobKey, comments);
            console.log('✅ 评论保存成功，总数:', comments.length);

            // 发送邮件通知（同步等待，确保发送）
            try {
                await sendEmailNotification(newComment, path);
            } catch (err) {
                console.error('❌ 邮件通知失败:', err.message);
                // 邮件失败不影响评论提交
            }

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

            // 移除开头的斜杠
            const blobKey = path.startsWith('/') ? path.slice(1) : path;

            // 获取现有评论
            const commentsData = await store.get(blobKey, { type: 'json' });
            const comments = commentsData || [];

            // 删除指定评论
            const filteredComments = comments.filter(c => c.id !== commentId);

            // 保存更新后的评论列表
            await store.setJSON(blobKey, filteredComments);
            console.log('✅ 评论删除成功');

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
        console.error('❌ 错误:', error.message);
        console.error('堆栈:', error.stack);
        
        return new Response(
            JSON.stringify({ 
                error: '服务器错误',
                message: error.message,
                details: error.stack
            }),
            { status: 500, headers }
        );
    }
};
