<template>
  <div class="code-rain-container">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>代码雨速度</label>
        <div class="slider-group">
          <input
            v-model.number="speed"
            type="range"
            min="1"
            max="20"
            step="1"
            class="slider"
          />
          <span class="slider-value">{{ speed }}</span>
        </div>
      </div>

      <div class="control-group">
        <label>代码密度</label>
        <div class="slider-group">
          <input
            v-model.number="density"
            type="range"
            min="10"
            max="50"
            step="5"
            class="slider"
          />
          <span class="slider-value">{{ density }}</span>
        </div>
      </div>

      <div class="control-group">
        <label>选择主题</label>
        <div class="theme-buttons">
          <button
            v-for="theme in themes"
            :key="theme.id"
            :class="['theme-btn', { active: currentTheme === theme.id }]"
            @click="selectTheme(theme.id)"
          >
            {{ theme.icon }} {{ theme.name }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" @click="toggleRain">
          {{ isRaining ? '⏸ 暂停' : '▶ 开始' }}
        </button>
        <button class="btn-secondary" @click="resetRain">
           重置
        </button>
        <button class="btn-secondary" @click="toggleFullscreen">
          {{ isFullscreen ? ' 退出全屏' : ' 全屏模式' }}
        </button>
      </div>
    </div>

    <!-- 代码雨画布 -->
    <div ref="canvasContainer" :class="['canvas-wrapper', { fullscreen: isFullscreen }]" @click="onCanvasClick">
      <canvas ref="canvas"></canvas>
      <div v-if="isFullscreen" class="fullscreen-tip">
        按 ESC 或点击任意位置退出全屏
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 配置
const speed = ref(10)
const density = ref(30)
const currentTheme = ref('matrix')
const isRaining = ref(false)
const isFullscreen = ref(false)

// 主题配置
const themes = [
  { id: 'matrix', name: '经典绿色', icon: '💚', bg: '#000000', primary: '#00ff00', secondary: 'rgba(0, 255, 0, 0.1)' },
  { id: 'blue', name: '蓝色科技', icon: '💙', bg: '#0a0e27', primary: '#00d9ff', secondary: 'rgba(0, 217, 255, 0.1)' },
  { id: 'red', name: '红色警戒', icon: '❤️', bg: '#1a0000', primary: '#ff0000', secondary: 'rgba(255, 0, 0, 0.1)' },
  { id: 'purple', name: '紫色梦幻', icon: '💜', bg: '#0a0015', primary: '#b300ff', secondary: 'rgba(179, 0, 255, 0.1)' },
  { id: 'gold', name: '黄金时代', icon: '💛', bg: '#1a1500', primary: '#ffd700', secondary: 'rgba(255, 215, 0, 0.1)' },
  { id: 'rainbow', name: '彩虹模式', icon: '🌈', bg: '#000000', primary: 'rainbow', secondary: 'rgba(255, 255, 255, 0.05)' }
]

// Canvas 相关
const canvas = ref(null)
const canvasContainer = ref(null)
let ctx = null
let animationId = null
let drops = []

// 字符集
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

// 获取当前主题
const getCurrentTheme = () => themes.find(t => t.id === currentTheme.value)

// 初始化 Canvas
const initCanvas = () => {
  if (!canvas.value) return
  
  const container = isFullscreen.value ? window : canvasContainer.value
  const width = isFullscreen.value ? window.innerWidth : canvasContainer.value.clientWidth
  const height = isFullscreen.value ? window.innerHeight : 400
  
  canvas.value.width = width
  canvas.value.height = height
  
  ctx = canvas.value.getContext('2d')
  
  // 设置初始黑色背景
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)
  
  // 初始化雨滴
  const columns = Math.floor(width / 20)
  drops = []
  for (let i = 0; i < columns; i++) {
    drops[i] = {
      y: Math.random() * -500,
      speed: 0.5 + Math.random() * 1.5,
      chars: []
    }
  }
}

// 帧计数器（用于定期重绘背景）
let frameCount = 0

