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
            {{ style.name }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" @click="randomGenerate">
           随机生成
        </button>
        <button class="btn-secondary" @click="downloadAvatar">
           下载头像
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
  { id: 'gradient', name: '渐变圆形', icon: '🌈' },
  { id: 'duck', name: '无聊鸭', icon: '🦆' },
  { id: 'monster', name: '像素怪兽', icon: '👾' },
  { id: 'abstract', name: '抽象艺术', icon: '🎭' },
  { id: 'retro', name: '复古阿呆', icon: '🤖' },
  { id: 'smile', name: '简单微笑', icon: '😊' },
  { id: 'rings', name: '同心圆环', icon: '⭕' },
  { id: 'bacteria', name: '幽菌怪', icon: '🦠' },
  { id: 'mandala', name: '曼陀罗', icon: '🌸' },
  { id: 'polygon', name: '低多边形', icon: '💎' },
  { id: 'wave', name: '波浪纹理', icon: '🌊' },
  { id: 'mosaic', name: '马赛克', icon: '🎲' },
  { id: 'circuit', name: '电路板', icon: '⚡' },
  { id: 'galaxy', name: '星系', icon: '🌌' },
  { id: 'crystal', name: '水晶', icon: '💠' },
  { id: 'tribal', name: '部落图腾', icon: '🗿' },
  { id: 'neon', name: '霓虹灯', icon: '🔮' },
  { id: 'origami', name: '折纸', icon: '🎴' },
  { id: 'glitch', name: '故障艺术', icon: '📺' }
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

// 无聊鸭风格
const DuckAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 背景色
  const bgColors = ['#FFE5B4', '#FFD700', '#FFA500', '#87CEEB', '#98FB98']
  const bgColor = bgColors[hash % bgColors.length]
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: bgColor
    })
  )
  
  // 鸭子身体 - 椭圆
  const bodyColor = '#FFD700'
  const bodyX = size / 2
  const bodyY = size * 0.6
  const bodyRx = size * 0.25
  const bodyRy = size * 0.3
  
  shapes.push(
    h('ellipse', {
      cx: bodyX,
      cy: bodyY,
      rx: bodyRx,
      ry: bodyRy,
      fill: bodyColor,
      stroke: '#FFA500',
      'stroke-width': 3
    })
  )
  
  // 鸭子头部
  const headX = bodyX + (hash % 20 - 10)
  const headY = bodyY - size * 0.25
  const headR = size * 0.15
  
  shapes.push(
    h('circle', {
      cx: headX,
      cy: headY,
      r: headR,
      fill: bodyColor,
      stroke: '#FFA500',
      'stroke-width': 3
    })
  )
  
  // 鸭嘴
  const beakColor = '#FF6347'
  shapes.push(
    h('ellipse', {
      cx: headX + headR * 0.6,
      cy: headY,
      rx: headR * 0.5,
      ry: headR * 0.3,
      fill: beakColor
    })
  )
  
  // 眼睛
  const eyeX = headX - headR * 0.3
  const eyeY = headY - headR * 0.2
  
  shapes.push(
    h('circle', {
      cx: eyeX,
      cy: eyeY,
      r: headR * 0.15,
      fill: '#000000'
    })
  )
  
  // 翅膀
  shapes.push(
    h('ellipse', {
      cx: bodyX - bodyRx * 0.7,
      cy: bodyY,
      rx: bodyRx * 0.4,
      ry: bodyRy * 0.6,
      fill: '#FFA500',
      opacity: 0.8,
      transform: `rotate(-30 ${bodyX - bodyRx * 0.7} ${bodyY})`
    })
  )
  
  return h('g', shapes)
}

// 像素怪兽风格
const MonsterAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const pixelSize = size / 12
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#1a1a2e'
    })
  )
  
  // 怪兽颜色
  const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b']
  const monsterColor = colors[hash % colors.length]
  
  // 怪兽身体模式 - 对称像素
  const pattern = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,0,0,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,0,0,1,0,0]
  ]
  
  pattern.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel) {
        const centerX = (12 - 8) / 2
        const centerY = 2
        
        shapes.push(
          h('rect', {
            x: (centerX + x) * pixelSize,
            y: (centerY + y) * pixelSize,
            width: pixelSize,
            height: pixelSize,
            fill: monsterColor,
            stroke: '#000',
            'stroke-width': 1
          })
        )
        
        // 对称
        if (x < 4) {
          shapes.push(
            h('rect', {
              x: (centerX + (7 - x)) * pixelSize,
              y: (centerY + y) * pixelSize,
              width: pixelSize,
              height: pixelSize,
              fill: monsterColor,
              stroke: '#000',
              'stroke-width': 1
            })
          )
        }
      }
    })
  })
  
  return h('g', shapes)
}

