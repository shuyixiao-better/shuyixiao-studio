<template>
  <span class="site-visits" v-if="isNetlifyEnv">
    | 本站总访问：<span class="visits-count">{{ formatNumber(visits) }}</span> 次
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visits = ref(0);
const isNetlifyEnv = ref(true);
const API_BASE = '/api/stats';

// 格式化数字（添加千位分隔符）
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 检测是否为 Netlify 环境
const checkNetlifyEnv = async () => {
  try {
    const response = await fetch(`${API_BASE}?action=get_site_visits`, {
      method: 'GET',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// 获取访问数
const fetchVisits = async () => {
  // 先检测环境
  const hasNetlifyFunctions = await checkNetlifyEnv();
  isNetlifyEnv.value = hasNetlifyFunctions;
  
  if (!hasNetlifyFunctions) {
    console.info('统计功能仅在 Netlify 部署时可用');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}?action=get_site_visits`);
    const data = await response.json();
    visits.value = data.visits || 0;
  } catch (error) {
    console.error('Failed to fetch site visits:', error);
    isNetlifyEnv.value = false;
  }
};

// 增加访问数
const incrementVisits = async () => {
  if (!isNetlifyEnv.value) return;
  
  // 检查Cookie，避免重复计数
  const cookieName = 'site_visited';
  const hasVisited = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}=`));
  
  if (hasVisited) {
    return; // 今天已访问过，不重复计数
  }

  try {
    const response = await fetch(`${API_BASE}?action=increment_site_visits`);
    const data = await response.json();
    visits.value = data.visits || 0;
    
    // 设置Cookie（24小时过期）
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `${cookieName}=true; expires=${expires.toUTCString()}; path=/`;
  } catch (error) {
    console.error('Failed to increment site visits:', error);
  }
};

onMounted(async () => {
  await fetchVisits();
  await incrementVisits();
});
</script>

<style scoped>
.site-visits {
  display: inline;
  white-space: nowrap;
  font-size: 0.9em;
  opacity: 0.8;
  letter-spacing: 2px;
}

.visits-count {
  font-weight: normal;
  font-style: normal;
}

/* 数字跳动动画 */
@keyframes countup {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.visits-count {
  animation: countup 0.5s ease;
}
</style>

