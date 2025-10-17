<template>
  <div class="avatar-generator">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="input-group">
        <label for="avatar-input">输入文本（可选）</label>
        <input
          id="avatar-input"
          v-model="inputText"
          type="text"
          placeholder="输入名字或任意文本..."
          @input="generateAvatar"
        />
      </div>

      <div class="style-selector">
        <label>选择风格</label>
        <div class="style-buttons">
          <button
            v-for="style in avatarStyles"
            :key="style.id"
            :class="['style-btn', { active: currentStyle === style.id }]"
            @click="selectStyle(style.id)"
          >
            {{ style.icon }} {{ style.name }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" @click="randomGenerate">
          🎲 随机生成
        </button>
        <button class="btn-secondary" @click="downloadAvatar">
          💾 下载头像
        </button>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-section">
      <div class="avatar-preview" ref="avatarContainer">
        <svg
          :width="avatarSize"
          :height="avatarSize"
          :viewBox="`0 0 ${avatarSize} ${avatarSize}`"
          xmlns="http://www.w3.org/2000/svg"
        >
          <component :is="currentAvatarComponent" :seed="seed" :size="avatarSize" />
        </svg>
      </div>
      <p class="preview-label">预览 ({{ avatarSize }}x{{ avatarSize }})</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

// 配置
const avatarSize = 256
const inputText = ref('')
const currentStyle = ref('geometric')
const seed = ref(Math.random().toString(36).substring(7))

// 头像风格配置
const avatarStyles = [
  { id: 'geometric', name: '简约几何', icon: '🔷' },
  { id: 'colorful', name: '彩色图形', icon: '🎨' },
  { id: 'pixel', name: '像素艺术', icon: '🟦' },
  { id: 'gradient', name: '渐变圆形', icon: '🌈' }
]

// 生成哈希值
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 生成随机颜色
const generateColor = (seedStr, index) => {
  const hash = hashCode(seedStr + index)
  const hue = hash % 360
  const saturation = 60 + (hash % 30)
  const lightness = 50 + (hash % 20)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// 简约几何风格
const GeometricAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const bgColor = generateColor(seed, 0)
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: bgColor
    })
  )
  
  // 生成几何形状
  for (let i = 0; i < 5; i++) {
    const x = (hash * (i + 1)) % size
    const y = (hash * (i + 2)) % size
    const r = 20 + (hash * (i + 3)) % 40
    const color = generateColor(seed, i + 1)
    const opacity = 0.6 + ((hash * (i + 1)) % 40) / 100
    
    const shapeType = (hash + i) % 3
    if (shapeType === 0) {
      shapes.push(
        h('circle', {
          cx: x,
          cy: y,
          r: r,
          fill: color,
          opacity: opacity
        })
      )
    } else if (shapeType === 1) {
      shapes.push(
        h('rect', {
          x: x - r,
          y: y - r,
          width: r * 2,
          height: r * 2,
          fill: color,
          opacity: opacity,
          transform: `rotate(${(hash * i) % 360} ${x} ${y})`
        })
      )
    } else {
      const points = `${x},${y - r} ${x + r},${y + r} ${x - r},${y + r}`
      shapes.push(
        h('polygon', {
          points: points,
          fill: color,
          opacity: opacity
        })
      )
    }
  }
  
  return h('g', shapes)
}

// 彩色图形风格（类似jdenticon）
const ColorfulAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const cellSize = size / 5
  const bgColor = generateColor(seed, 0)
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#f0f0f0'
    })
  )
  
  // 对称图案
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      const index = y * 3 + x
      const shouldFill = (hash >> index) & 1
      
      if (shouldFill) {
        const color = generateColor(seed, index % 4 + 1)
        
        // 左侧
        shapes.push(
          h('rect', {
            x: x * cellSize,
            y: y * cellSize,
            width: cellSize,
            height: cellSize,
            fill: color
          })
        )
        
        // 右侧对称
        if (x < 2) {
          shapes.push(
            h('rect', {
              x: (4 - x) * cellSize,
              y: y * cellSize,
              width: cellSize,
              height: cellSize,
              fill: color
            })
          )
        }
      }
    }
  }
  
  return h('g', shapes)
}

