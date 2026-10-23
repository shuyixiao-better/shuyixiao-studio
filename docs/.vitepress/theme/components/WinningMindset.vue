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
        <span class="item-icon"><LineIcon name="book" /></span>
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
  max-width: var(--ui-size-900);
  margin: var(--sp-48) auto;
  padding: var(--sp-32) var(--sp-40);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  box-shadow: none;
  transition: var(--ui-transition);
}

.winning-mindset-compact:hover {
  box-shadow: none;
  border-color: var(--vp-c-divider);
}

.winning-header {
  display: flex;
  align-items: center;
  gap: var(--sp-24);
  margin-bottom: var(--sp-24);
  padding-bottom: var(--sp-24);
  border-bottom: var(--ui-border) dashed var(--vp-c-divider);
}

.winning-char {
  font-size: var(--ui-text-hero);
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
  font-family: "STKaiti", "KaiTi", "楷体", serif;
  line-height: var(--ui-leading-body);
  flex-shrink: 0;
}

.winning-text {
  flex: 1;
}

.winning-motto {
  margin: 0 0 var(--sp-8);
  font-size: var(--ui-text-section);
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
  letter-spacing: normal;
}

.winning-dedication {
  margin: 0;
  font-size: var(--ui-text-base);
  color: var(--vp-c-text-2);
  font-style: italic;
  letter-spacing: normal;
}

.winning-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--sp-16);
}

.winning-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-16) var(--sp-12);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  transition: var(--ui-transition);
  cursor: default;
}

.winning-item:hover {
  border-color: var(--vp-c-divider);
  box-shadow: none;
  background: var(--vp-c-bg-soft);
}

.item-icon {
  font-size: var(--ui-text-title);
  transition: var(--ui-transition);
}

.item-label {
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-2);
  text-align: center;
  letter-spacing: normal;
  transition: var(--ui-transition);
}

.winning-item:hover .item-label {
  color: var(--vp-c-brand-1);
}
.dark .winning-mindset-compact {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  box-shadow: none;
}

.dark .winning-mindset-compact:hover {
  box-shadow: none;
  border-color: var(--vp-c-divider);
}

.dark .winning-header {
  border-bottom-color: var(--vp-c-divider);
}

.dark .winning-item {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.dark .winning-item:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  box-shadow: none;
}
@media (max-width: 1024px) {
  .winning-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-12);
  }
  
  .winning-item:nth-child(4),
  .winning-item:nth-child(5) {
    grid-column: span 1;
  }
}
@media (max-width: 768px) {
  .winning-mindset-compact {
    margin: var(--sp-32) var(--sp-16);
    padding: var(--sp-24) var(--sp-20);
  }
  
  .winning-header {
    flex-direction: column;
    text-align: center;
    gap: var(--sp-16);
    margin-bottom: var(--sp-20);
    padding-bottom: var(--sp-20);
  }
  
  .winning-char {
    font-size: var(--ui-text-display);
  }
  
  .winning-motto {
    font-size: var(--ui-text-quote);
  }
  
  .winning-dedication {
    font-size: var(--ui-text-sm);
  }
  
  .winning-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-12);
  }
  
  .winning-item:last-child {
    grid-column: span 2;
  }
  
  .winning-item {
    padding: var(--sp-16) var(--sp-8);
  }
  
  .item-icon {
    font-size: var(--ui-text-title);
  }
  
  .item-label {
    font-size: var(--ui-text-sm);
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

