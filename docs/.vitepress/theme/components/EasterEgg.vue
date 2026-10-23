<template>
  <div class="easter-egg-container" @keydown.esc="hideMessage">
    <button type="button" aria-label="发现一句话"
      class="easter-egg-trigger" 
      @click="showMessage"
      :title="hintText"
    >
      <LineIcon name="moon" />
    </button>
    
    <Transition name="fade">
      <div v-if="isVisible" class="easter-egg-message" @click="hideMessage">
        <div class="message-content">
          <div class="message-icon"><LineIcon name="book" /></div>
          <p class="message-text">如果你看到这里，说明你很细心</p>
          <p class="message-subtext">细心的人值得被珍惜</p>
          <button type="button" class="message-close" @click="hideMessage">关闭</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const hintText = ref('发现了什么？')

const showMessage = () => {
  isVisible.value = true
}

const hideMessage = () => {
  isVisible.value = false
}
</script>

<style scoped>
.easter-egg-container {
  position: fixed;
  bottom: var(--sp-20);
  right: var(--sp-20);
  z-index: 9999;
}

.easter-egg-trigger {
  width: var(--sp-48);
  height: var(--sp-48);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  border: var(--ui-focus) solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ui-text-section);
  cursor: pointer;
  transition: var(--ui-transition);
  box-shadow: none;
}

.easter-egg-trigger:hover {
  box-shadow: none;
  background: var(--vp-c-bg-soft);
}

.easter-egg-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.message-content {
  background: var(--vp-c-bg-soft);
  padding: var(--sp-48) var(--sp-40);
  border-radius: var(--ui-radius-input);
  text-align: center;
  max-width: var(--ui-size-500);
  box-shadow: none;
  border: var(--ui-focus) solid var(--vp-c-divider);
}

.message-icon {
  font-size: var(--ui-text-display);
  margin-bottom: var(--sp-24);
}

.message-text {
  font-size: var(--ui-text-section);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-2);
  margin: 0 0 var(--sp-16) 0;
  line-height: var(--ui-leading-body);
}

.message-subtext {
  font-size: var(--ui-text-quote);
  color: var(--vp-c-text-2);
  margin: 0 0 var(--sp-32) 0;
  font-style: italic;
}

.message-close {
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-2);
  margin-top: var(--sp-24);
  padding-top: var(--sp-16);
  border-top: var(--ui-border) solid var(--vp-c-divider);
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--ui-transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .easter-egg-trigger {
    width: var(--sp-40);
    height: var(--sp-40);
    font-size: var(--ui-text-quote);
    bottom: var(--sp-16);
    right: var(--sp-16);
  }
  
  .message-content {
    padding: var(--sp-32) var(--sp-24);
    margin: var(--sp-16);
    max-width: calc(100% - var(--sp-32));
  }
  
  .message-text {
    font-size: var(--ui-text-quote);
  }
  
  .message-subtext {
    font-size: var(--ui-text-base);
  }
}

.easter-egg-container { right: var(--sp-20); bottom: var(--sp-20); z-index: 99; }
.easter-egg-trigger { width: var(--ui-float-size); height: var(--ui-float-size); border-radius: var(--ui-radius-circle); background: var(--ui-surface); color: var(--vp-c-text-2); border: var(--ui-border) solid var(--vp-c-divider); padding: 0; box-shadow: none; }
.easter-egg-trigger:hover { background: var(--ui-surface); color: var(--vp-c-brand-1); }
.easter-egg-trigger .ui-icon { width: var(--sp-20); height: var(--sp-20); }
.easter-egg-message { background: var(--ui-overlay); }
.message-content { background: var(--ui-surface); color: var(--vp-c-text-1); border: var(--ui-border) solid var(--vp-c-divider); box-shadow: var(--ui-shadow); }
.message-text { color: var(--vp-c-text-1); }
.message-subtext, .message-close { color: var(--vp-c-text-2); }
</style>
