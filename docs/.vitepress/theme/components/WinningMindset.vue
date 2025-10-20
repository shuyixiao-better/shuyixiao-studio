<template>
  <div class="winning-mindset-compact">
    <div class="winning-header">
      <span class="winning-char">赢</span>
      <div class="winning-text">
        <h3 class="winning-motto">赢字的基调</h3>
        <p class="winning-dedication">致奋斗在第一线的人</p>
      </div>
    </div>
    
    <div class="winning-grid">
      <div class="winning-item" v-for="item in items" :key="item.title">
        <span class="item-icon">{{ item.icon }}</span>
        <span class="item-label">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const items = [
  { icon: '⚠️', title: '危机意识' },
  { icon: '💬', title: '表达能力' },
  { icon: '⏰', title: '时间观念' },
  { icon: '💰', title: '财富知识' },
  { icon: '🧘', title: '平常心态' }
]
</script>

<style scoped>
.winning-mindset-compact {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg,
    rgba(244, 63, 94, 0.03) 0%,
    rgba(239, 68, 68, 0.06) 50%,
    rgba(244, 63, 94, 0.03) 100%);
  border-radius: 20px;
  border: 1px solid rgba(244, 63, 94, 0.15);
  box-shadow: 0 8px 32px rgba(244, 63, 94, 0.08);
  transition: all 0.3s ease;
}

.winning-mindset-compact:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(244, 63, 94, 0.12);
  border-color: rgba(244, 63, 94, 0.25);
}

.winning-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed rgba(244, 63, 94, 0.2);
}

.winning-char {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "STKaiti", "KaiTi", "楷体", serif;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3));
}

.winning-text {
  flex: 1;
}

.winning-motto {
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

.winning-dedication {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  letter-spacing: 0.5px;
}

.winning-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.winning-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%);
  border-radius: 12px;
  border: 1px solid rgba(244, 63, 94, 0.1);
  transition: all 0.3s ease;
  cursor: default;
}

.winning-item:hover {
  transform: translateY(-4px);
  border-color: rgba(244, 63, 94, 0.3);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.15);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.95) 100%);
}

.item-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.winning-item:hover .item-icon {
  transform: scale(1.15);
}

.item-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ef4444;
  text-align: center;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.winning-item:hover .item-label {
  color: #dc2626;
}

/* 暗色模式 */
.dark .winning-mindset-compact {
  background: linear-gradient(135deg,
    rgba(244, 63, 94, 0.06) 0%,
    rgba(239, 68, 68, 0.1) 50%,
    rgba(244, 63, 94, 0.06) 100%);
  border-color: rgba(244, 63, 94, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dark .winning-mindset-compact:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(244, 63, 94, 0.35);
}

.dark .winning-header {
  border-bottom-color: rgba(244, 63, 94, 0.25);
}

.dark .winning-item {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  border-color: rgba(244, 63, 94, 0.2);
}

.dark .winning-item:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(244, 63, 94, 0.4);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.2);
}

/* 响应式 - 平板 */
@media (max-width: 1024px) {
  .winning-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .winning-item:nth-child(4),
  .winning-item:nth-child(5) {
    grid-column: span 1;
  }
}

/* 响应式 - 手机 */
@media (max-width: 768px) {
  .winning-mindset-compact {
    margin: 2rem 1rem;
    padding: 1.5rem 1.25rem;
  }
  
  .winning-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
  }
  
  .winning-char {
    font-size: 3rem;
  }
  
  .winning-motto {
    font-size: 1.3rem;
  }
  
  .winning-dedication {
    font-size: 0.9rem;
  }
  
  .winning-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .winning-item:last-child {
    grid-column: span 2;
  }
  
  .winning-item {
    padding: 0.9rem 0.6rem;
  }
  
  .item-icon {
    font-size: 1.75rem;
  }
  
  .item-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .winning-grid {
    grid-template-columns: 1fr;
  }
  
  .winning-item:last-child {
    grid-column: span 1;
  }
}
</style>

