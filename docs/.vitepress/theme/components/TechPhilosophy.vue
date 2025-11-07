<template>
  <div class="tech-philosophy-section">
    <div class="philosophy-container">
      <div class="philosophy-header">
        <div class="header-icon">🌟</div>
        <h2 class="philosophy-title">技术之道</h2>
        <div class="header-subtitle">我的编程哲学</div>
      </div>
      
      <div class="philosophy-content">
        <div class="main-quote">
          <div class="quote-icon">💡</div>
          <p class="quote-text">
            真正的理解，不在于阅读千行文档，<br>
            而在于亲手敲下第一行代码
          </p>
          <div class="quote-author">—— 实践是通往精通的唯一路径</div>
        </div>

        <div class="philosophy-cards">
          <div class="philosophy-card" v-for="(item, index) in philosophies" :key="index">
            <div class="card-icon">{{ item.icon }}</div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
        </div>

        <div class="philosophy-footer">
          <div class="footer-quote">
            <span class="footer-icon">✨</span>
            <span class="footer-text">纸上得来终觉浅，绝知此事要躬行</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const philosophies = [
  {
    icon: '🔨',
    title: '以手为师',
    description: '每一次实践，都是与技术的深度对话。代码不会说谎，只有亲手构建，才能洞悉本质。'
  },
  {
    icon: '🌱',
    title: '在错中成长',
    description: '错误是最好的老师。每一个 Bug 的修复，都是一次认知的升华，一次能力的蜕变。'
  },
  {
    icon: '🎯',
    title: '知行合一',
    description: '理论是地图，实践是旅程。只有将所学付诸行动，知识才能转化为真正的力量。'
  },
  {
    icon: '🚀',
    title: '持续迭代',
    description: '没有完美的第一版，只有不断优化的过程。在实践中学习，在学习中精进。'
  }
]
</script>

<style scoped>
.tech-philosophy-section {
  margin: 5rem auto;
  padding: 0 2rem;
  max-width: 1200px;
}

.philosophy-container {
  position: relative;
  padding: 4rem 3rem;
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(168, 85, 247, 0.08) 50%,
    rgba(236, 72, 153, 0.05) 100%);
  border-radius: 32px;
  box-shadow: 
    0 25px 70px rgba(99, 102, 241, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  overflow: hidden;
}

.philosophy-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    transparent,
    rgba(99, 102, 241, 0.8),
    rgba(168, 85, 247, 0.8),
    rgba(236, 72, 153, 0.8),
    transparent);
}

.philosophy-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.philosophy-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.philosophy-content {
  max-width: 900px;
  margin: 0 auto;
}

.main-quote {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.quote-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.quote-text {
  font-size: 1.5rem;
  line-height: 2;
  color: var(--vp-c-text-1);
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quote-author {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  opacity: 0.8;
}

.philosophy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.philosophy-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: all 0.3s ease;
  cursor: default;
}

.philosophy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.15);
  background: rgba(255, 255, 255, 0.8);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.8rem;
}

.card-desc {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.philosophy-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
}

.footer-quote {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.footer-icon {
  font-size: 1.3rem;
}

/* 深色模式适配 */
.dark .philosophy-container {
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.08) 0%,
    rgba(168, 85, 247, 0.12) 50%,
    rgba(236, 72, 153, 0.08) 100%);
}

.dark .philosophy-card {
  background: rgba(30, 30, 30, 0.6);
  border-color: rgba(99, 102, 241, 0.25);
}

.dark .philosophy-card:hover {
  background: rgba(40, 40, 40, 0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .philosophy-container {
    padding: 3rem 2rem;
  }

  .philosophy-title {
    font-size: 2rem;
  }

  .quote-text {
    font-size: 1.2rem;
  }

  .philosophy-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>

