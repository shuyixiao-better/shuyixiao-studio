<template>
  <div v-if="!isUnlocked" class="password-protect">
    <div class="password-protect-container">
      <div class="lock-icon">🔒</div>
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
          <span v-if="!isChecking">🔓 解锁</span>
          <span v-else>验证中...</span>
        </button>
      </div>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      
      <div class="hint">
        <p>💡 提示：如果你忘记了密码，请联系作者获取访问权限</p>
      </div>
    </div>
  </div>
  
  <div v-else class="password-protect-content">
    <div class="unlock-banner">
      <span class="unlock-icon">✅</span>
      <span class="unlock-text">内容已解锁</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CryptoJS from 'crypto-js'

const props = defineProps({
  // 接收加密后的密码哈希值
  passwordHash: {
    type: String,
    default: 'e614c56a130dd5c63280ed4f4fce9a3aa8e9dc875840db6bdea32aaf29abc0cf' // "0917" 的 SHA256 哈希
  }
})

const isUnlocked = ref(false)
const inputPassword = ref('')
const errorMessage = ref('')
const isChecking = ref(false)

const STORAGE_KEY = 'password_protect_unlock'

// 计算密码的SHA256哈希
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString()
}

// 检查密码
const checkPassword = () => {
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
      localStorage.setItem(STORAGE_KEY, encrypted)
      
      // 成功提示
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
  const stored = localStorage.getItem(STORAGE_KEY)
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
      localStorage.removeItem(STORAGE_KEY)
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
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(66, 153, 225, 0.05) 0%,
    rgba(159, 122, 234, 0.05) 100%);
}

.password-protect-container {
  max-width: 480px;
  width: 100%;
  padding: 3rem 2.5rem;
  background: var(--vp-c-bg);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--vp-c-divider);
  text-align: center;
}

.lock-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: lock-bounce 2s ease-in-out infinite;
}

@keyframes lock-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4299e1, #9f7aea);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.password-input-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.password-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  outline: none;
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.unlock-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #4299e1, #9f7aea);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.unlock-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(66, 153, 225, 0.3);
}

.unlock-button:active {
  transform: translateY(0);
}

.error-message {
  color: #f56565;
  font-size: 0.95rem;
  margin-top: 1rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.hint {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.hint p {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
}

.password-protect-content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.unlock-banner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.unlock-icon {
  font-size: 1.2rem;
}

.unlock-text {
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .password-protect {
    padding: 1rem;
  }
  
  .password-protect-container {
    padding: 2rem 1.5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .password-input-wrapper {
    flex-direction: column;
  }
  
  .unlock-button {
    width: 100%;
  }
}

.dark .password-protect-container {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
</style>

