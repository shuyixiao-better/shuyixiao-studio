<template>
  <div class="comments-placeholder">
    <div class="placeholder-content">
      <div class="icon">💬</div>
      <h3>评论功能</h3>
      <p>当前站点为 GitHub Pages 镜像版本，不支持评论功能。</p>
      <p>如需发表评论，请访问主域名版本：</p>
      <a 
        :href="netlifyUrl" 
        class="netlify-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        🚀 前往 主域名 版本评论
      </a>
      <div class="features">
        <div class="feature-item">✅ 支持文字评论</div>
        <div class="feature-item">✅ 支持图片上传</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { primaryUrl } from '../utils/deploy-env.js';

const route = useRoute();

// Netlify 站点 URL
// Canonical URLs are owned by deploy-env.js.

// 生成 Netlify 版本的完整 URL
const netlifyUrl = computed(() => {
  return primaryUrl(route.path) + '#评论区';
});
</script>

<style scoped>
.comments-placeholder {
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  text-align: center;
  color: white;
}

.placeholder-content {
  max-width: 600px;
  margin: 0 auto;
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: white;
}

.placeholder-content p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.netlify-link {
  display: inline-block;
  margin: 24px 0;
  padding: 12px 32px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.netlify-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.features {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.feature-item {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .comments-placeholder {
    padding: 30px 20px;
  }
  
  .icon {
    font-size: 36px;
  }
  
  .placeholder-content h3 {
    font-size: 20px;
  }
  
  .placeholder-content p {
    font-size: 14px;
  }
  
  .features {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
