<template>
  <div class="jobs-quotes-section">
    <div class="jobs-quotes-card">
      <div class="card-icon">🍎</div>
      <h2 class="card-title">智慧启迪 · 乔布斯的人生哲学</h2>
      <div class="card-content">
        <div class="quote-carousel">
          <transition name="fade" mode="out-in">
            <div :key="currentQuoteIndex" class="quote-item">
              <div class="quote-text">{{ currentQuote.text }}</div>
              <div class="quote-category">{{ currentQuote.category }}</div>
            </div>
          </transition>
        </div>
        <div class="quotes-navigation">
          <button 
            v-for="(quote, index) in quotes" 
            :key="index"
            :class="['nav-dot', { active: index === currentQuoteIndex }]"
            @click="changeQuote(index)"
            :aria-label="`查看第 ${index + 1} 条名言`"
          ></button>
        </div>
      </div>
      <div class="card-footer">
        <a href="/insights/wisdom/steve-jobs" class="explore-link">
          <span class="footer-icon">✨</span>
          <span>探索完整智慧</span>
          <span class="arrow">→</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const quotes = [
  {
    text: '成就一番伟业的唯一途径就是热爱自己的事业。如果还没找到，就继续找，不要停。',
    category: '工作与热爱'
  },
  {
    text: '你的时间有限，所以不要为别人而活。不要被教条所限，不要活在别人的观念里。',
    category: '生命与时间'
  },
  {
    text: '记住你即将死去，是避免陷入患得患失困境的最好方法。',
    category: '死亡与动力'
  },
  {
    text: '专注和简单一直是我们的秘诀。简单比复杂更难，但一旦做到，便能创造奇迹。',
    category: '专注与简单'
  },
  {
    text: '人们经常不知道自己要什么，直到你秀给他们看。',
    category: '创新与行动'
  },
  {
    text: '活着就是为了改变世界，难道还有其他原因吗？',
    category: '使命与追求'
  }
]

const currentQuoteIndex = ref(0)
let interval = null

const currentQuote = ref(quotes[0])

const changeQuote = (index) => {
  currentQuoteIndex.value = index
  currentQuote.value = quotes[index]
  // 重置自动播放定时器
  if (interval) {
    clearInterval(interval)
    startAutoPlay()
  }
}

const nextQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length
  currentQuote.value = quotes[currentQuoteIndex.value]
}

const startAutoPlay = () => {
  interval = setInterval(nextQuote, 5000) // 每5秒切换一次
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.jobs-quotes-section {
  margin: 5rem auto;
  padding: 0 2rem;
  max-width: 950px;
  position: relative;
  z-index: 10;
}

.jobs-quotes-card {
  position: relative;
  padding: 3.5rem 3rem;
  background: linear-gradient(135deg,
    rgba(255, 87, 34, 0.05) 0%,
    rgba(255, 152, 0, 0.08) 50%,
    rgba(255, 87, 34, 0.05) 100%);
  border-radius: 28px;
  box-shadow: 
    0 25px 70px rgba(255, 87, 34, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 87, 34, 0.2);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.jobs-quotes-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 87, 34, 0.8),
    rgba(255, 152, 0, 0.8),
    rgba(255, 87, 34, 0.8),
    transparent);
}

.jobs-quotes-card::after {
  content: '💡';
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  font-size: 5rem;
  opacity: 0.06;
  transform: rotate(-15deg);
  pointer-events: none;
}

.jobs-quotes-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 35px 90px rgba(255, 87, 34, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 87, 34, 0.35);
}

.card-icon {
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 8px 16px rgba(255, 87, 34, 0.3));
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.card-title {
  margin: 0 0 2rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    #ff5722 0%,
    #ff9800 50%,
    #ff5722 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  letter-spacing: 1.5px;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #ff5722, #ff9800);
  transform: translateX(-50%);
  border-radius: 2px;
}

.card-content {
  position: relative;
  z-index: 2;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quote-carousel {
  width: 100%;
  margin-bottom: 2rem;
}

.quote-item {
  text-align: center;
  padding: 2rem 1rem;
}

.quote-text {
  font-size: 1.35rem;
  line-height: 1.8;
  color: var(--vp-c-text-1);
  font-weight: 500;
  margin-bottom: 1.5rem;
  position: relative;
  padding: 0 2rem;
  font-style: italic;
}

.quote-text::before,
.quote-text::after {
  content: '"';
  font-size: 3rem;
  color: #ff5722;
  opacity: 0.3;
  line-height: 0;
  position: absolute;
  font-family: Georgia, serif;
}

.quote-text::before {
  left: 0;
  top: 20px;
}

.quote-text::after {
  right: 0;
  bottom: -10px;
}

.quote-category {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg,
    rgba(255, 87, 34, 0.1),
    rgba(255, 152, 0, 0.15));
  border-radius: 20px;
  border: 1px solid rgba(255, 87, 34, 0.3);
  color: #ff5722;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.quotes-navigation {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  align-items: center;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 87, 34, 0.2);
  border: 2px solid rgba(255, 87, 34, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  outline: none;
}

.nav-dot:hover {
  background: rgba(255, 87, 34, 0.4);
  transform: scale(1.2);
}

.nav-dot.active {
  width: 32px;
  border-radius: 6px;
  background: linear-gradient(90deg, #ff5722, #ff9800);
  border-color: #ff5722;
}

.card-footer {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px dashed rgba(255, 87, 34, 0.2);
  display: flex;
  justify-content: center;
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff5722, #ff9800);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(255, 87, 34, 0.3);
  position: relative;
  overflow: hidden;
}

.explore-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.explore-link:hover::before {
  left: 100%;
}

.explore-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 87, 34, 0.4);
}

.footer-icon {
  font-size: 1.3rem;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.explore-link:hover .arrow {
  transform: translateX(5px);
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .jobs-quotes-section {
    margin: 3rem auto;
    padding: 0 1rem;
  }
  
  .jobs-quotes-card {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }
  
  .jobs-quotes-card::after {
    font-size: 3.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
    margin-bottom: 1.5rem;
  }
  
  .quote-text {
    font-size: 1.05rem;
    padding: 0 1rem;
    line-height: 1.7;
  }
  
  .quote-text::before,
  .quote-text::after {
    font-size: 2rem;
  }
  
  .quote-category {
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
  }
  
  .nav-dot {
    width: 10px;
    height: 10px;
  }
  
  .nav-dot.active {
    width: 28px;
  }
  
  .explore-link {
    font-size: 0.95rem;
    padding: 0.9rem 1.75rem;
  }
  
  .card-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .jobs-quotes-card {
    padding: 3rem 2.5rem;
  }
  
  .card-title {
    font-size: 2rem;
  }
  
  .quote-text {
    font-size: 1.2rem;
  }
}

/* 暗色模式优化 */
.dark .jobs-quotes-card {
  background: linear-gradient(135deg,
    rgba(255, 87, 34, 0.08) 0%,
    rgba(255, 152, 0, 0.12) 50%,
    rgba(255, 87, 34, 0.08) 100%);
  border-color: rgba(255, 87, 34, 0.3);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.dark .jobs-quotes-card:hover {
  border-color: rgba(255, 87, 34, 0.45);
  box-shadow:
    0 35px 90px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .quote-category {
  background: linear-gradient(135deg,
    rgba(255, 87, 34, 0.15),
    rgba(255, 152, 0, 0.2));
  border-color: rgba(255, 87, 34, 0.4);
}
</style>

