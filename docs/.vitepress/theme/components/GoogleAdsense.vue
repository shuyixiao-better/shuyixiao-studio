<template>
  <div class="google-adsense-wrapper">
    <ins
      class="adsbygoogle"
      style="display:block"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="fullWidthResponsive"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  adClient: {
    type: String,
    default: 'ca-pub-8453754288657802'
  },
  adSlot: {
    type: String,
    default: '1402282744'
  },
  adFormat: {
    type: String,
    default: 'auto'
  },
  fullWidthResponsive: {
    type: String,
    default: 'true'
  }
})

onMounted(() => {
  // 确保只在客户端运行
  if (typeof window !== 'undefined') {
    try {
      // 推送广告
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense 加载失败:', error)
    }
  }
})
</script>

<style scoped>
.google-adsense-wrapper {
  margin: 20px 0;
  padding: 10px 0;
  text-align: center;
}

.adsbygoogle {
  display: block;
  min-height: 100px;
}
</style>