// 抽象艺术风格
const AbstractAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 渐变背景
  const gradientId = `abstract-gradient-${seed}`
  const color1 = generateColor(seed, 1)
  const color2 = generateColor(seed, 2)
  
  shapes.push(
    h('defs', [
      h('linearGradient', {
        id: gradientId,
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%'
      }, [
        h('stop', { offset: '0%', 'stop-color': color1 }),
        h('stop', { offset: '100%', 'stop-color': color2 })
      ])
    ])
  )
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: `url(#${gradientId})`
    })
  )
  
  // 抽象曲线
  for (let i = 0; i < 8; i++) {
    const x1 = ((hash * (i + 1)) % size + size) % size
    const y1 = ((hash * (i + 2)) % size + size) % size
    const x2 = ((hash * (i + 3)) % size + size) % size
    const y2 = ((hash * (i + 4)) % size + size) % size
    const cx = ((hash * (i + 5)) % size + size) % size
    const cy = ((hash * (i + 6)) % size + size) % size
    
    const path = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`
    
    shapes.push(
      h('path', {
        d: path,
        stroke: generateColor(seed, i + 3),
        'stroke-width': 3 + (hash * i) % 5,
        fill: 'none',
        opacity: 0.7
      })
    )
  }
  
  return h('g', shapes)
}

// 复古阿呆风格
const RetroAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 复古背景色
  const bgColors = ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#264653']
  const bgColor = bgColors[hash % bgColors.length]
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: bgColor
    })
  )
  
  // 脸部 - 圆形
  const faceColor = '#ffb4a2'
  const faceX = size / 2
  const faceY = size / 2
  const faceR = size * 0.35
  
  shapes.push(
    h('circle', {
      cx: faceX,
      cy: faceY,
      r: faceR,
      fill: faceColor,
      stroke: '#000',
      'stroke-width': 3
    })
  )
  
  // 眼睛
  const eyeY = faceY - faceR * 0.2
  const eyeR = faceR * 0.15
  
  // 左眼
  shapes.push(
    h('circle', {
      cx: faceX - faceR * 0.35,
      cy: eyeY,
      r: eyeR,
      fill: '#ffffff',
      stroke: '#000',
      'stroke-width': 2
    })
  )
  shapes.push(
    h('circle', {
      cx: faceX - faceR * 0.35,
      cy: eyeY,
      r: eyeR * 0.5,
      fill: '#000'
    })
  )
  
  // 右眼
  shapes.push(
    h('circle', {
      cx: faceX + faceR * 0.35,
      cy: eyeY,
      r: eyeR,
      fill: '#ffffff',
      stroke: '#000',
      'stroke-width': 2
    })
  )
  shapes.push(
    h('circle', {
      cx: faceX + faceR * 0.35,
      cy: eyeY,
      r: eyeR * 0.5,
      fill: '#000'
    })
  )
  
  // 嘴巴 - 弧线
  const mouthY = faceY + faceR * 0.3
  const mouthPath = `M ${faceX - faceR * 0.3},${mouthY} Q ${faceX},${mouthY + faceR * 0.2} ${faceX + faceR * 0.3},${mouthY}`
  
  shapes.push(
    h('path', {
      d: mouthPath,
      stroke: '#000',
      'stroke-width': 3,
      fill: 'none'
    })
  )
  
  // 腮红
  shapes.push(
    h('circle', {
      cx: faceX - faceR * 0.6,
      cy: faceY + faceR * 0.1,
      r: faceR * 0.15,
      fill: '#ff6b9d',
      opacity: 0.5
    })
  )
  shapes.push(
    h('circle', {
      cx: faceX + faceR * 0.6,
      cy: faceY + faceR * 0.1,
      r: faceR * 0.15,
      fill: '#ff6b9d',
      opacity: 0.5
    })
  )
  
  return h('g', shapes)
}

// 简单微笑风格
const SmileAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const colors = [
    generateColor(seed, 1),
    generateColor(seed, 2),
    generateColor(seed, 3)
  ]
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: colors[0]
    })
  )
  
  // 脸部 - 大圆
  const faceX = size / 2
  const faceY = size / 2
  const faceR = size * 0.4
  
  shapes.push(
    h('circle', {
      cx: faceX,
      cy: faceY,
      r: faceR,
      fill: colors[1],
      stroke: colors[2],
      'stroke-width': 4
    })
  )
  
  // 眼睛 - 简单的点
  const eyeY = faceY - faceR * 0.15
  const eyeR = faceR * 0.08
  
  shapes.push(
    h('circle', {
      cx: faceX - faceR * 0.3,
      cy: eyeY,
      r: eyeR,
      fill: colors[2]
    })
  )
  
  shapes.push(
    h('circle', {
      cx: faceX + faceR * 0.3,
      cy: eyeY,
      r: eyeR,
      fill: colors[2]
    })
  )
  
  // 微笑 - 弧形
  const mouthY = faceY + faceR * 0.15
  const mouthPath = `M ${faceX - faceR * 0.35},${mouthY} Q ${faceX},${mouthY + faceR * 0.25} ${faceX + faceR * 0.35},${mouthY}`
  
  shapes.push(
    h('path', {
      d: mouthPath,
      stroke: colors[2],
      'stroke-width': 4,
      fill: 'none',
      'stroke-linecap': 'round'
    })
  )
  
  return h('g', shapes)
}

// 同心圆环风格
const RingsAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const centerX = size / 2
  const centerY = size / 2
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: generateColor(seed, 0)
    })
  )
  
  // 绘制多个同心圆
  const ringCount = 6 + (hash % 4)
  const maxRadius = size * 0.45
  
  for (let i = 0; i < ringCount; i++) {
    const radius = maxRadius * (ringCount - i) / ringCount
    const color = generateColor(seed, i + 1)
    const strokeWidth = maxRadius / ringCount * 0.8
    
    shapes.push(
      h('circle', {
        cx: centerX,
        cy: centerY,
        r: radius,
        fill: 'none',
        stroke: color,
        'stroke-width': strokeWidth,
        opacity: 0.8
      })
    )
  }
  
  // 中心点
  shapes.push(
    h('circle', {
      cx: centerX,
      cy: centerY,
      r: size * 0.05,
      fill: generateColor(seed, ringCount + 1)
    })
  )
  
  return h('g', shapes)
}

// 幽菌怪风格
const BacteriaAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 深色背景
  const bgColors = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#1e3d59']
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: bgColors[hash % bgColors.length]
    })
  )
  
  // 生成多个细菌形状
  const bacteriaCount = 3 + (hash % 3)
  
  for (let i = 0; i < bacteriaCount; i++) {
    const centerX = ((hash * (i + 1) * 73) % (size * 0.6)) + size * 0.2
    const centerY = ((hash * (i + 2) * 97) % (size * 0.6)) + size * 0.2
    const color = generateColor(seed, i + 1)
    const bodyR = 30 + ((hash * (i + 1)) % 40)
    
    // 细菌主体 - 不规则形状
    const blobPath = []
    const points = 8
    for (let j = 0; j < points; j++) {
      const angle = (j / points) * Math.PI * 2
      const r = bodyR + ((hash * (i + j)) % 20) - 10
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r
      blobPath.push(`${j === 0 ? 'M' : 'L'} ${x},${y}`)
    }
    blobPath.push('Z')
    
    shapes.push(
      h('path', {
        d: blobPath.join(' '),
        fill: color,
        opacity: 0.8,
        stroke: color,
        'stroke-width': 2,
        filter: 'url(#glow)'
      })
    )
    
    // 细菌触须
    const tentacles = 3 + ((hash * i) % 3)
    for (let t = 0; t < tentacles; t++) {
      const angle = ((hash * (i + t)) % 360) * Math.PI / 180
      const length = 20 + ((hash * (t + 1)) % 30)
      const endX = centerX + Math.cos(angle) * (bodyR + length)
      const endY = centerY + Math.sin(angle) * (bodyR + length)
      
      shapes.push(
        h('line', {
          x1: centerX + Math.cos(angle) * bodyR,
          y1: centerY + Math.sin(angle) * bodyR,
          x2: endX,
          y2: endY,
          stroke: color,
          'stroke-width': 3,
          'stroke-linecap': 'round',
          opacity: 0.7
        })
      )
      
      // 触须末端圆点
      shapes.push(
        h('circle', {
          cx: endX,
          cy: endY,
          r: 4,
          fill: color,
          opacity: 0.9
        })
      )
    }
    
    // 细菌内部斑点
    const spots = 2 + ((hash * i) % 3)
    for (let s = 0; s < spots; s++) {
      const spotX = centerX + ((hash * (i + s + 10)) % (bodyR * 1.2)) - bodyR * 0.6
      const spotY = centerY + ((hash * (i + s + 20)) % (bodyR * 1.2)) - bodyR * 0.6
      shapes.push(
        h('circle', {
          cx: spotX,
          cy: spotY,
          r: 5 + ((hash * s) % 8),
          fill: '#ffffff',
          opacity: 0.3
        })
      )
    }
  }
  
  // 添加发光效果定义
  shapes.unshift(
    h('defs', [
      h('filter', { id: 'glow' }, [
        h('feGaussianBlur', { stdDeviation: '3', result: 'coloredBlur' }),
        h('feMerge', {}, [
          h('feMergeNode', { in: 'coloredBlur' }),
          h('feMergeNode', { in: 'SourceGraphic' })
        ])
      ])
    ])
  )
  
  return h('g', shapes)
}

// 曼陀罗风格
const MandalaAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const centerX = size / 2
  const centerY = size / 2
  
  // 渐变背景
  const gradientId = `mandala-gradient-${seed}`
  shapes.push(
    h('defs', [
      h('radialGradient', { id: gradientId }, [
        h('stop', { offset: '0%', 'stop-color': generateColor(seed, 1) }),
        h('stop', { offset: '100%', 'stop-color': generateColor(seed, 2) })
      ])
    ])
  )
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: `url(#${gradientId})`
    })
  )
  
  // 绘制多层曼陀罗图案
  const layers = 6
  const symmetry = 8 // 8重对称
  
  for (let layer = 0; layer < layers; layer++) {
    const radius = (size * 0.45) * (layer + 1) / layers
    const color = generateColor(seed, layer + 3)
    
    // 对称花瓣
    for (let i = 0; i < symmetry; i++) {
      const angle = (i / symmetry) * Math.PI * 2
      const nextAngle = ((i + 1) / symmetry) * Math.PI * 2
      
      // 花瓣形状
      const petalPath = `
        M ${centerX},${centerY}
        L ${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}
        Q ${centerX + Math.cos((angle + nextAngle) / 2) * radius * 1.2},${centerY + Math.sin((angle + nextAngle) / 2) * radius * 1.2}
        ${centerX + Math.cos(nextAngle) * radius},${centerY + Math.sin(nextAngle) * radius}
        Z
      `
      
      shapes.push(
        h('path', {
          d: petalPath,
          fill: color,
          opacity: 0.3 + (layer * 0.1),
          stroke: color,
          'stroke-width': 1
        })
      )
      
      // 装饰圆点
      shapes.push(
        h('circle', {
          cx: centerX + Math.cos(angle) * radius,
          cy: centerY + Math.sin(angle) * radius,
          r: 3 + layer,
          fill: generateColor(seed, layer + 10),
          opacity: 0.8
        })
      )
    }
  }
  
  // 中心装饰
  shapes.push(
    h('circle', {
      cx: centerX,
      cy: centerY,
      r: 15,
      fill: generateColor(seed, 20),
      stroke: '#ffffff',
      'stroke-width': 2
    })
  )
  
  return h('g', shapes)
}

