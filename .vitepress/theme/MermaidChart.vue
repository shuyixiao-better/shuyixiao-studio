<template>
  <div class="mermaid-chart" ref="chartRef">
    <div ref="mermaidContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  id: {
    type: String,
    default: () => `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
})

const chartRef = ref(null)
const mermaidContainer = ref(null)

const renderChart = async () => {
  if (typeof window === 'undefined' || !window.mermaid || !mermaidContainer.value) {
    return
  }

  try {
    const { svg } = await window.mermaid.render(props.id, props.code)
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = svg
    }
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = `<div class="error">图表渲染失败: ${error.message}</div>`
    }
  }
}

onMounted(async () => {
  // 等待 mermaid 加载
  let attempts = 0
  const maxAttempts = 100
  
  const waitForMermaid = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (window.mermaid) {
          resolve(true)
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(check, 50)
        } else {
          resolve(false)
        }
      }
      check()
    })
  }
  
  const loaded = await waitForMermaid()
  if (loaded) {
    await renderChart()
  }
})

watch(() => props.code, () => {
  renderChart()
})
</script>

<style scoped>
.mermaid-chart {
  margin: 2rem 0;
  padding: 2rem 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.dark .mermaid-chart {
  background: #1e1e1e;
}

.error {
  color: #ef4444;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 4px;
}

.dark .error {
  background: #450a0a;
  color: #fca5a5;
}
</style>

