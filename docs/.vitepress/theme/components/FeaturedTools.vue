<template>
  <div class="home-section featured-tools-section">
    <div class="featured-tools-container">
      <h2 class="featured-tools-title"> 实用工具</h2>
      <p class="featured-tools-subtitle">精选开发工具，助力高效编码</p>
      
      <div class="tools-showcase">

        <a href="/articles/MyBatis-Log-Panda" class="featured-tool-card">
          <div class="tool-card-icon"><LineIcon name="code" /></div>
          <div class="tool-card-content">
            <h3 class="tool-card-title">MyBatis Log Panda</h3>
            <p class="tool-card-desc">SQL语句生成插件，提升开发效率</p>
            <div class="tool-card-tags">
              <span class="tool-badge">IDEA插件</span>
            </div>
          </div>
          <div class="tool-card-arrow">→</div>
        </a>

        <a href="/tools/consumer-copilot/" class="featured-tool-card">
          <div class="tool-card-icon"><LineIcon name="message" /></div>
          <div class="tool-card-content">
            <h3 class="tool-card-title">消费决策助手</h3>
            <p class="tool-card-desc">AI驱动的理性消费助手，帮你看穿商家套路，做出明智决策</p>
            <div class="tool-card-tags">
              <span class="tool-badge">AI助手</span>
              <span class="tool-badge">理性消费</span>
            </div>
          </div>
          <div class="tool-card-arrow">→</div>
        </a>

        <a href="/recommendations/" class="featured-tool-card">
          <div class="tool-card-icon"><LineIcon name="book" /></div>
          <div class="tool-card-content">
            <h3 class="tool-card-title">书单推荐</h3>
            <p class="tool-card-desc">精选技术与人生好书，助力成长之路</p>
            <div class="tool-card-tags">
              <span class="tool-badge">阅读</span>
              <span class="tool-badge">成长</span>
            </div>
          </div>
          <div class="tool-card-arrow">→</div>
        </a>

      </div>
      
      <div class="tools-more">
        <a href="/tools/" class="tools-more-link">
          查看更多工具 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.featured-tools-container { border-top: var(--ui-border) solid var(--vp-c-divider); padding-top: var(--sp-32); }
.featured-tools-title { font-size: var(--ui-text-section); font-weight: var(--ui-weight-heading); margin-bottom: var(--sp-8); }
.featured-tools-subtitle { color: var(--vp-c-text-2); font-size: var(--ui-text-sm); margin-bottom: var(--sp-32); }
.tools-showcase { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-24); }
.featured-tool-card { display: flex; gap: var(--sp-16); align-items: flex-start; padding-block: var(--sp-16); color: var(--vp-c-text-1); border-bottom: var(--ui-border) solid var(--vp-c-divider); text-decoration: none; }
.tool-card-icon { color: var(--ui-muted); flex-shrink: 0; }
.tool-card-content { min-width: 0; }
.tool-card-title { font-size: var(--ui-text-base); font-weight: var(--ui-weight-heading); margin: 0 0 var(--sp-8); }
.tool-card-desc { color: var(--vp-c-text-2); font-size: var(--ui-text-sm); margin: 0 0 var(--sp-12); }
.tool-card-tags { display: flex; flex-wrap: wrap; gap: var(--sp-8); }
.tool-badge { font-size: var(--ui-text-xs); color: var(--ui-muted); }
.tool-card-arrow { margin-left: auto; color: var(--ui-muted); }
.featured-tool-card:hover .tool-card-title { color: var(--vp-c-brand-1); }
.tools-more { margin-top: var(--sp-24); font-size: var(--ui-text-sm); color: var(--vp-c-brand-1); }
@media (max-width: 959px) { .tools-showcase { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 639px) { .tools-showcase { grid-template-columns: minmax(0, 1fr); } }
</style>