// 低多边形风格
const PolygonAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 背景色
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: generateColor(seed, 0)
    })
  )
  
  // 生成随机三角形网格
  const triangleCount = 15 + (hash % 10)
  
  for (let i = 0; i < triangleCount; i++) {
    const x1 = ((hash * (i * 3 + 1)) % size + size) % size
    const y1 = ((hash * (i * 3 + 2)) % size + size) % size
    const x2 = ((hash * (i * 3 + 3)) % size + size) % size
    const y2 = ((hash * (i * 3 + 4)) % size + size) % size
    const x3 = ((hash * (i * 3 + 5)) % size + size) % size
    const y3 = ((hash * (i * 3 + 6)) % size + size) % size
    
    const points = `${x1},${y1} ${x2},${y2} ${x3},${y3}`
    const color = generateColor(seed, i + 1)
    
    shapes.push(
      h('polygon', {
        points: points,
        fill: color,
        opacity: 0.7,
        stroke: '#ffffff',
        'stroke-width': 2,
        'stroke-linejoin': 'round'
      })
    )
  }
  
  return h('g', shapes)
}

// 波浪纹理风格
const WaveAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 渐变背景
  const gradientId = `wave-gradient-${seed}`
  shapes.push(
    h('defs', [
      h('linearGradient', { id: gradientId, x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, [
        h('stop', { offset: '0%', 'stop-color': generateColor(seed, 1) }),
        h('stop', { offset: '100%', 'stop-color': generateColor(seed, 2) })
      ])
    ])
  )
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: `url(#${gradientId})`
    })
  )
  
  // 绘制多层波浪
  const waveCount = 8
  const waveHeight = size / waveCount
  
  for (let i = 0; i < waveCount; i++) {
    const y = i * waveHeight
    const amplitude = 15 + ((hash * (i + 1)) % 20)
    const frequency = 2 + ((hash * (i + 2)) % 3)
    const color = generateColor(seed, i + 3)
    
    // 创建波浪路径
    let wavePath = `M 0,${y + waveHeight / 2}`
    
    for (let x = 0; x <= size; x += 5) {
      const waveY = y + waveHeight / 2 + Math.sin((x / size) * Math.PI * frequency + (hash * i) % 360) * amplitude
      wavePath += ` L ${x},${waveY}`
    }
    
    wavePath += ` L ${size},${size} L 0,${size} Z`
    
    shapes.push(
      h('path', {
        d: wavePath,
        fill: color,
        opacity: 0.3 + (i * 0.05)
      })
    )
  }
  
  return h('g', shapes)
}

