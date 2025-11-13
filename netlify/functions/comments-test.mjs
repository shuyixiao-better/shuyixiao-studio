// 最简化测试版本 - 不依赖任何外部服务
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
        const url = new URL(req.url);
        const path = url.searchParams.get('path');

        // GET 测试
        if (req.method === 'GET') {
            return new Response(
                JSON.stringify({ 
                    success: true,
                    message: 'GET 请求成功',
                    path: path,
                    comments: []
                }),
                { status: 200, headers }
            );
        }

        // POST 测试
        if (req.method === 'POST') {
            const body = await req.json();
            return new Response(
                JSON.stringify({ 
                    success: true,
                    message: 'POST 请求成功',
                    received: body
                }),
                { status: 200, headers }
            );
        }

        return new Response(
            JSON.stringify({ error: '不支持的方法' }),
            { status: 405, headers }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                error: error.message,
                stack: error.stack
            }),
            { status: 500, headers }
        );
    }
};
