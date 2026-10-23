<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { primaryUrl } from '../utils/deploy-env.js'
const props = defineProps({ message: { type: String, default: '此功能需要主站服务，请在主站继续使用。' }, hash: { type: String, default: '' } })
const route = useRoute()
const url = computed(() => primaryUrl(route.path) + props.hash)
</script>
<template>
  <aside class="requires-backend-notice" aria-label="主站功能提示">
    <p>{{ message }}</p>
    <a class="ui-button secondary" :href="url">在主站打开 →</a>
  </aside>
</template>