// 马赛克风格
const MosaicAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  const tileSize = size / 16
  
  // 背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#f0f0f0'
    })
  )
  
  // 生成马赛克瓷砖
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const index = row * 16 + col
      const colorValue = (hash >> (index % 20)) & 7
      
      if (colorValue > 2) {
        const x = col * tileSize
        const y = row * tileSize
        const color = generateColor(seed, colorValue)
        
        // 随机形状
        const shapeType = (hash * (index + 1)) % 3
        
        if (shapeType === 0) {
          // 正方形
          shapes.push(
            h('rect', {
              x: x,
              y: y,
              width: tileSize,
              height: tileSize,
              fill: color,
              stroke: '#ffffff',
              'stroke-width': 1
            })
          )
        } else if (shapeType === 1) {
          // 圆形
          shapes.push(
            h('circle', {
              cx: x + tileSize / 2,
              cy: y + tileSize / 2,
              r: tileSize / 2,
              fill: color,
              stroke: '#ffffff',
              'stroke-width': 1
            })
          )
        } else {
          // 三角形
          const points = `${x},${y + tileSize} ${x + tileSize / 2},${y} ${x + tileSize},${y + tileSize}`
          shapes.push(
            h('polygon', {
              points: points,
              fill: color,
              stroke: '#ffffff',
              'stroke-width': 1
            })
          )
        }
      }
    }
  }
  
  return h('g', shapes)
}

// 电路板风格
const CircuitAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 深色背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#0a192f'
    })
  )
  
  const circuitColor = '#00ff88'
  const nodeCount = 12
  const nodes = []
  
  // 生成电路节点
  for (let i = 0; i < nodeCount; i++) {
    const x = ((hash * (i + 1) * 73) % (size * 0.8)) + size * 0.1
    const y = ((hash * (i + 2) * 97) % (size * 0.8)) + size * 0.1
    nodes.push({ x, y })
    
    // 节点圆圈
    shapes.push(
      h('circle', {
        cx: x,
        cy: y,
        r: 6,
        fill: circuitColor,
        opacity: 0.8
      })
    )
    
    // 节点外圈
    shapes.push(
      h('circle', {
        cx: x,
        cy: y,
        r: 10,
        fill: 'none',
        stroke: circuitColor,
        'stroke-width': 1,
        opacity: 0.5
      })
    )
  }
  
  // 连接节点的线路
  for (let i = 0; i < nodeCount - 1; i++) {
    const node1 = nodes[i]
    const node2 = nodes[i + 1]
    
    // 直线连接
    shapes.push(
      h('line', {
        x1: node1.x,
        y1: node1.y,
        x2: node2.x,
        y2: node2.y,
        stroke: circuitColor,
        'stroke-width': 2,
        opacity: 0.6
      })
    )
    
    // 随机添加直角连接
    if ((hash * i) % 3 === 0) {
      const midX = (node1.x + node2.x) / 2
      shapes.push(
        h('path', {
          d: `M ${node1.x},${node1.y} L ${midX},${node1.y} L ${midX},${node2.y} L ${node2.x},${node2.y}`,
          stroke: circuitColor,
          'stroke-width': 1,
          fill: 'none',
          opacity: 0.4
        })
      )
    }
  }
  
  // 添加电路芯片装饰
  const chipCount = 3 + (hash % 3)
  for (let i = 0; i < chipCount; i++) {
    const x = ((hash * (i + 20) * 53) % (size * 0.7)) + size * 0.15
    const y = ((hash * (i + 21) * 71) % (size * 0.7)) + size * 0.15
    const chipSize = 15 + ((hash * i) % 15)
    
    shapes.push(
      h('rect', {
        x: x - chipSize / 2,
        y: y - chipSize / 2,
        width: chipSize,
        height: chipSize,
        fill: '#0a192f',
        stroke: circuitColor,
        'stroke-width': 2,
        opacity: 0.8
      })
    )
    
    // 芯片引脚
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2
      const pinX = x + Math.cos(angle) * (chipSize / 2 + 5)
      const pinY = y + Math.sin(angle) * (chipSize / 2 + 5)
      
      shapes.push(
        h('line', {
          x1: x + Math.cos(angle) * chipSize / 2,
          y1: y + Math.sin(angle) * chipSize / 2,
          x2: pinX,
          y2: pinY,
          stroke: circuitColor,
          'stroke-width': 2,
          opacity: 0.7
        })
      )
    }
  }
  
  return h('g', shapes)
}

