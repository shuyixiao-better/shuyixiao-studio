---
layout: doc
title: 开发工具
description: 效率工具与插件推荐
---

# 开发工具

精选实用工具，提升开发效率 ⚡

<div class="tools-grid">


  <a href="/articles/gitpulse-intro" class="tool-card">
    <div class="tool-icon">📊</div>
    <h3 class="tool-title">GitPulse</h3>
    <p class="tool-desc">Git周报小助手，查看 Git 提交历史，了解项目进度</p>
    <div class="tool-tags">
      <span class="tool-tag">舒一笑不秃头自研</span>
      <span class="tool-tag">IDEA 插件</span>
      <span class="tool-tag">免费</span>
    </div>
  </a>

  <a href="/articles/MyBatis-Log-Panda" class="tool-card">
    <div class="tool-icon">📝</div>
    <h3 class="tool-title">MyBatisLog Panda Log</h3>
    <p class="tool-desc">MyBatis日志快速提取可执行SQL</p>
    <div class="tool-tags">
      <span class="tool-tag">舒一笑不秃头自研</span>
      <span class="tool-tag">IDEA 插件</span>
      <span class="tool-tag">轻量付费</span>
    </div>
  </a>

  <a href="/articles/elasticsearch-log-info" class="tool-card">
    <div class="tool-icon">🔎</div>
    <h3 class="tool-title">Elasticsearch Log</h3>
    <p class="tool-desc">Elasticsearch日志高效提取，快速提取DSL</p>
    <div class="tool-tags">
      <span class="tool-tag">舒一笑不秃头自研</span>
      <span class="tool-tag">IDEA 插件</span>
      <span class="tool-tag">轻量付费</span>
    </div>
  </a>

  <a href="https://www.poeticcoder.vip/" class="tool-card" target="_blank" rel="noopener noreferrer">
    <div class="tool-icon">🐼</div>
    <h3 class="tool-title">GitPulse 周报</h3>
    <p class="tool-desc">查看 Git 提交周报，了解开发进度和代码统计</p>
    <div class="tool-tags">
      <span class="tool-tag">舒一笑不秃头自研</span>
      <span class="tool-tag">周报浏览</span>
      <span class="tool-tag">开源</span>
    </div>
  </a>

  <a href="./consumer-copilot/" class="tool-card">
    <div class="tool-icon">🤖</div>
    <h3 class="tool-title">消费决策助手</h3>
    <p class="tool-desc">AI驱动的理性消费助手，帮你看穿商家套路，做出明智决策</p>
    <div class="tool-tags">
      <span class="tool-tag">AI助手</span>
      <span class="tool-tag">消费决策</span>
      <span class="tool-tag">新功能</span>
    </div>
  </a>
  
  <a href="./avatar-generator/" class="tool-card">
    <div class="tool-icon">🎨</div>
    <h3 class="tool-title">头像生成器</h3>
    <p class="tool-desc">随机生成独特的个性头像，支持22种风格，一键下载使用</p>
    <div class="tool-tags">
      <span class="tool-tag">在线工具</span>
      <span class="tool-tag">免费</span>
    </div>
  </a>

  <a href="./code-rain/" class="tool-card">
    <div class="tool-icon">💚</div>
    <h3 class="tool-title">代码雨</h3>
    <p class="tool-desc">黑客帝国风格代码雨动画，支持多种主题，全屏沉浸式体验</p>
    <div class="tool-tags">
      <span class="tool-tag">解压神器</span>
      <span class="tool-tag">炫酷</span>
    </div>
  </a>

  <a href="./dev-fortune/" class="tool-card">
    <div class="tool-icon">🐟</div>
    <h3 class="tool-title">程序员摸鱼日历</h3>
    <p class="tool-desc">每日运势黄历，查看今天适合写代码还是摸鱼，科学划水</p>
    <div class="tool-tags">
      <span class="tool-tag">每日必看</span>
      <span class="tool-tag">娱乐</span>
    </div>
  </a>

  <a href="./requirement-boundary/" class="tool-card">
    <div class="tool-icon">🛡️</div>
    <h3 class="tool-title">需求边界守卫者</h3>
    <p class="tool-desc">在动手之前先明确需求边界，避免做超出范围的多余工作</p>
    <div class="tool-tags">
      <span class="tool-tag">工作必备</span>
      <span class="tool-tag">效率工具</span>
    </div>
  </a>

</div>

## 🎯 更多工具

正在持续开发中，敬请期待...

<style scoped>
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.tool-card {
  position: relative;
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(62, 175, 124, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: block;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.tool-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, 
    rgba(62, 175, 124, 0.4),
    rgba(52, 211, 153, 0.3),
    rgba(62, 175, 124, 0.4));
  opacity: 0;
  transition: all 0.4s ease;
  border-radius: 20px;
  z-index: -1;
  filter: blur(12px);
}

.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(62, 175, 124, 0.6);
  box-shadow: 0 20px 50px rgba(62, 175, 124, 0.2);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(62, 175, 124, 0.2));
}

.tool-title {
  margin: 0 0 0.75rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, 
    var(--vp-c-text-1) 0%, 
    var(--vp-c-brand-1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tool-desc {
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.tool-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tool-tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  background: linear-gradient(135deg, 
    var(--vp-c-brand-dimm), 
    rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  font-weight: 500;
}

.dark .tool-card {
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.04) 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.dark .tool-card:hover {
  box-shadow: 0 20px 50px rgba(62, 175, 124, 0.25);
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tool-card {
    padding: 1.5rem;
  }
  
  .tool-icon {
    font-size: 2.5rem;
    height: 60px;
  }
}
</style>

