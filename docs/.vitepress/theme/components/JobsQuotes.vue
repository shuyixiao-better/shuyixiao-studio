<template>
  <div class="jobs-quotes-section">
    <div class="jobs-quotes-card">
      <div class="card-icon"><LineIcon name="book" /></div>
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
          <span class="footer-icon"><LineIcon name="book" /></span>
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
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
  margin: var(--sp-80) auto;
  padding: 0 var(--sp-32);
  max-width: var(--ui-size-952);
  position: relative;
  z-index: 10;
}

.jobs-quotes-card {
  position: relative;
  padding: var(--sp-56) var(--sp-48);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  box-shadow: 
    none;
  border: var(--ui-border) solid var(--vp-c-divider);
  overflow: hidden;
  transition: var(--ui-transition);
}

.jobs-quotes-card:hover {
  box-shadow: 
    none;
  border-color: var(--vp-c-divider);
}

.card-icon {
  font-size: var(--ui-text-hero);
  text-align: center;
  margin-bottom: var(--sp-24);
}

.card-title {
  margin: 0 0 var(--sp-32);
  text-align: center;
  font-size: var(--ui-text-title);
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
  position: relative;
  letter-spacing: normal;
}

.card-content {
  position: relative;
  z-index: 2;
  min-height: var(--ui-size-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quote-carousel {
  width: 100%;
  margin-bottom: var(--sp-32);
}

.quote-item {
  text-align: center;
  padding: var(--sp-32) var(--sp-16);
}

.quote-text {
  font-size: var(--ui-text-quote);
  line-height: var(--ui-leading-body);
  color: var(--vp-c-text-1);
  font-weight: var(--ui-weight-medium);
  margin-bottom: var(--sp-24);
  position: relative;
  padding: 0 var(--sp-32);
  font-style: italic;
}

.quote-text::before {
  left: 0;
  top: var(--sp-20);
}

.quote-text::after {
  right: 0;
  bottom: calc(-1 * var(--sp-12));
}

.quote-category {
  display: inline-block;
  padding: var(--sp-8) var(--sp-24);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-heading);
  letter-spacing: normal;
}

.quotes-navigation {
  display: flex;
  gap: var(--sp-12);
  justify-content: center;
  align-items: center;
}

.nav-dot {
  width: var(--sp-12);
  height: var(--sp-12);
  border-radius: var(--ui-radius-circle);
  background: var(--vp-c-bg-soft);
  border: var(--ui-focus) solid var(--vp-c-divider);
  cursor: pointer;
  transition: var(--ui-transition);
  padding: 0;
  outline: none;
}

.nav-dot:hover {
  background: var(--vp-c-bg-soft);
}

.nav-dot.active {
  width: var(--sp-32);
  border-radius: var(--ui-radius-circle);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.card-footer {
  margin-top: var(--sp-40);
  padding-top: var(--sp-32);
  border-top: var(--ui-focus) dashed var(--vp-c-divider);
  display: flex;
  justify-content: center;
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-12);
  padding: var(--sp-16) var(--sp-32);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  transition: var(--ui-transition);
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.explore-link:hover::before {
  left: 100%;
}

.explore-link:hover {
  box-shadow: none;
}

.footer-icon {
  font-size: var(--ui-text-quote);
}

.arrow {
  font-size: var(--ui-text-quote);
  transition: var(--ui-transition);
}

.explore-link:hover .arrow {
  transform: translateX(var(--sp-4));
}
.fade-enter-active, .fade-leave-active {
  transition: var(--ui-transition);
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .jobs-quotes-section {
    margin: var(--sp-48) auto;
    padding: 0 var(--sp-16);
  }
  
  .jobs-quotes-card {
    padding: var(--sp-40) var(--sp-24);
    border-radius: var(--ui-radius-card);
  }
  
  .jobs-quotes-card::after {
    font-size: var(--ui-text-hero);
    bottom: var(--sp-24);
    right: var(--sp-24);
  }
  
  .card-icon {
    font-size: var(--ui-text-display);
    margin-bottom: var(--sp-16);
  }
  
  .card-title {
    font-size: var(--ui-text-section);
    letter-spacing: normal;
    margin-bottom: var(--sp-24);
  }
  
  .quote-text {
    font-size: var(--ui-text-base);
    padding: 0 var(--sp-16);
    line-height: var(--ui-leading-body);
  }
  
  .quote-text::before,
  .quote-text::after {
    font-size: var(--ui-text-title);
  }
  
  .quote-category {
    font-size: var(--ui-text-meta);
    padding: var(--sp-8) var(--sp-20);
  }
  
  .nav-dot {
    width: var(--sp-12);
    height: var(--sp-12);
  }
  
  .nav-dot.active {
    width: var(--sp-28);
  }
  
  .explore-link {
    font-size: var(--ui-text-base);
    padding: var(--sp-16) var(--sp-28);
  }
  
  .card-footer {
    margin-top: var(--sp-32);
    padding-top: var(--sp-24);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .jobs-quotes-card {
    padding: var(--sp-48) var(--sp-40);
  }
  
  .card-title {
    font-size: var(--ui-text-title);
  }
  
  .quote-text {
    font-size: var(--ui-text-quote);
  }
}
.dark .jobs-quotes-card {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  box-shadow:
    none;
}

.dark .jobs-quotes-card:hover {
  border-color: var(--vp-c-divider);
  box-shadow:
    none;
}

.dark .quote-category {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}
</style>