// 绘制一帧
const draw = () => {
  if (!ctx || !canvas.value || !isRaining.value) return
  
  const theme = getCurrentTheme()
  const width = canvas.value.width
  const height = canvas.value.height
  const fontSize = 16
  const columnWidth = 20
  
  // 先确保背景是黑色，防止出现白屏
  ctx.globalCompositeOperation = 'source-over'
  
  // 每60帧完全重绘一次黑色背景，防止累积变白
  frameCount++
  if (frameCount % 60 === 0) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    frameCount = 0
  }
  
  // 使用更高不透明度的半透明黑色背景，形成自然的拖尾淡出效果
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制字符
  ctx.font = `bold ${fontSize}px 'Courier New', monospace`
  ctx.textAlign = 'center'
  
  const columns = Math.floor(width / columnWidth)
  
  for (let i = 0; i < columns; i++) {
    if (!drops[i]) {
      drops[i] = {
        y: Math.random() * -500,
        speed: 0.5 + Math.random() * 1.5,
        chars: []
      }
    }
    
    const drop = drops[i]
    
    // 随机字符
    const char = characters[Math.floor(Math.random() * characters.length)]
    
    // 计算颜色
    let color = theme.primary
    if (theme.id === 'rainbow') {
      const hue = (drop.y + i * 10) % 360
      color = `hsl(${hue}, 100%, 50%)`
    }
    
    // 解析主题颜色为RGB（用于渐变计算）
    let r, g, b
    if (theme.id === 'rainbow') {
      // 彩虹模式使用HSL
      r = g = b = 255
    } else if (color.startsWith('#')) {
      r = parseInt(color.slice(1, 3), 16)
      g = parseInt(color.slice(3, 5), 16)
      b = parseInt(color.slice(5, 7), 16)
    }
    
    // 绘制拖尾字符（先绘制，让头部在最上层）
    ctx.shadowBlur = 0
    const tailLength = Math.min(drop.chars.length, Math.floor(density.value / 5))
    for (let j = 0; j < tailLength; j++) {
      const alpha = Math.pow(1 - (j / tailLength), 2) // 使用平方衰减，让拖尾更自然
      const yPos = drop.y - (j + 1) * fontSize
      
      if (yPos > 0 && yPos < height) {
        if (theme.id === 'rainbow') {
          const hue = ((drop.y - j * fontSize) + i * 10) % 360
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha * 0.7})`
        } else {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`
        }
        ctx.fillText(drop.chars[j], i * columnWidth + columnWidth / 2, yPos)
      }
    }
    
    // 绘制发光的头部字符
    if (drop.y > 0 && drop.y < height) {
      ctx.shadowBlur = 15
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.fillText(char, i * columnWidth + columnWidth / 2, drop.y)
      
      // 绘制额外的亮白色头部（让头部更亮）
      ctx.shadowBlur = 8
      ctx.shadowColor = '#ffffff'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(char, i * columnWidth + columnWidth / 2, drop.y)
    }
    
    // 更新位置
    drop.y += drop.speed * (speed.value / 5)
    
    // 更新字符历史
    drop.chars.unshift(char)
    if (drop.chars.length > density.value / 5) {
      drop.chars.pop()
    }
    
    // 重置到顶部
    if (drop.y > height + 50) {
      if (Math.random() > 0.975) {
        drop.y = Math.random() * -500
        drop.speed = 0.5 + Math.random() * 1.5
        drop.chars = []
      }
    }
  }
  
  animationId = requestAnimationFrame(draw)
}

// 开始/暂停
const toggleRain = () => {
  isRaining.value = !isRaining.value
  if (isRaining.value) {
    frameCount = 0 // 重置帧计数
    draw()
  } else {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }
}

// 重置
const resetRain = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  isRaining.value = false
  frameCount = 0 // 重置帧计数
  
  // 清空画布，确保是黑色背景
  if (ctx && canvas.value) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  }
  
  initCanvas()
}

// 选择主题
const selectTheme = (themeId) => {
  currentTheme.value = themeId
  resetRain()
}