// 星系风格
const GalaxyAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 深空背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#0a0e27'
    })
  )
  
  // 星系中心
  const centerX = size / 2
  const centerY = size / 2
  
  // 添加径向渐变
  const gradientId = `galaxy-gradient-${seed}`
  shapes.push(
    h('defs', [
      h('radialGradient', { id: gradientId }, [
        h('stop', { offset: '0%', 'stop-color': '#ffffff', 'stop-opacity': 0.8 }),
        h('stop', { offset: '20%', 'stop-color': generateColor(seed, 1), 'stop-opacity': 0.6 }),
        h('stop', { offset: '50%', 'stop-color': generateColor(seed, 2), 'stop-opacity': 0.3 }),
        h('stop', { offset: '100%', 'stop-color': '#0a0e27', 'stop-opacity': 0 })
      ])
    ])
  )
  
  // 绘制旋臂星系
  const arms = 3 + (hash % 2)
  
  for (let arm = 0; arm < arms; arm++) {
    const armAngleOffset = (arm / arms) * Math.PI * 2
    
    for (let i = 0; i < 50; i++) {
      const t = i / 50
      const angle = armAngleOffset + t * Math.PI * 4 + (hash * arm) % 360
      const radius = t * size * 0.45
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      const starSize = 2 + Math.random() * 3
      const color = generateColor(seed, arm + i % 5)
      
      shapes.push(
        h('circle', {
          cx: x,
          cy: y,
          r: starSize,
          fill: color,
          opacity: 0.6 + Math.random() * 0.4
        })
      )
    }
  }
  
  // 中心光晕
  shapes.push(
    h('circle', {
      cx: centerX,
      cy: centerY,
      r: size * 0.3,
      fill: `url(#${gradientId})`
    })
  )
  
  // 随机星星点缀
  for (let i = 0; i < 100; i++) {
    const x = ((hash * (i + 1) * 73) % size + size) % size
    const y = ((hash * (i + 2) * 97) % size + size) % size
    const starSize = 0.5 + ((hash * i) % 20) / 10
    
    shapes.push(
      h('circle', {
        cx: x,
        cy: y,
        r: starSize,
        fill: '#ffffff',
        opacity: 0.3 + ((hash * i) % 50) / 100
      })
    )
  }
  
  return h('g', shapes)
}

// 水晶风格
const CrystalAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 渐变背景
  const bgGradientId = `crystal-bg-${seed}`
  shapes.push(
    h('defs', [
      h('linearGradient', { id: bgGradientId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
        h('stop', { offset: '0%', 'stop-color': '#e0f2fe' }),
        h('stop', { offset: '100%', 'stop-color': '#bae6fd' })
      ])
    ])
  )
  
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: `url(#${bgGradientId})`
    })
  )
  
  // 生成多个水晶
  const crystalCount = 5 + (hash % 3)
  
  for (let i = 0; i < crystalCount; i++) {
    const centerX = ((hash * (i + 1) * 73) % (size * 0.7)) + size * 0.15
    const centerY = ((hash * (i + 2) * 97) % (size * 0.7)) + size * 0.15
    const crystalSize = 30 + ((hash * (i + 1)) % 40)
    const color = generateColor(seed, i + 1)
    
    // 水晶多边形
    const sides = 6
    const points = []
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2
      const r = crystalSize + ((hash * (i + j)) % 15) - 7
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r
      points.push(`${x},${y}`)
    }
    
    // 水晶渐变
    const crystalGradientId = `crystal-${seed}-${i}`
    shapes.push(
      h('defs', [
        h('linearGradient', { id: crystalGradientId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
          h('stop', { offset: '0%', 'stop-color': color }),
          h('stop', { offset: '50%', 'stop-color': '#ffffff', 'stop-opacity': 0.7 }),
          h('stop', { offset: '100%', 'stop-color': color })
        ])
      ])
    )
    
    shapes.push(
      h('polygon', {
        points: points.join(' '),
        fill: `url(#${crystalGradientId})`,
        stroke: color,
        'stroke-width': 2,
        opacity: 0.8
      })
    )
    
    // 内部反光线条
    for (let k = 0; k < 3; k++) {
      const angle = ((hash * (i + k)) % 360) * Math.PI / 180
      const x1 = centerX + Math.cos(angle) * crystalSize * 0.3
      const y1 = centerY + Math.sin(angle) * crystalSize * 0.3
      const x2 = centerX + Math.cos(angle) * crystalSize * 0.7
      const y2 = centerY + Math.sin(angle) * crystalSize * 0.7
      
      shapes.push(
        h('line', {
          x1, y1, x2, y2,
          stroke: '#ffffff',
          'stroke-width': 2,
          opacity: 0.6
        })
      )
    }
  }
  
  return h('g', shapes)
}

