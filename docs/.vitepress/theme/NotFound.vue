<script setup>
import { withBase } from 'vitepress'
</script>
<template><main class="not-found-container"><p class="not-found-code">404</p><h1>此处暂无内容</h1><p>行到水穷处，坐看云起时。</p><a class="ui-button secondary" :href="withBase('/')">返回首页 →</a></main></template>
<style scoped>
.not-found-container { max-width: var(--ui-reading-width); margin: var(--sp-96) auto; padding: var(--sp-32) var(--ui-page-gutter); text-align: center; }
.not-found-code { font-size: var(--ui-text-meta); color: var(--ui-muted); font-variant-numeric: tabular-nums; }
h1 { font-size: var(--ui-text-title); font-weight: var(--ui-weight-heading); margin-block: var(--sp-16); }
p { color: var(--vp-c-text-2); margin-bottom: var(--sp-32); }
</style>
