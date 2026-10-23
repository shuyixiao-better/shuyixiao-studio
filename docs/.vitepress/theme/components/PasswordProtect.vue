<template>
  <div v-if="!isUnlocked" class="password-protect">
    <div class="password-protect-container">
      <div class="lock-icon"><LineIcon name="lock" /></div>
      <h2 class="title">此内容已加密</h2>
      <p class="description">请输入密码以查看内容</p>
      
      <div class="password-input-wrapper">
        <input
          v-model="inputPassword"
          type="password"
          placeholder="请输入密码"
          class="password-input"
          @keyup.enter="checkPassword"
          autofocus
        />
        <button @click="checkPassword" class="unlock-button">
          <span v-if="!isChecking"> 解锁</span>
          <span v-else>验证中...</span>
        </button>
      </div>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      
      <div class="hint">
        <p> 提示：如果你忘记了密码，请联系作者获取访问权限</p>
      </div>
    </div>
  </div>
  
  <div v-else class="password-protect-content">
    <div class="unlock-banner">
      <span class="unlock-icon"><LineIcon name="book" /></span>
      <span class="unlock-text">内容已解锁</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vitepress'
import CryptoJS from 'crypto-js'

const props = defineProps({
  // 接收加密后的密码哈希值
  passwordHash: {
    type: String,
    default: 'e614c56a130dd5c63280ed4f4fce9a3aa8e9dc875840db6bdea32aaf29abc0cf' // "0917" 的 SHA256 哈希
  }
})

const route = useRoute()
const isUnlocked = ref(false)
const inputPassword = ref('')
const errorMessage = ref('')
const isChecking = ref(false)

// 为每个页面生成唯一的存储key，包含路径和密码哈希
const STORAGE_KEY = computed(() => {
  const path = route.path
  return `password_protect_${CryptoJS.MD5(path + props.passwordHash).toString()}`
})

// 计算密码的SHA256哈希
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString()
}

// 检查密码
const checkPassword = () => {
  if (typeof window === 'undefined') return
  if (!inputPassword.value.trim()) {
    errorMessage.value = '请输入密码'
    return
  }
  
  isChecking.value = true
  
  // 模拟验证延迟，增加安全性
  setTimeout(() => {
    const inputHash = hashPassword(inputPassword.value)
    
    if (inputHash === props.passwordHash) {
      isUnlocked.value = true
      errorMessage.value = ''
      
      // 保存解锁状态到 localStorage（使用加密）
      const encrypted = CryptoJS.AES.encrypt(
        props.passwordHash,
        'shuyixiao-secret-key-v2'
      ).toString()
      localStorage.setItem(STORAGE_KEY.value, encrypted)
      
      // 成功提示
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }, 100)
    } else {
      errorMessage.value = '❌ 密码错误，请重试'
      inputPassword.value = ''
    }
    isChecking.value = false
  }, 300)
}

// 页面加载时检查是否已解锁
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY.value)
  if (stored) {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        stored,
        'shuyixiao-secret-key-v2'
      ).toString(CryptoJS.enc.Utf8)
      
      if (decrypted === props.passwordHash) {
        isUnlocked.value = true
      }
    } catch (e) {
      // 解密失败，清除存储
      localStorage.removeItem(STORAGE_KEY.value)
    }
  }
})
</script>

<style scoped>
.password-protect {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
}

.password-protect-container {
  max-width: var(--ui-size-480);
  width: 100%;
  padding: var(--sp-48) var(--sp-40);
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-card);
  box-shadow: none;
  border: var(--ui-focus) solid var(--vp-c-divider);
  text-align: center;
}

.lock-icon {
  font-size: var(--ui-text-hero);
  margin-bottom: var(--sp-24);
}

.title {
  font-size: var(--ui-text-title);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  margin-bottom: var(--sp-8);
  background: var(--vp-c-bg-soft);
}

.description {
  font-size: var(--ui-text-lg);
  color: var(--vp-c-text-2);
  margin-bottom: var(--sp-32);
}

.password-input-wrapper {
  display: flex;
  gap: var(--sp-8);
  margin-bottom: var(--sp-16);
}

.password-input {
  flex: 1;
  padding: var(--sp-16) var(--sp-24);
  font-size: var(--ui-text-base);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: var(--ui-transition);
  outline: none;
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: none;
}

.unlock-button {
  padding: var(--sp-16) var(--sp-32);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  color: var(--ui-on-brand);
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  transition: var(--ui-transition);
  white-space: nowrap;
}

.unlock-button:hover {
  box-shadow: none;
}

.error-message {
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-base);
  margin-top: var(--sp-16);
}

.hint {
  margin-top: var(--sp-32);
  padding-top: var(--sp-32);
  border-top: var(--ui-border) solid var(--vp-c-divider);
}

.hint p {
  font-size: var(--ui-text-sm);
  color: var(--ui-muted);
  line-height: var(--ui-leading-body);
}

.unlock-banner {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-12) var(--sp-24);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: var(--ui-radius-input);
  font-weight: var(--ui-weight-heading);
  margin-bottom: var(--sp-32);
  box-shadow: none;
}

.unlock-icon {
  font-size: var(--ui-text-quote);
}

.unlock-text {
  font-size: var(--ui-text-base);
}

@media (max-width: 640px) {
  .password-protect {
    padding: var(--sp-16);
  }
  
  .password-protect-container {
    padding: var(--sp-32) var(--sp-24);
  }
  
  .title {
    font-size: var(--ui-text-section);
  }
  
  .password-input-wrapper {
    flex-direction: column;
  }
  
  .unlock-button {
    width: 100%;
  }
}

.dark .password-protect-container {
  box-shadow: none;
}
</style>