// 像素艺术风格
const PixelAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const pixelSize = size / 8
  const colors = [
    generateColor(seed, 1),
    generateColor(seed, 2),
    generateColor(seed, 3),
    generateColor(seed, 4)
  ]
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#ffffff'
    })
  )
  
  // 8x8像素网格
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const index = y * 8 + x
      const value = (hash >> (index % 20)) & 3
      
      if (value > 0) {
        shapes.push(
          h('rect', {
            x: x * pixelSize,
            y: y * pixelSize,
            width: pixelSize,
            height: pixelSize,
            fill: colors[value - 1],
            stroke: 'rgba(0,0,0,0.1)',
            'stroke-width': 1
          })
        )
      }
    }
  }
  
  return h('g', shapes)
}

// 渐变圆形风格（类似boring-avatars）
const GradientAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const colors = [
    generateColor(seed, 1),
    generateColor(seed, 2),
    generateColor(seed, 3),
    generateColor(seed, 4)
  ]
  
  // 渐变定义
  const gradientId = `gradient-${seed}`
  shapes.push(
    h('defs', [
      h('linearGradient', {
        id: gradientId,
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%'
      }, [
        h('stop', {
          offset: '0%',
          'stop-color': colors[0]
        }),
        h('stop', {
          offset: '50%',
          'stop-color': colors[1]
        }),
        h('stop', {
          offset: '100%',
          'stop-color': colors[2]
        })
      ])
    ])
  )
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: `url(#${gradientId})`
    })
  )
  
  // 装饰圆形
  for (let i = 0; i < 4; i++) {
    const x = ((hash * (i + 1)) % size + size) % size
    const y = ((hash * (i + 2)) % size + size) % size
    const r = 30 + (hash * (i + 3)) % 60
    
    shapes.push(
      h('circle', {
        cx: x,
        cy: y,
        r: r,
        fill: colors[(i + 1) % colors.length],
        opacity: 0.3 + ((hash * i) % 30) / 100
      })
    )
  }
  
  return h('g', shapes)
}

// 当前头像组件
const currentAvatarComponent = computed(() => {
  const components = {
    geometric: GeometricAvatar,
    colorful: ColorfulAvatar,
    pixel: PixelAvatar,
    gradient: GradientAvatar
  }
  return components[currentStyle.value] || GeometricAvatar
})

// 生成头像
const generateAvatar = () => {
  if (inputText.value) {
    seed.value = inputText.value
  }
}

// 随机生成
const randomGenerate = () => {
  inputText.value = ''
  seed.value = Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 选择风格
const selectStyle = (styleId) => {
  currentStyle.value = styleId
}

// 下载头像
const downloadAvatar = () => {
  const svg = document.querySelector('.avatar-preview svg')
  if (!svg) return
  
  const svgData = new XMLSerializer().serializeToString(svg)
  const canvas = document.createElement('canvas')
  canvas.width = avatarSize * 2
  canvas.height = avatarSize * 2
  const ctx = canvas.getContext('2d')
  
  const img = new Image()
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      const link = document.createElement('a')
      link.download = `avatar-${seed.value}.png`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(url)
    })
  }
  
  img.src = url
}
</script>

<style scoped>
.avatar-generator {
  max-width: 900px;
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

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.1);
}

.style-selector {
  margin-bottom: 1.5rem;
}

.style-selector label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.style-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.style-btn {
  padding: 0.65rem 1.25rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.style-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.style-btn.active {
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
  min-width: 150px;
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

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: var(--vp-c-bg);
  border-radius: 20px;
  border: 2px dashed var(--vp-c-divider);
}

.avatar-preview {
  width: 256px;
  height: 256px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.avatar-preview svg {
  display: block;
  width: 100%;
  height: 100%;
}

.preview-label {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@media (max-width: 768px) {
  .avatar-generator {
    padding: 1.5rem;
  }
  
  .style-buttons {
    gap: 0.5rem;
  }
  
  .style-btn {
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .avatar-preview {
    width: 200px;
    height: 200px;
  }
}
</style>

