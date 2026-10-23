<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { hasBackend, backendJson } from '../utils/deploy-env.js'
const visits = ref(null)
let active = true
onMounted(async () => {
  if (!(await hasBackend())) return
  try {
    let data = await backendJson('/api/stats?action=get_site_visits')
    if (!Number.isFinite(data.visits)) return
    if (!document.cookie.split('; ').some(row => row.startsWith('site_visited='))) {
      data = await backendJson('/api/stats?action=increment_site_visits')
      if (!Number.isFinite(data.visits)) return
      document.cookie = 'site_visited=true; max-age=86400; path=/; SameSite=Lax'
    }
    if (!active) return
    visits.value = data.visits
    document.getElementById('site-visits-container')?.classList.add('has-visits')
  } catch { visits.value = null }
})
onUnmounted(() => {
  active = false
  if (typeof document !== 'undefined') document.getElementById('site-visits-container')?.classList.remove('has-visits')
})
</script>
<template><span v-if="visits !== null" class="site-visits">本站总访问：{{ visits.toLocaleString('zh-CN') }} 次</span></template>
<style scoped>.site-visits { font-size: inherit; color: inherit; font-variant-numeric: tabular-nums; }</style>
