<template>
  <div class="bilibili-video-container">
    <div class="video-wrapper" :style="wrapperStyle">
      <iframe
        :src="embedUrl"
        :width="width"
        :height="height"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      ></iframe>
    </div>
    <div v-if="title" class="video-title">{{ title }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // B站视频链接或BV号
  // 支持格式：
  // - 完整链接：https://www.bilibili.com/video/BV18VKhziE59/
  // - BV号：BV18VKhziE59
  url: {
    type: String,
    required: true
  },
  // 视频标题（可选）
  title: {
    type: String,
    default: ''
  },
  // 视频宽度（可选，默认100%）
  width: {
    type: [String, Number],
    default: '100%'
  },
  // 视频高度（可选，默认auto，根据16:9计算）
  height: {
    type: [String, Number],
    default: 'auto'
  },
  // 是否自动播放（默认false）
  autoplay: {
    type: Boolean,
    default: false
  },
  // 视频分P（默认1）
  page: {
    type: Number,
    default: 1
  }
})

// 从URL中提取BV号
const extractBvid = (url) => {
  if (!url) return ''
  
  // 如果直接是BV号
  if (url.startsWith('BV')) {
    return url
  }
  
  // 从完整URL中提取BV号
  const match = url.match(/BV[\w]+/)
  return match ? match[0] : ''
}

// 生成B站嵌入式播放器URL
const embedUrl = computed(() => {
  const bvid = extractBvid(props.url)
  if (!bvid) {
    console.warn('无法从URL中提取BV号:', props.url)
    return ''
  }
  
  const params = new URLSearchParams({
    bvid: bvid,
    page: props.page,
    high_quality: 1,
    danmaku: 0, // 默认关闭弹幕
    autoplay: props.autoplay ? 1 : 0
  })
  
  return `https://player.bilibili.com/player.html?${params.toString()}`
})

// 容器样式
const wrapperStyle = computed(() => {
  const style = {}
  
  // 如果高度是auto，使用16:9比例
  if (props.height === 'auto') {
    style.position = 'relative'
    style.paddingBottom = '56.25%' // 16:9 = 9/16 = 0.5625 = 56.25%
    style.height = '0'
    style.overflow = 'hidden'
  }
  
  return style
})
</script>

<style scoped>
.bilibili-video-container {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.bilibili-video-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.video-wrapper {
  width: 100%;
  background: #000;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* 当height不是auto时的样式 */
.video-wrapper:not([style*="position: relative"]) iframe {
  position: static;
}

.video-title {
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  border-top: 1px solid var(--vp-c-divider);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bilibili-video-container {
    margin: 15px -24px;
    border-radius: 0;
  }
  
  .video-title {
    font-size: 13px;
    padding: 10px 14px;
  }
}

/* 暗色主题适配 */
.dark .bilibili-video-container {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.dark .bilibili-video-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}
</style>

