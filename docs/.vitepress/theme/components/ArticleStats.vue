<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../utils/posts.data.js'
import { hasBackend, backendJson } from '../utils/deploy-env.js'
const { page, frontmatter } = useData()
const currentPath = computed(() => page.value.relativePath || '')
const normalize = value => decodeURI(value).replace(/(?:index)?\.(?:md|html)$/, '').replace(/^\/|\/$/g, '')
const post = computed(() => posts.find(item => normalize(item.url) === normalize(currentPath.value)))
const localWords = ref(0)
const wordCount = computed(() => post.value?.wordCount ?? localWords.value)
const date = computed(() => {
  const value = frontmatter.value.date || post.value?.date || page.value.lastUpdated
  return value ? new Date(value).toISOString().slice(0, 10) : '未标注日期'
})
const stats = ref(null)
const busy = ref(false)
const message = ref('')
const API_BASE = '/api/stats'
let mounted = false
let revision = 0
const headers = () => {
  if (typeof window === 'undefined' || !['localhost', '127.0.0.1'].includes(window.location.hostname)) return {}
  let fingerprint = ''
  try {
    fingerprint = window.sessionStorage.getItem('browser_fingerprint') || String(Math.random())
    window.sessionStorage.setItem('browser_fingerprint', fingerprint)
  } catch { /* Storage is optional. */ }
  return { 'x-dev-mode': 'true', 'x-browser-fingerprint': fingerprint }
}
const valid = data => data && Number.isFinite(data.views) && Number.isFinite(data.likes)
const load = async () => {
  const turn = ++revision
  const path = currentPath.value
  stats.value = null; message.value = ''; busy.value = false
  await nextTick()
  const text = document.querySelector('.vp-doc')?.innerText || ''
  localWords.value = (text.match(/[\u4e00-\u9fff]|[a-zA-Z]+/g) || []).length
  if (!(await hasBackend()) || turn !== revision) return
  const url = action => `${API_BASE}?action=${action}&path=${encodeURIComponent(path)}`
  try {
    const data = await backendJson(url('get_all_stats'), { headers: headers() })
    if (!valid(data) || turn !== revision) return
    stats.value = data
    let viewed = false
    try { viewed = !!window.sessionStorage.getItem(`viewed_${path}`) } catch { /* Optional. */ }
    if (!viewed) {
      const counted = await backendJson(url('increment_views'), { headers: headers() })
      if (turn !== revision) return
      if (!Number.isFinite(counted.views)) { stats.value = null; return }
      stats.value = { ...data, views: counted.views }
      try { window.sessionStorage.setItem(`viewed_${path}`, 'true') } catch { /* Optional. */ }
    }
  } catch { if (turn === revision) stats.value = null }
}
const toggleLike = async () => {
  if (!stats.value || busy.value) return
  const turn = revision
  busy.value = true
  try {
    const action = stats.value.hasLiked ? 'unlike' : 'like'
    const data = await backendJson(`${API_BASE}?action=${action}&path=${encodeURIComponent(currentPath.value)}`, { headers: headers() })
    if (turn !== revision) return
    if (!Number.isFinite(data.likes)) throw new Error('Invalid likes')
    stats.value = { ...stats.value, likes: data.likes, hasLiked: data.hasLiked }
    message.value = data.alreadyLiked ? '您已经点赞过了' : data.hasLiked ? '感谢点赞' : '已取消点赞'
  } catch { if (turn === revision) stats.value = null }
  finally { if (turn === revision) busy.value = false }
}
onMounted(() => { mounted = true; load() })
onUnmounted(() => { mounted = false; revision++ })
watch(currentPath, () => { if (mounted) load() })
</script>
<template>
  <div class="article-stats" aria-label="文章信息">
    <time>{{ date }}</time><span>{{ wordCount.toLocaleString('zh-CN') }} 字</span><span>{{ Math.max(1, Math.ceil(wordCount / 300)) }} 分钟阅读</span>
    <template v-if="stats"><span>{{ stats.views }} 阅读</span><button :disabled="busy" :aria-pressed="!!stats.hasLiked" @click="toggleLike">{{ stats.likes }} {{ stats.hasLiked ? '已赞' : '点赞' }}</button></template>
    <span v-if="message" role="status">{{ message }}</span>
  </div>
</template>
<style scoped>
.article-stats { display: flex; align-items: baseline; flex-wrap: wrap; margin-block: var(--sp-16) var(--sp-24); color: var(--ui-muted); font-size: var(--ui-text-meta); }
.article-stats > * + *::before { content: '·'; display: inline-block; margin-inline: var(--sp-8); color: var(--ui-muted); }
.article-stats button { font: inherit; color: inherit; cursor: pointer; }
.article-stats button:hover, .article-stats button[aria-pressed='true'] { color: var(--vp-c-brand-1); }
</style>