// 全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  frameCount = 0 // 重置帧计数
  
  // 全屏时给body添加黑色背景，防止白屏
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
    document.body.style.backgroundColor = '#000000'
  } else {
    document.body.style.overflow = ''
    document.body.style.backgroundColor = ''
  }
  
  nextTick(() => {
    initCanvas()
    if (isRaining.value) {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      draw()
    }
  })
}

// 点击退出全屏
const onCanvasClick = () => {
  if (isFullscreen.value) {
    toggleFullscreen()
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (isFullscreen.value) {
    const wasRaining = isRaining.value
    frameCount = 0 // 重置帧计数
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    initCanvas()
    if (wasRaining) {
      isRaining.value = true
      draw()
    }
  }
}

// 监听 ESC 键
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

// 监听速度和密度变化
watch([speed, density], () => {
  if (isRaining.value) {
    // 无需重置，直接应用新参数
  }
})

// 生命周期
onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
  
  // 清理body样式
  document.body.style.overflow = ''
  document.body.style.backgroundColor = ''
})
</script>

<style scoped>
.code-rain-container {
  max-width: var(--ui-size-1200);
  margin: var(--sp-32) auto;
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  border: var(--ui-border) solid var(--vp-c-divider);
  box-shadow: none;
}

.control-panel {
  margin-bottom: var(--sp-32);
}

.control-group {
  margin-bottom: var(--sp-24);
}

.control-group label {
  display: block;
  margin-bottom: var(--sp-12);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
}

.slider-group {
  display: flex;
  align-items: center;
  gap: var(--sp-16);
}

.slider {
  flex: 1;
  height: var(--sp-8);
  border-radius: var(--ui-radius-input);
  outline: none;
  -webkit-appearance: none;
  background: var(--vp-c-divider);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--sp-20);
  height: var(--sp-20);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  box-shadow: none;
}

.slider::-moz-range-thumb {
  width: var(--sp-20);
  height: var(--sp-20);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  border: none;
  box-shadow: none;
}

.slider-value {
  min-width: var(--sp-32);
  text-align: center;
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-brand-1);
}

.theme-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--sp-120), 1fr));
  gap: var(--sp-12);
}

.theme-btn {
  padding: var(--sp-12) var(--sp-16);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  cursor: pointer;
  transition: var(--ui-transition);
  white-space: nowrap;
  text-align: center;
}

.theme-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.theme-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  box-shadow: none;
}

.action-buttons {
  display: flex;
  gap: var(--sp-16);
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  min-width: var(--sp-120);
  padding: var(--sp-12) var(--sp-24);
  border: none;
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  cursor: pointer;
  transition: var(--ui-transition);
  white-space: nowrap;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: var(--ui-on-brand);
  box-shadow: none;
}

.btn-primary:hover {
  box-shadow: none;
}

.btn-secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: var(--ui-focus) solid var(--vp-c-brand-1);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  box-shadow: none;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: var(--ui-size-400);
  border-radius: var(--ui-radius-input);
  overflow: hidden;
  box-shadow: none;
  background: var(--vp-c-bg-soft);
}

.canvas-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
  padding: 0;
  z-index: 99999;
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  background-color: var(--vp-c-bg-soft);
  box-shadow: none;
}

.canvas-wrapper.fullscreen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vp-c-bg-soft);
  z-index: -1;
}

.canvas-wrapper canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: var(--vp-c-bg-soft);
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

.fullscreen-tip {
  position: absolute;
  top: var(--sp-32);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--sp-16) var(--sp-32);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  font-family: 'Courier New', monospace;
  box-shadow: none;
  z-index: 1000;
  pointer-events: none;
  letter-spacing: normal;
}

@media (max-width: 768px) {
  .code-rain-container {
    padding: var(--sp-24);
  }
  
  .theme-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-8);
  }
  
  .theme-btn {
    padding: var(--sp-8) var(--sp-12);
    font-size: var(--ui-text-meta);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .canvas-wrapper {
    height: var(--ui-size-300);
  }
  
  .fullscreen-tip {
    top: var(--sp-20);
    padding: var(--sp-12) var(--sp-24);
    font-size: var(--ui-text-sm);
    max-width: 90%;
  }
}
</style>

