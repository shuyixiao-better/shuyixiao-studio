<template>
  <div class="dev-fortune-container">
    <!-- 日期显示 -->
    <div class="date-section">
      <div class="date-main">
        <div class="lunar-date">{{ lunarInfo }}</div>
        <div class="gregorian-date">{{ currentDate }}</div>
        <div class="day-of-week">星期{{ dayOfWeek }}</div>
      </div>
      <button class="refresh-btn" @click="refreshFortune" :disabled="isRefreshing">
        <span :class="{ spinning: isRefreshing }">🔄</span>
        {{ isRefreshing ? '刷新中...' : '换个运势' }}
      </button>
    </div>

    <!-- 运势指数 -->
    <div class="fortune-section">
      <h3 class="section-title">📊 今日运势指数</h3>
      <div class="fortune-bars">
        <div v-for="item in fortuneIndexes" :key="item.name" class="fortune-item">
          <div class="fortune-label">
            <span class="fortune-icon">{{ item.icon }}</span>
            <span class="fortune-name">{{ item.name }}</span>
          </div>
          <div class="fortune-bar-wrapper">
            <div 
              class="fortune-bar" 
              :style="{ 
                width: item.value + '%', 
                background: item.color 
              }"
            >
              <span class="fortune-value">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 黄历 -->
    <div class="almanac-section">
      <div class="almanac-column good">
        <h3 class="almanac-title">✅ 宜</h3>
        <ul class="almanac-list">
          <li v-for="(item, index) in goodActivities" :key="index" class="almanac-item">
            <span class="item-icon">{{ item.icon }}</span>
            <div class="item-content">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-desc">{{ item.desc }}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="almanac-column bad">
        <h3 class="almanac-title">❌ 忌</h3>
        <ul class="almanac-list">
          <li v-for="(item, index) in badActivities" :key="index" class="almanac-item">
            <span class="item-icon">{{ item.icon }}</span>
            <div class="item-content">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-desc">{{ item.desc }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 幸运元素 -->
    <div class="lucky-section">
      <h3 class="section-title">🍀 今日幸运元素</h3>
      <div class="lucky-items">
        <div class="lucky-item">
          <div class="lucky-label">幸运语言</div>
          <div class="lucky-value">{{ luckyElements.language }}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">幸运框架</div>
          <div class="lucky-value">{{ luckyElements.framework }}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">幸运工具</div>
          <div class="lucky-value">{{ luckyElements.tool }}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">幸运饮品</div>
          <div class="lucky-value">{{ luckyElements.drink }}</div>
        </div>
      </div>
    </div>

    <!-- 今日箴言 -->
    <div class="quote-section">
      <div class="quote-icon">💬</div>
      <div class="quote-text">{{ dailyQuote.text }}</div>
      <div class="quote-author">—— {{ dailyQuote.author }}</div>
    </div>

    <!-- 幸运数字 -->
    <div class="numbers-section">
      <h3 class="section-title">🎲 今日幸运数字</h3>
      <div class="lucky-numbers">
        <div v-for="num in luckyNumbers" :key="num" class="lucky-number">
          {{ num }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 状态
const isRefreshing = ref(false)
const seed = ref(0)

// 当前日期
const now = new Date()
const currentDate = computed(() => {
  return now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const dayOfWeek = computed(() => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return days[now.getDay()]
})

const lunarInfo = computed(() => {
  // 简化的农历信息
  const year = now.getFullYear()
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  const animal = animals[(year - 4) % 12]
  return `农历 ${animal}年`
})

// 生成哈希
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 获取今日种子
const getTodaySeed = () => {
  const dateStr = now.toDateString() + seed.value
  return hashCode(dateStr)
}

// 随机数生成器（基于种子）
const seededRandom = (min, max, offset = 0) => {
  const hash = getTodaySeed() + offset
  return min + (hash % (max - min + 1))
}

// 运势指数
const fortuneIndexes = computed(() => {
  const items = [
    { name: '写代码', icon: '💻', color: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
    { name: '改Bug', icon: '🐛', color: 'linear-gradient(90deg, #ef4444, #dc2626)' },
    { name: '提交代码', icon: '📤', color: 'linear-gradient(90deg, #10b981, #059669)' },
    { name: 'Code Review', icon: '👀', color: 'linear-gradient(90deg, #f59e0b, #d97706)' },
    { name: '摸鱼', icon: '🐟', color: 'linear-gradient(90deg, #8b5cf6, #7c3aed)' },
    { name: '开会', icon: '👥', color: 'linear-gradient(90deg, #ec4899, #db2777)' }
  ]
  
  return items.map((item, index) => ({
    ...item,
    value: seededRandom(40, 100, index * 100)
  }))
})

// 宜做的事
const goodActivitiesList = [
  { name: '写单元测试', desc: '今日代码质量爆表', icon: '✅' },
  { name: '重构代码', desc: '灵感迸发，思路清晰', icon: '🔧' },
  { name: '学习新技术', desc: '学什么都事半功倍', icon: '📚' },
  { name: '提交PR', desc: 'Reviewer心情大好', icon: '✨' },
  { name: '写文档', desc: '文思泉涌，妙笔生花', icon: '📝' },
  { name: '优化性能', desc: '性能提升10倍起步', icon: '🚀' },
  { name: '摸鱼划水', desc: '今天就是摸鱼日', icon: '🐟' },
  { name: '喝咖啡', desc: '提神醒脑，灵感源泉', icon: '☕' },
  { name: '整理代码', desc: '井井有条，赏心悦目', icon: '📋' },
  { name: '帮同事Debug', desc: '一眼看出问题所在', icon: '🤝' }
]

const goodActivities = computed(() => {
  const indices = []
  for (let i = 0; i < 5; i++) {
    let idx = seededRandom(0, goodActivitiesList.length - 1, i * 50)
    while (indices.includes(idx)) {
      idx = (idx + 1) % goodActivitiesList.length
    }
    indices.push(idx)
  }
  return indices.map(i => goodActivitiesList[i])
})

// 忌做的事
const badActivitiesList = [
  { name: '直接上生产', desc: '容易翻车，三思而行', icon: '⚠️' },
  { name: '删数据库', desc: '高危操作，千万别碰', icon: '💥' },
  { name: '强制推送', desc: 'git push -f会被打', icon: '🚫' },
  { name: '熬夜写代码', desc: '健康第一，劳逸结合', icon: '🌙' },
  { name: '跟产品争论', desc: '今天说不赢他', icon: '💬' },
  { name: '改底层架构', desc: '容易引发连锁反应', icon: '🏗️' },
  { name: '处理工单', desc: '今天会遇到奇葩需求', icon: '📧' },
  { name: '改配置文件', desc: '一个分号引发血案', icon: '⚙️' },
  { name: '升级依赖', desc: '兼容性问题在招手', icon: '📦' },
  { name: '接需求', desc: '今天的需求都是坑', icon: '📋' }
]

const badActivities = computed(() => {
  const indices = []
  for (let i = 0; i < 5; i++) {
    let idx = seededRandom(0, badActivitiesList.length - 1, i * 60 + 1000)
    while (indices.includes(idx)) {
      idx = (idx + 1) % badActivitiesList.length
    }
    indices.push(idx)
  }
  return indices.map(i => badActivitiesList[i])
})

// 幸运元素
const luckyElements = computed(() => {
  const languages = ['JavaScript', 'Python', 'Java', 'Go', 'Rust', 'TypeScript', 'C++', 'Kotlin', 'Swift', 'PHP']
  const frameworks = ['Vue', 'React', 'Angular', 'Spring Boot', 'Django', 'Flask', 'Express', 'Next.js', 'Nuxt', 'FastAPI']
  const tools = ['VS Code', 'IntelliJ IDEA', 'Git', 'Docker', 'Kubernetes', 'Postman', 'Chrome DevTools', 'Vim', 'Tmux', 'WebStorm']
  const drinks = ['美式咖啡', '拿铁', '卡布奇诺', '摩卡', '红茶', '绿茶', '可乐', '雪碧', '红牛', '矿泉水']
  
  return {
    language: languages[seededRandom(0, languages.length - 1, 2000)],
    framework: frameworks[seededRandom(0, frameworks.length - 1, 3000)],
    tool: tools[seededRandom(0, tools.length - 1, 4000)],
    drink: drinks[seededRandom(0, drinks.length - 1, 5000)]
  }
})

// 每日箴言
const quotes = [
  { text: '代码如诗，Bug如歌，调试如人生。', author: '匿名程序员' },
  { text: '今天的Bug，明天的Feature。', author: '产品经理' },
  { text: '能用代码解决的问题，就不要用文档。', author: '懒惰的程序员' },
  { text: '测试？那是生产环境该做的事。', author: '勇敢的开发者' },
  { text: '代码写得越少，Bug就越少。', author: '删除大师' },
  { text: '最好的代码是没有代码。', author: '架构师' },
  { text: '编程不是艺术，但程序员是艺术家。', author: 'Linux之父' },
  { text: '过早优化是万恶之源。', author: 'Donald Knuth' },
  { text: '代码千万行，注释第一行。命名不规范，同事两行泪。', author: '资深程序员' },
  { text: 'Talk is cheap, show me the code.', author: 'Linus Torvalds' },
  { text: '代码如水，无形胜有形。', author: '道家程序员' },
  { text: '从删库到跑路，只需要一条命令。', author: 'DBA的警告' }
]

const dailyQuote = computed(() => {
  const index = seededRandom(0, quotes.length - 1, 6000)
  return quotes[index]
})

// 幸运数字
const luckyNumbers = computed(() => {
  const numbers = []
  for (let i = 0; i < 6; i++) {
    numbers.push(seededRandom(0, 99, 7000 + i * 100))
  }
  return numbers
})

// 刷新运势
const refreshFortune = () => {
  isRefreshing.value = true
  seed.value += 1
  
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

onMounted(() => {
  // 初始化种子
  seed.value = 0
})
</script>

<style scoped>
.dev-fortune-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* 日期部分 */
.date-section {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  border-radius: 16px;
  margin-bottom: 2rem;
  position: relative;
  color: white;
  box-shadow: 0 8px 24px rgba(62, 175, 124, 0.3);
}

.date-main {
  margin-bottom: 1.5rem;
}

.lunar-date {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.gregorian-date {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.day-of-week {
  font-size: 1.1rem;
  opacity: 0.9;
}

.refresh-btn {
  padding: 0.75rem 2rem;
  border: 2px solid white;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover:not(:disabled) {
  background: white;
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinning {
  display: inline-block;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 运势指数 */
.fortune-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.fortune-bars {
  display: grid;
  gap: 1rem;
}

.fortune-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fortune-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.fortune-icon {
  font-size: 1.2rem;
}

.fortune-bar-wrapper {
  position: relative;
  height: 32px;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  overflow: hidden;
}

.fortune-bar {
  height: 100%;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
  transition: width 0.8s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.fortune-value {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 黄历 */
.almanac-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.almanac-column {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 1.5rem;
}

.almanac-column.good {
  border: 2px solid #10b981;
}

.almanac-column.bad {
  border: 2px solid #ef4444;
}

.almanac-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.almanac-column.good .almanac-title {
  color: #10b981;
}

.almanac-column.bad .almanac-title {
  color: #ef4444;
}

.almanac-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.almanac-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--vp-c-bg);
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.almanac-item:hover {
  transform: translateX(4px);
}

.item-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.item-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

/* 幸运元素 */
.lucky-section {
  margin-bottom: 2rem;
}

.lucky-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.lucky-item {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.lucky-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(62, 175, 124, 0.2);
}

.lucky-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.lucky-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* 箴言 */
.quote-section {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.2);
}

.quote-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.quote-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #78350f;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.quote-author {
  font-size: 0.95rem;
  color: #92400e;
  font-style: italic;
}

/* 幸运数字 */
.numbers-section {
  margin-bottom: 1rem;
}

.lucky-numbers {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.lucky-number {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
  transition: transform 0.3s ease;
}

.lucky-number:hover {
  transform: scale(1.1) rotate(5deg);
}

@media (max-width: 768px) {
  .dev-fortune-container {
    padding: 1.5rem;
  }
  
  .date-section {
    padding: 1.5rem;
  }
  
  .gregorian-date {
    font-size: 1.5rem;
  }
  
  .almanac-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .lucky-items {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quote-text {
    font-size: 1rem;
  }
  
  .lucky-number {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>

