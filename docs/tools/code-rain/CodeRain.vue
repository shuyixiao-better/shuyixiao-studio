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
          {{ isRaining ? '⏸️ 暂停' : '▶️ 开始' }}
        </button>
        <button class="btn-secondary" @click="resetRain">
          🔄 重置
        </button>
        <button class="btn-secondary" @click="toggleFullscreen">
          {{ isFullscreen ? '🔙 退出全屏' : '🖥️ 全屏模式' }}
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
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.control-panel {
  margin-bottom: 2rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  background: var(--vp-c-divider);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(62, 175, 124, 0.4);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(62, 175, 124, 0.4);
}

.slider-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.theme-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.theme-btn {
  padding: 0.65rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-align: center;
}

.theme-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.theme-btn.active {
  border-color: var(--vp-c-brand-1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  min-width: 120px;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  box-shadow: 0 6px 20px rgba(62, 175, 124, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(62, 175, 124, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-brand-1);
}

.btn-secondary:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(62, 175, 124, 0.3);
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  background: #000000;
}

.canvas-wrapper.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 99999 !important;
  border-radius: 0 !important;
  cursor: pointer;
  background-color: #000000 !important;
  box-shadow: none !important;
}

.canvas-wrapper.fullscreen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  z-index: -1;
}

.canvas-wrapper canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000000;
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

.fullscreen-tip {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  border: 2px solid #00ff00;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1);
  animation: fadeInOut 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
  z-index: 1000;
  pointer-events: none;
  letter-spacing: 1px;
}

@keyframes fadeInOut {
  0%, 100% { 
    opacity: 0.4; 
    transform: translateX(-50%) scale(0.98);
  }
  50% { 
    opacity: 1; 
    transform: translateX(-50%) scale(1);
  }
}

@media (max-width: 768px) {
  .code-rain-container {
    padding: 1.5rem;
  }
  
  .theme-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .theme-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .canvas-wrapper {
    height: 300px;
  }
  
  .fullscreen-tip {
    top: 20px;
    padding: 0.75rem 1.5rem;
    font-size: 0.85rem;
    max-width: 90%;
  }
}
</style>