// 部落图腾风格
const TribalAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 木纹背景
  const bgColors = ['#8b4513', '#a0522d', '#6b4423', '#8b6914']
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: bgColors[hash % bgColors.length]
    })
  )
  
  const centerX = size / 2
  
  // 绘制图腾柱
  const totemParts = 4
  const partHeight = size / totemParts
  
  for (let i = 0; i < totemParts; i++) {
    const y = i * partHeight
    const partType = (hash * (i + 1)) % 4
    const color = generateColor(seed, i + 1)
    
    if (partType === 0) {
      // 眼睛图案
      const eyeY = y + partHeight / 2
      
      // 左眼
      shapes.push(
        h('ellipse', {
          cx: centerX - partHeight * 0.3,
          cy: eyeY,
          rx: partHeight * 0.25,
          ry: partHeight * 0.3,
          fill: '#ffffff',
          stroke: '#000',
          'stroke-width': 3
        })
      )
      shapes.push(
        h('circle', {
          cx: centerX - partHeight * 0.3,
          cy: eyeY,
          r: partHeight * 0.12,
          fill: '#000'
        })
      )
      
      // 右眼
      shapes.push(
        h('ellipse', {
          cx: centerX + partHeight * 0.3,
          cy: eyeY,
          rx: partHeight * 0.25,
          ry: partHeight * 0.3,
          fill: '#ffffff',
          stroke: '#000',
          'stroke-width': 3
        })
      )
      shapes.push(
        h('circle', {
          cx: centerX + partHeight * 0.3,
          cy: eyeY,
          r: partHeight * 0.12,
          fill: '#000'
        })
      )
    } else if (partType === 1) {
      // 嘴巴图案
      const mouthY = y + partHeight * 0.6
      const mouthPath = `M ${centerX - partHeight * 0.4},${mouthY} Q ${centerX},${mouthY + partHeight * 0.25} ${centerX + partHeight * 0.4},${mouthY}`
      
      shapes.push(
        h('path', {
          d: mouthPath,
          stroke: '#000',
          'stroke-width': 4,
          fill: color,
          opacity: 0.8
        })
      )
      
      // 牙齿
      for (let t = 0; t < 5; t++) {
        const tx = centerX - partHeight * 0.3 + t * partHeight * 0.15
        shapes.push(
          h('rect', {
            x: tx,
            y: mouthY,
            width: 8,
            height: 12,
            fill: '#ffffff'
          })
        )
      }
    } else if (partType === 2) {
      // 几何纹样
      const patternY = y + partHeight / 2
      
      for (let p = 0; p < 5; p++) {
        const px = centerX - partHeight * 0.4 + p * partHeight * 0.2
        shapes.push(
          h('polygon', {
            points: `${px},${patternY - 15} ${px + 10},${patternY + 15} ${px - 10},${patternY + 15}`,
            fill: color,
            stroke: '#000',
            'stroke-width': 2
          })
        )
      }
    } else {
      // 螺旋纹样
      const spiralY = y + partHeight / 2
      const spiralPath = []
      
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = (a / (Math.PI * 4)) * partHeight * 0.35
        const x = centerX + Math.cos(a) * r
        const sy = spiralY + Math.sin(a) * r
        spiralPath.push(`${a === 0 ? 'M' : 'L'} ${x},${sy}`)
      }
      
      shapes.push(
        h('path', {
          d: spiralPath.join(' '),
          stroke: color,
          'stroke-width': 4,
          fill: 'none',
          'stroke-linecap': 'round'
        })
      )
    }
  }
  
  return h('g', shapes)
}

// 霓虹灯风格
const NeonAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 深色背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#0d0221'
    })
  )
  
  // 添加发光滤镜
  shapes.push(
    h('defs', [
      h('filter', { id: 'neon-glow' }, [
        h('feGaussianBlur', { stdDeviation: '4', result: 'coloredBlur' }),
        h('feMerge', {}, [
          h('feMergeNode', { in: 'coloredBlur' }),
          h('feMergeNode', { in: 'coloredBlur' }),
          h('feMergeNode', { in: 'SourceGraphic' })
        ])
      ])
    ])
  )
  
  const centerX = size / 2
  const centerY = size / 2
  
  // 霓虹灯管形状
  const neonShapes = ['circle', 'star', 'heart', 'lightning']
  const shapeType = neonShapes[hash % neonShapes.length]
  const neonColor = generateColor(seed, 1)
  
  if (shapeType === 'circle') {
    // 多层霓虹圆
    for (let i = 0; i < 5; i++) {
      const r = size * 0.1 + i * size * 0.08
      shapes.push(
        h('circle', {
          cx: centerX,
          cy: centerY,
          r: r,
          fill: 'none',
          stroke: neonColor,
          'stroke-width': 4,
          filter: 'url(#neon-glow)',
          opacity: 0.8
        })
      )
    }
  } else if (shapeType === 'star') {
    // 霓虹星星
    const points = []
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const r = i % 2 === 0 ? size * 0.35 : size * 0.15
      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r
      points.push(`${x},${y}`)
    }
    
    shapes.push(
      h('polygon', {
        points: points.join(' '),
        fill: 'none',
        stroke: neonColor,
        'stroke-width': 5,
        filter: 'url(#neon-glow)',
        'stroke-linejoin': 'round'
      })
    )
  } else if (shapeType === 'heart') {
    // 霓虹爱心
    const heartPath = `
      M ${centerX},${centerY + size * 0.15}
      C ${centerX - size * 0.25},${centerY - size * 0.15}
        ${centerX - size * 0.35},${centerY - size * 0.35}
        ${centerX},${centerY - size * 0.2}
      C ${centerX + size * 0.35},${centerY - size * 0.35}
        ${centerX + size * 0.25},${centerY - size * 0.15}
        ${centerX},${centerY + size * 0.15}
    `
    
    shapes.push(
      h('path', {
        d: heartPath,
        fill: 'none',
        stroke: neonColor,
        'stroke-width': 5,
        filter: 'url(#neon-glow)'
      })
    )
  } else {
    // 霓虹闪电
    const lightningPath = `
      M ${centerX - size * 0.1},${centerY - size * 0.35}
      L ${centerX + size * 0.05},${centerY - size * 0.05}
      L ${centerX - size * 0.15},${centerY}
      L ${centerX + size * 0.1},${centerY + size * 0.35}
      L ${centerX},${centerY + size * 0.1}
      L ${centerX + size * 0.15},${centerY - size * 0.1}
      Z
    `
    
    shapes.push(
      h('path', {
        d: lightningPath,
        fill: neonColor,
        stroke: neonColor,
        'stroke-width': 3,
        filter: 'url(#neon-glow)',
        opacity: 0.9
      })
    )
  }
  
  // 添加装饰性霓虹线条
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const x1 = centerX + Math.cos(angle) * size * 0.45
    const y1 = centerY + Math.sin(angle) * size * 0.45
    const x2 = centerX + Math.cos(angle) * size * 0.15
    const y2 = centerY + Math.sin(angle) * size * 0.15
    const lineColor = generateColor(seed, i + 2)
    
    shapes.push(
      h('line', {
        x1, y1, x2, y2,
        stroke: lineColor,
        'stroke-width': 3,
        filter: 'url(#neon-glow)',
        opacity: 0.7
      })
    )
  }
  
  return h('g', shapes)
}

