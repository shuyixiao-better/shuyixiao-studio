<template>
  <div class="site-visits">
    <span class="visits-icon">📊</span>
    <span class="visits-label">本站总访问</span>
    <span class="visits-count">{{ formatNumber(visits) }}</span>
    <span class="visits-unit">次</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visits = ref(0);
const API_BASE = '/api/stats';

// 格式化数字（添加千位分隔符）
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 获取访问数
const fetchVisits = async () => {
  try {
    const response = await fetch(`${API_BASE}?action=get_site_visits`);
    const data = await response.json();
    visits.value = data.visits || 0;
  } catch (error) {
    console.error('Failed to fetch site visits:', error);
  }
};

// 增加访问数
const incrementVisits = async () => {
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.site-visits:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.visits-icon {
  font-size: 16px;
}

.visits-label {
  opacity: 0.95;
}

.visits-count {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: #ffd700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.visits-unit {
  opacity: 0.9;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .site-visits {
    font-size: 12px;
    padding: 5px 12px;
  }

  .visits-icon {
    font-size: 14px;
  }

  .visits-count {
    font-size: 14px;
  }
}

/* 数字跳动动画 */
@keyframes countup {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.visits-count {
  animation: countup 0.5s ease;
}
</style>

