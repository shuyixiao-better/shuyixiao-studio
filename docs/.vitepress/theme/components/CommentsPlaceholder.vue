<template><section v-if="!route.path.includes('/tools/pandacoder-weekly/')" id="评论区" class="comments-placeholder"><RequiresBackendNotice message="评论需要主站服务，请在主站参与讨论。" hash="#评论区" /></section></template>
<script setup>
import { useRoute } from 'vitepress'
const route = useRoute()
import RequiresBackendNotice from './RequiresBackendNotice.vue'
</script>