// 折纸风格
const OrigamiAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 纸张背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#f5f5dc'
    })
  )
  
  // 折纸鸟、花或几何
  const origamiType = (hash % 3)
  const centerX = size / 2
  const centerY = size / 2
  
  if (origamiType === 0) {
    // 折纸鹤
    const color = generateColor(seed, 1)
    
    // 身体
    shapes.push(
      h('polygon', {
        points: `${centerX},${centerY - 20} ${centerX - 40},${centerY + 20} ${centerX + 40},${centerY + 20}`,
        fill: color,
        stroke: '#333',
        'stroke-width': 2
      })
    )
    
    // 头部
    shapes.push(
      h('polygon', {
        points: `${centerX},${centerY - 20} ${centerX - 15},${centerY - 50} ${centerX + 15},${centerY - 30}`,
        fill: color,
        stroke: '#333',
        'stroke-width': 2
      })
    )
    
    // 左翅膀
    shapes.push(
      h('polygon', {
        points: `${centerX - 40},${centerY + 20} ${centerX - 80},${centerY - 30} ${centerX - 30},${centerY}`,
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
        opacity: 0.9
      })
    )
    
    // 右翅膀
    shapes.push(
      h('polygon', {
        points: `${centerX + 40},${centerY + 20} ${centerX + 80},${centerY - 30} ${centerX + 30},${centerY}`,
        fill: color,
        stroke: '#333',
        'stroke-width': 2,
        opacity: 0.9
      })
    )
    
    // 尾巴
    shapes.push(
      h('polygon', {
        points: `${centerX},${centerY + 20} ${centerX - 10},${centerY + 60} ${centerX + 10},${centerY + 50}`,
        fill: color,
        stroke: '#333',
        'stroke-width': 2
      })
    )
  } else if (origamiType === 1) {
    // 折纸花
    const petalCount = 8
    const petalColor = generateColor(seed, 1)
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2
      const nextAngle = ((i + 1) / petalCount) * Math.PI * 2
      const midAngle = (angle + nextAngle) / 2
      
      const x1 = centerX + Math.cos(angle) * size * 0.15
      const y1 = centerY + Math.sin(angle) * size * 0.15
      const x2 = centerX + Math.cos(nextAngle) * size * 0.15
      const y2 = centerY + Math.sin(nextAngle) * size * 0.15
      const xm = centerX + Math.cos(midAngle) * size * 0.35
      const ym = centerY + Math.sin(midAngle) * size * 0.35
      
      shapes.push(
        h('polygon', {
          points: `${centerX},${centerY} ${x1},${y1} ${xm},${ym} ${x2},${y2}`,
          fill: petalColor,
          stroke: '#333',
          'stroke-width': 2,
          opacity: 0.85
        })
      )
      
      // 折痕线
      shapes.push(
        h('line', {
          x1: centerX,
          y1: centerY,
          x2: xm,
          y2: ym,
          stroke: '#999',
          'stroke-width': 1,
          'stroke-dasharray': '3,3'
        })
      )
    }
    
    // 花心
    shapes.push(
      h('circle', {
        cx: centerX,
        cy: centerY,
        r: 15,
        fill: generateColor(seed, 2),
        stroke: '#333',
        'stroke-width': 2
      })
    )
  } else {
    // 折纸立方体
    const cubeSize = size * 0.4
    const color1 = generateColor(seed, 1)
    const color2 = generateColor(seed, 2)
    const color3 = generateColor(seed, 3)
    
    // 前面
    shapes.push(
      h('polygon', {
        points: `${centerX - cubeSize / 2},${centerY} ${centerX + cubeSize / 2},${centerY} ${centerX + cubeSize / 2},${centerY + cubeSize} ${centerX - cubeSize / 2},${centerY + cubeSize}`,
        fill: color1,
        stroke: '#333',
        'stroke-width': 2
      })
    )
    
    // 顶面
    shapes.push(
      h('polygon', {
        points: `${centerX - cubeSize / 2},${centerY} ${centerX},${centerY - cubeSize / 2} ${centerX + cubeSize},${centerY - cubeSize / 2} ${centerX + cubeSize / 2},${centerY}`,
        fill: color2,
        stroke: '#333',
        'stroke-width': 2
      })
    )
    
    // 右面
    shapes.push(
      h('polygon', {
        points: `${centerX + cubeSize / 2},${centerY} ${centerX + cubeSize},${centerY - cubeSize / 2} ${centerX + cubeSize},${centerY + cubeSize / 2} ${centerX + cubeSize / 2},${centerY + cubeSize}`,
        fill: color3,
        stroke: '#333',
        'stroke-width': 2
      })
    )
  }
  
  return h('g', shapes)
}

