// 完整版评论 API - 不依赖邮件功能
import { getStore } from '@netlify/blobs';

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

            console.log('📖 获取评论:', articlePath);

            try {
                const commentsData = await store.get(articlePath, { type: 'json' });
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

            // 获取现有评论
            let comments = [];
            try {
                const commentsData = await store.get(path, { type: 'json' });
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
            await store.setJSON(path, comments);
            console.log('✅ 评论保存成功，总数:', comments.length);

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
