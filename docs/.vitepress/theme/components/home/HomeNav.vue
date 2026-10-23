<script setup>
import { withBase } from 'vitepress'
import LineIcon from '../LineIcon.vue'
const items = [
 ['技术文章', '/articles/', '多年 Java 与 AI 工程的积累', 'code'],
 ['专栏教程', '/tutorials/insights/', '体系化的技术与思考', 'book'],
 ['实战项目', '/projects/', '从零到一的完整实践', 'project'],
 ['我的工具', '/tools/', '自己做的效率工具与插件', 'tools'],
 ['拾珍录', '/tutorials/treasures/', '值得收藏的资源', 'bookmark'],
 ['书单推荐', '/recommendations/', '读过并推荐的书', 'book']
]
</script>
<template><section class="home-section" aria-labelledby="home-nav-title"><h2 id="home-nav-title">内容导航</h2><p class="section-description">过去的积累，也是下一次探索的起点</p><div class="home-nav-grid"><a v-for="[title, link, desc, icon] in items" :key="link" :href="withBase(link)" class="home-nav-card ui-card"><LineIcon :name="icon" /><div><h3>{{ title }}</h3><p>{{ desc }}</p></div><span class="nav-arrow">→</span></a></div></section></template>
