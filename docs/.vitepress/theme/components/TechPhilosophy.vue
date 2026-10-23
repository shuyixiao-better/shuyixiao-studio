<template>
  <div class="tech-philosophy-section">
    <div class="philosophy-container">
      <div class="philosophy-header">
        <div class="header-icon"><LineIcon name="book" /></div>
        <h2 class="philosophy-title">技术之道</h2>
        <div class="header-subtitle">我的编程哲学</div>
      </div>
      
      <div class="philosophy-content">
        <div class="main-quote">
          <div class="quote-icon"><LineIcon name="book" /></div>
          <p class="quote-text">
            真正的理解，不在于阅读千行文档，<br>
            而在于亲手敲下第一行代码
          </p>
          <div class="quote-author">—— 实践是通往精通的唯一路径</div>
        </div>

        <div class="philosophy-cards">
          <div class="philosophy-card" v-for="(item, index) in philosophies" :key="index">
            <div class="card-icon"><LineIcon name="book" /></div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
        </div>

        <div class="philosophy-footer">
          <div class="footer-quote">
            <span class="footer-icon"><LineIcon name="book" /></span>
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
  },
  {
    icon: '🔍',
    title: '保持好奇',
    description: '好奇心是探索的源动力。永远保持对未知的渴望，每一个"为什么"都是成长的起点。'
  },
  {
    icon: '✨',
    title: '化繁为简',
    description: '简单是最终的复杂。用最少的代码做最多的事，让复杂的问题变得清晰可解。'
  }
]
</script>

<style scoped>
.tech-philosophy-section {
  margin: var(--sp-80) auto;
  padding: 0 var(--sp-32);
  max-width: var(--ui-size-1200);
}

.philosophy-container {
  position: relative;
  padding: var(--sp-64) var(--sp-48);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  box-shadow: 
    none;
  border: var(--ui-border) solid var(--vp-c-divider);
  overflow: hidden;
}

.philosophy-header {
  text-align: center;
  margin-bottom: var(--sp-48);
}

.header-icon {
  font-size: var(--ui-text-display);
  margin-bottom: var(--sp-16);
}

.philosophy-title {
  font-size: var(--ui-text-display);
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
  margin-bottom: var(--sp-8);
}

.header-subtitle {
  font-size: var(--ui-text-lg);
  color: var(--vp-c-text-1);
  font-style: italic;
}

.philosophy-content {
  max-width: var(--ui-size-900);
  margin: 0 auto;
}

.main-quote {
  text-align: center;
  padding: var(--sp-48) var(--sp-32);
  margin-bottom: var(--sp-48);
  position: relative;
}

.quote-icon {
  font-size: var(--ui-text-display);
  margin-bottom: var(--sp-24);
  opacity: 0.8;
}

.quote-text {
  font-size: var(--ui-text-section);
  line-height: var(--ui-leading-body);
  color: var(--vp-c-text-1);
  font-weight: var(--ui-weight-medium);
  margin-bottom: var(--sp-24);
}

.quote-author {
  font-size: var(--ui-text-base);
  color: var(--vp-c-text-2);
  font-style: italic;
  opacity: 0.8;
}

.philosophy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--ui-size-252), 1fr));
  gap: var(--sp-32);
  margin-bottom: var(--sp-48);
}

.philosophy-card {
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  border: var(--ui-border) solid var(--vp-c-divider);
  transition: var(--ui-transition);
  cursor: default;
}

.philosophy-card:hover {
  box-shadow: none;
  background: var(--vp-c-bg-soft);
}

.card-icon {
  font-size: var(--ui-text-display);
  margin-bottom: var(--sp-16);
}

.card-title {
  font-size: var(--ui-text-quote);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  margin-bottom: var(--sp-12);
}

.card-desc {
  font-size: var(--ui-text-base);
  line-height: var(--ui-leading-body);
  color: var(--vp-c-text-2);
}

.philosophy-footer {
  text-align: center;
  padding-top: var(--sp-32);
  border-top: var(--ui-border) solid var(--vp-c-divider);
}

.footer-quote {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-12);
  font-size: var(--ui-text-lg);
  color: var(--vp-c-text-2);
  font-style: italic;
}

.footer-icon {
  font-size: var(--ui-text-quote);
}
.dark .philosophy-container {
  background: var(--vp-c-bg-soft);
}

.dark .philosophy-card {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.dark .philosophy-card:hover {
  background: var(--vp-c-bg-soft);
}
@media (max-width: 768px) {
  .philosophy-container {
    padding: var(--sp-48) var(--sp-32);
  }

  .philosophy-title {
    font-size: var(--ui-text-title);
  }

  .quote-text {
    font-size: var(--ui-text-quote);
  }

  .philosophy-cards {
    grid-template-columns: 1fr;
    gap: var(--sp-24);
  }
}
</style>

