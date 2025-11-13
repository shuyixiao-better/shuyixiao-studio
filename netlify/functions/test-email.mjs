// 测试邮件配置
import nodemailer from 'nodemailer';
import process from 'node:process';

export default async (req) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    try {
        // 检查环境变量
        const config = {
            SMTP_HOST: process.env.SMTP_HOST || 'smtp.163.com',
            SMTP_PORT: process.env.SMTP_PORT || '465',
            SMTP_USER: process.env.SMTP_USER ? '已配置' : '未配置',
            SMTP_PASS: process.env.SMTP_PASS ? '已配置' : '未配置',
            ADMIN_EMAIL: process.env.ADMIN_EMAIL || '未配置',
        };

        console.log('📧 邮件配置检查:', config);

        // 如果配置完整，尝试发送测试邮件
        if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ADMIN_EMAIL) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.163.com',
                port: parseInt(process.env.SMTP_PORT || '465'),
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // 验证连接
            await transporter.verify();
            console.log('✅ SMTP 连接验证成功');

            // 发送测试邮件
            const info = await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.ADMIN_EMAIL,
                subject: '评论系统邮件测试',
                html: `
                    <h2>邮件配置测试成功</h2>
                    <p>如果您收到这封邮件，说明邮件配置正确。</p>
                    <p>测试时间：${new Date().toLocaleString('zh-CN')}</p>
                `,
            });

            console.log('✅ 测试邮件发送成功:', info.messageId);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: '邮件配置正确，测试邮件已发送',
                    config,
                    messageId: info.messageId
                }),
                { status: 200, headers }
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: '邮件配置不完整',
                    config
                }),
                { status: 200, headers }
            );
        }
    } catch (error) {
        console.error('❌ 邮件测试失败:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
            }),
            { status: 500, headers }
        );
    }
};