// 故障艺术风格
const GlitchAvatar = ({ seed, size }) => {
  const hash = hashCode(seed)
  const shapes = []
  
  // 黑色背景
  shapes.push(
    h('rect', {
      width: size,
      height: size,
      fill: '#000000'
    })
  )
  
  const centerX = size / 2
  const centerY = size / 2
  
  // 主要形状（多层错位）
  const mainShape = (hash % 3)
  const layers = 5
  
  for (let i = 0; i < layers; i++) {
    const offsetX = ((hash * (i + 1)) % 20) - 10
    const offsetY = ((hash * (i + 2)) % 20) - 10
    const color = i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'
    const opacity = 0.3 + (i * 0.15)
    
    if (mainShape === 0) {
      // 故障矩形
      shapes.push(
        h('rect', {
          x: centerX - size * 0.25 + offsetX,
          y: centerY - size * 0.25 + offsetY,
          width: size * 0.5,
          height: size * 0.5,
          fill: color,
          opacity: opacity
        })
      )
    } else if (mainShape === 1) {
      // 故障圆形
      shapes.push(
        h('circle', {
          cx: centerX + offsetX,
          cy: centerY + offsetY,
          r: size * 0.3,
          fill: color,
          opacity: opacity
        })
      )
    } else {
      // 故障三角形
      shapes.push(
        h('polygon', {
          points: `${centerX + offsetX},${centerY - size * 0.3 + offsetY} ${centerX - size * 0.3 + offsetX},${centerY + size * 0.3 + offsetY} ${centerX + size * 0.3 + offsetX},${centerY + size * 0.3 + offsetY}`,
          fill: color,
          opacity: opacity
        })
      )
    }
  }
  
  // 添加故障线条
  for (let i = 0; i < 15; i++) {
    const y = ((hash * (i + 10)) % size + size) % size
    const lineWidth = 20 + ((hash * i) % 100)
    const lineX = ((hash * (i + 20)) % (size - lineWidth) + size) % size
    const lineColor = i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'
    
    shapes.push(
      h('rect', {
        x: lineX,
        y: y,
        width: lineWidth,
        height: 2 + ((hash * i) % 3),
        fill: lineColor,
        opacity: 0.5
      })
    )
  }
  
  // 添加故障文字效果
  const glitchText = '◢◣◥◤'
  shapes.push(
    h('text', {
      x: centerX,
      y: centerY,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'font-size': size * 0.25,
      'font-family': 'monospace',
      fill: '#00ff00',
      opacity: 0.7
    }, glitchText)
  )
  
  return h('g', shapes)
}

// 当前头像组件
const currentAvatarComponent = computed(() => {
  const components = {
    geometric: GeometricAvatar,
    colorful: ColorfulAvatar,
    pixel: PixelAvatar,
    gradient: GradientAvatar,
    duck: DuckAvatar,
    monster: MonsterAvatar,
    abstract: AbstractAvatar,
    retro: RetroAvatar,
    smile: SmileAvatar,
    rings: RingsAvatar,
    bacteria: BacteriaAvatar,
    mandala: MandalaAvatar,
    polygon: PolygonAvatar,
    wave: WaveAvatar,
    mosaic: MosaicAvatar,
    circuit: CircuitAvatar,
    galaxy: GalaxyAvatar,
    crystal: CrystalAvatar,
    tribal: TribalAvatar,
    neon: NeonAvatar,
    origami: OrigamiAvatar,
    glitch: GlitchAvatar
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
  max-width: var(--ui-size-900);
  margin: var(--sp-32) auto;
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-circle);
  border: var(--ui-border) solid var(--vp-c-divider);
  box-shadow: none;
}

.control-panel {
  margin-bottom: var(--sp-32);
}

.input-group {
  margin-bottom: var(--sp-24);
}

.input-group label {
  display: block;
  margin-bottom: var(--sp-8);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
}

.input-group input {
  width: 100%;
  padding: var(--sp-12) var(--sp-16);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: var(--ui-transition);
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: none;
}

.style-selector {
  margin-bottom: var(--sp-24);
}

.style-selector label {
  display: block;
  margin-bottom: var(--sp-12);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
}

.style-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--sp-120), 1fr));
  gap: var(--sp-12);
}

.style-btn {
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

.style-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.style-btn.active {
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
  min-width: var(--sp-152);
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

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-32);
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-input);
  border: var(--ui-focus) dashed var(--vp-c-divider);
}

.avatar-preview {
  width: var(--ui-size-256);
  height: var(--ui-size-256);
  border-radius: var(--ui-radius-circle);
  overflow: hidden;
  box-shadow: none;
  transition: var(--ui-transition);
}

.avatar-preview svg {
  display: block;
  width: 100%;
  height: 100%;
}

.preview-label {
  margin-top: var(--sp-16);
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-2);
  font-weight: var(--ui-weight-medium);
}

@media (max-width: 768px) {
  .avatar-generator {
    padding: var(--sp-24);
  }
  
  .style-buttons {
    grid-template-columns: repeat(auto-fill, minmax(var(--sp-100), 1fr));
    gap: var(--sp-8);
  }
  
  .style-btn {
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
  
  .avatar-preview {
    width: var(--ui-size-200);
    height: var(--ui-size-200);
  }
}
</style>

