<script setup>
import { data as posts } from '../utils/posts.data.js'
import { withBase } from 'vitepress'
const recentPosts = posts.slice(0, 6)
const formatDate = value => new Date(value).toISOString().slice(0, 10)
</script>
<template><section class="home-section recent-posts" aria-labelledby="recent-title"><h2 id="recent-title">最新文章</h2><p class="section-description">最近的实践、观察与复盘</p><ul class="recent-list"><li v-for="post in recentPosts" :key="post.url"><time :datetime="formatDate(post.date)">{{ formatDate(post.date) }}</time><a :href="withBase(post.url)">{{ post.title }}</a><span v-if="post.tags?.length" class="post-category">{{ post.tags[0] }}</span></li></ul><a class="all-posts" :href="withBase('/articles/')">全部文章 →</a></section></template>
