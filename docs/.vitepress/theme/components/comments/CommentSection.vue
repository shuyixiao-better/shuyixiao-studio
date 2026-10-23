<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { normalizePath } from '../../utils/comments-core.js'
import { useComments } from './composables/useComments.js'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import AdminBar from './AdminBar.vue'
const props = defineProps({ path: { type: String, required: true } })
const section = ref(null)
let path
try { path = normalizePath(props.path) } catch { path = props.path }
const { comments, total, truncated, status, adminMode, token, highlighted, load, submit, login, logout, reply, remove } = useComments(path)
let observer
onMounted(() => {
  if (!('IntersectionObserver' in window)) { load(); return }
  observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load() }
  }, { rootMargin: '200px' })
  observer.observe(section.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <section id="评论区" ref="section" class="comment-section" aria-labelledby="comments-heading">
    <div class="comment-heading"><h2 id="comments-heading">评论</h2><span v-if="status === 'ready'">· {{ total }} 条</span></div>
    <AdminBar v-if="adminMode" :logged-in="!!token" :login="login" @logout="logout" />
    <CommentForm :submit="submit" />
    <div v-if="status === 'loading' || status === 'idle'" class="comment-skeleton" role="status" aria-label="评论加载中"><span /><span /><span /></div>
    <p v-else-if="status === 'error'" class="comment-state">评论加载失败 · <button class="comment-text-button" @click="load">重试</button></p>
    <template v-else>
      <p v-if="!comments.length" class="comment-state">{{ total ? '较早的讨论已超出展示范围。' : '还没有评论，来说点什么吧。' }}</p>
      <ul v-else class="comment-list"><CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :managed="adminMode && !!token" :highlighted="highlighted === comment.id" :reply="reply" :remove="remove" /></ul>
      <p v-if="truncated" class="comment-state">仅展示最近 300 条评论及回复。</p>
    </template>
  </section>
</template>
<style src="./comments.css"></style>
