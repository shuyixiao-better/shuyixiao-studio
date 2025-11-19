<template>
  <div class="easter-egg-container">
    <div 
      class="easter-egg-trigger" 
      @click="showMessage"
      :title="hintText"
    >
      {{ emoji }}
    </div>
    
    <Transition name="fade">
      <div v-if="isVisible" class="easter-egg-message" @click="hideMessage">
        <div class="message-content">
          <div class="message-icon">✨</div>
          <p class="message-text">如果你看到这里，说明你很细心</p>
          <p class="message-subtext">细心的人值得被珍惜</p>
          <div class="message-close">点击任意处关闭</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const emoji = ref('🌙')
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
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.easter-egg-trigger {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
  animation: float 3s ease-in-out infinite;
}

.easter-egg-trigger:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 51, 234, 0.25));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.easter-egg-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.message-content {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.95), 
    rgba(147, 51, 234, 0.95));
  padding: 3rem 2.5rem;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.message-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
  }
}

.message-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.message-subtext {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  font-style: italic;
}

.message-close {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .easter-egg-trigger {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    bottom: 15px;
    right: 15px;
  }
  
  .message-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .message-text {
    font-size: 1.2rem;
  }
  
  .message-subtext {
    font-size: 1rem;
  }
}
</style>
