import { getStore } from "@netlify/blobs";

// 统计数据存储
const STATS_STORE = "site-stats";

// 获取或初始化统计数据
async function getStats(store, key, defaultValue = 0) {
  try {
    const value = await store.get(key);
    return value ? parseInt(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting stats for ${key}:`, error);
    return defaultValue;
  }
}

// 设置统计数据
async function setStats(store, key, value) {
  try {
    await store.set(key, value.toString());
    return true;
  } catch (error) {
    console.error(`Error setting stats for ${key}:`, error);
    return false;
  }
}

// 获取客户端IP（用于防刷）
function getClientIP(headers) {
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || headers.get('x-real-ip') 
    || 'unknown';
  
  // 开发模式：添加随机数，允许同一IP多次点赞测试
  const isDev = headers.get('x-dev-mode') === 'true';
  if (isDev) {
    // 使用浏览器指纹作为唯一标识
    const fingerprint = headers.get('x-browser-fingerprint') || Math.random().toString(36);
    return `${ip}_${fingerprint}`;
  }
  
  return ip;
}

export default async (req, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const store = getStore(STATS_STORE);
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const path = url.searchParams.get('path') || '';

  try {
    switch (action) {
      // 获取文章阅读数
      case 'get_views': {
        const views = await getStats(store, `views:${path}`);
        return new Response(JSON.stringify({ views }), { status: 200, headers });
      }

      // 增加文章阅读数
      case 'increment_views': {
        const currentViews = await getStats(store, `views:${path}`);
        const newViews = currentViews + 1;
        await setStats(store, `views:${path}`, newViews);
        return new Response(JSON.stringify({ views: newViews }), { status: 200, headers });
      }

      // 获取文章点赞数
      case 'get_likes': {
        const likes = await getStats(store, `likes:${path}`);
        return new Response(JSON.stringify({ likes }), { status: 200, headers });
      }

      // 点赞（增加）
      case 'like': {
        const clientIP = getClientIP(req.headers);
        const likeKey = `like_record:${path}:${clientIP}`;
        
        // 检查是否已经点赞
        const hasLiked = await store.get(likeKey);
        if (hasLiked) {
          const likes = await getStats(store, `likes:${path}`);
          return new Response(
            JSON.stringify({ likes, alreadyLiked: true, message: '您已经点赞过了' }), 
            { status: 200, headers }
          );
        }

        // 增加点赞数
        const currentLikes = await getStats(store, `likes:${path}`);
        const newLikes = currentLikes + 1;
        await setStats(store, `likes:${path}`, newLikes);
        
        // 记录已点赞（7天过期）
        await store.set(likeKey, JSON.stringify({ 
          timestamp: Date.now(),
          path: path 
        }));

        return new Response(
          JSON.stringify({ likes: newLikes, hasLiked: true }), 
          { status: 200, headers }
        );
      }

      // 取消点赞
      case 'unlike': {
        const clientIP = getClientIP(req.headers);
        const likeKey = `like_record:${path}:${clientIP}`;
        
        // 检查是否已点赞
        const hasLiked = await store.get(likeKey);
        if (!hasLiked) {
          const likes = await getStats(store, `likes:${path}`);
          return new Response(
            JSON.stringify({ likes, hasLiked: false, message: '您还未点赞' }), 
            { status: 200, headers }
          );
        }

        // 减少点赞数
        const currentLikes = await getStats(store, `likes:${path}`);
        const newLikes = Math.max(0, currentLikes - 1);
        await setStats(store, `likes:${path}`, newLikes);
        
        // 删除点赞记录
        await store.delete(likeKey);

        return new Response(
          JSON.stringify({ likes: newLikes, hasLiked: false }), 
          { status: 200, headers }
        );
      }

      // 获取全站访问数
      case 'get_site_visits': {
        const visits = await getStats(store, 'site:total_visits');
        return new Response(JSON.stringify({ visits }), { status: 200, headers });
      }

      // 增加全站访问数
      case 'increment_site_visits': {
        const currentVisits = await getStats(store, 'site:total_visits');
        const newVisits = currentVisits + 1;
        await setStats(store, 'site:total_visits', newVisits);
        return new Response(JSON.stringify({ visits: newVisits }), { status: 200, headers });
      }

      // 获取所有统计数据
      case 'get_all_stats': {
        const views = await getStats(store, `views:${path}`);
        const likes = await getStats(store, `likes:${path}`);
        const siteVisits = await getStats(store, 'site:total_visits');
        const clientIP = getClientIP(req.headers);
        const likeKey = `like_record:${path}:${clientIP}`;
        const hasLiked = !!(await store.get(likeKey));

        return new Response(
          JSON.stringify({ 
            views, 
            likes, 
            siteVisits,
            hasLiked
          }), 
          { status: 200, headers }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }), 
          { status: 400, headers }
        );
    }
  } catch (error) {
    console.error('Stats function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/stats"
};

