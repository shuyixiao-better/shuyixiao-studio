<script setup>
import { withBase } from 'vitepress'
import LineIcon from '../LineIcon.vue'
</script>
<template>
  <header class="home-hero">
    <p class="hero-eyebrow">舒一笑不秃头 · 个人博客</p>
    <h1>代码之外，<br />探索人生更多可能</h1>
    <p class="hero-copy">写了多年 Java 与 AI 工程，如今把更多时间投给量化交易、Web3、健身与薄肌理论。这里记录每一次实践、复盘与长期主义。</p>
    <div class="hero-actions"><a class="ui-button primary" :href="withBase('/articles/')">开始阅读</a><a class="ui-button secondary" :href="withBase('/about/')">关于我</a></div>
    <p class="hero-access"><LineIcon name="globe" />站点部署于海外，国内访问如较慢可借助网络加速工具。</p>
  </header>
</template>
