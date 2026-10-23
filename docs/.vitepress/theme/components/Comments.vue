<script setup>
import { useRoute } from 'vitepress'
import CommentSection from './comments/CommentSection.vue'
const route = useRoute()
</script>
<template><CommentSection :key="route.path" :path="route.path" /></template>
