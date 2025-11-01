<template>
  <Teleport to="body">
    <!-- 悬浮按钮 -->
    <div 
      v-if="!isModalOpen" 
      class="feedback-button" 
      @click="openModal"
      :class="{ 'feedback-button-hidden': isScrollingUp }"
      title="给作者留言"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>

    <!-- 反馈弹窗 -->
    <Transition name="modal">
      <div v-if="isModalOpen" class="feedback-modal-overlay" @click="closeModal">
        <div class="feedback-modal" @click.stop>
          <!-- 关闭按钮 -->
          <button class="close-button" @click="closeModal" aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- 标题 -->
          <div class="modal-header">
            <h3>💌 给作者留言</h3>
            <p class="modal-subtitle">您的反馈对我很重要</p>
          </div>

          <!-- 表单 -->
          <form @submit.prevent="submitFeedback" class="feedback-form">
            <div class="form-group">
              <label for="name">
                <span>姓名</span>
                <span class="optional">（选填）</span>
              </label>
              <input 
                id="name"
                v-model="formData.name" 
                type="text" 
                placeholder="您的称呼"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="email">
                <span>邮箱</span>
                <span class="optional">（选填，用于回复）</span>
              </label>
              <input 
                id="email"
                v-model="formData.email" 
                type="email" 
                placeholder="your@email.com"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="contact">
                <span>联系方式</span>
                <span class="optional">（选填，微信/QQ/电话）</span>
              </label>
              <input 
                id="contact"
                v-model="formData.contact" 
                type="text" 
                placeholder="便于联系的方式"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="content">
                <span>反馈内容</span>
                <span class="required">*</span>
              </label>
              <textarea 
                id="content"
                v-model="formData.content" 
                placeholder="请输入您的建议、问题或想法..."
                rows="6"
                maxlength="5000"
                required
              ></textarea>
              <div class="char-count">{{ formData.content.length }} / 5000</div>
            </div>

            <!-- 当前文章信息（自动获取） -->
            <div v-if="currentArticle" class="current-article-info">
              <div class="article-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>关于文章：{{ currentArticle }}</span>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-cancel" 
                @click="closeModal"
                :disabled="isSubmitting"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn btn-submit" 
                :disabled="isSubmitting || !formData.content.trim()"
              >
                <span v-if="!isSubmitting">发送留言</span>
                <span v-else class="loading-text">
                  <span class="spinner"></span>
                  发送中...
                </span>
              </button>
            </div>
          </form>

          <!-- 提示信息 -->
          <Transition name="toast">
            <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
              {{ toast.message }}
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useData, useRoute } from 'vitepress';

const { frontmatter, page } = useData();
const route = useRoute();

// 状态管理
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isScrollingUp = ref(false);
let lastScrollY = 0;

// 表单数据
const formData = ref({
  name: '',
  email: '',
  contact: '',
  content: ''
});

// 提示信息
const toast = ref({
  show: false,
  message: '',
  type: 'success' // success, error, info
});

// 获取当前文章标题
const currentArticle = computed(() => {
  return frontmatter.value?.title || page.value?.title || '';
});

// 获取当前文章URL
const currentArticleUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
});

// 监听滚动，自动隐藏/显示按钮
const handleScroll = () => {
  if (typeof window !== 'undefined') {
    const currentScrollY = window.scrollY;
    
    // 滚动超过200px才开始判断
    if (currentScrollY > 200) {
      if (currentScrollY > lastScrollY) {
        // 向下滚动，隐藏按钮
        isScrollingUp.value = true;
      } else {
        // 向上滚动，显示按钮
        isScrollingUp.value = false;
      }
    } else {
      // 在顶部时显示按钮
      isScrollingUp.value = false;
    }
    
    lastScrollY = currentScrollY;
  }
};

// 打开弹窗
const openModal = () => {
  isModalOpen.value = true;
  // 禁止背景滚动
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

// 关闭弹窗
const closeModal = () => {
  isModalOpen.value = false;
  // 恢复背景滚动
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

// 显示提示
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// 提交反馈
const submitFeedback = async () => {
  if (isSubmitting.value || !formData.value.content.trim()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.name.trim() || '匿名用户',
        email: formData.value.email.trim(),
        contact: formData.value.contact.trim(),
        content: formData.value.content.trim(),
        articleTitle: currentArticle.value,
        articleUrl: currentArticleUrl.value
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast('感谢您的反馈！留言已成功发送 🎉', 'success');
      
      // 重置表单
      formData.value = {
        name: '',
        email: '',
        contact: '',
        content: ''
      };

      // 2秒后关闭弹窗
      setTimeout(() => {
        closeModal();
      }, 2000);
    } else {
      throw new Error(data.error || '发送失败');
    }
  } catch (error) {
    console.error('Submit feedback error:', error);
    showToast(error.message || '发送失败，请稍后重试', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 监听ESC键关闭弹窗
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* 悬浮按钮 */
.feedback-button {
  position: fixed;
  bottom: 80px;
  right: 30px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  color: white;
}

.feedback-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(62, 175, 124, 0.5);
}

.feedback-button-hidden {
  transform: translateY(100px);
  opacity: 0;
  pointer-events: none;
}

.feedback-button svg {
  width: 24px;
  height: 24px;
}

/* 弹窗遮罩 */
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 弹窗主体 */
.feedback-modal {
  background: var(--vp-c-bg);
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  padding: 32px;
}

/* 关闭按钮 */
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vp-c-text-2);
}

.close-button:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  transform: scale(1.1);
}

/* 弹窗标题 */
.modal-header {
  margin-bottom: 24px;
  text-align: center;
}

.modal-header h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* 表单样式 */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.optional {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.required {
  color: #ff4757;
  margin-left: 4px;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: right;
}

/* 当前文章信息 */
.current-article-info {
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.article-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.article-badge svg {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.btn-cancel:hover:not(:disabled) {
  background: var(--vp-c-bg-mute);
}

.btn-submit {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载动画 */
.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 提示消息 */
.toast {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
}

.toast-success {
  background: #10b981;
  color: white;
}

.toast-error {
  background: #ef4444;
  color: white;
}

.toast-info {
  background: var(--vp-c-brand-1);
  color: white;
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .feedback-modal,
.modal-leave-active .feedback-modal {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .feedback-modal,
.modal-leave-to .feedback-modal {
  transform: scale(0.9) translateY(20px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .feedback-button {
    bottom: 60px;
    right: 20px;
    width: 50px;
    height: 50px;
  }

  .feedback-button svg {
    width: 20px;
    height: 20px;
  }

  .feedback-modal {
    padding: 24px;
    max-height: 85vh;
  }

  .modal-header h3 {
    font-size: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

/* 暗色模式优化 */
.dark .feedback-button {
  box-shadow: 0 4px 12px rgba(66, 211, 146, 0.3);
}

.dark .feedback-button:hover {
  box-shadow: 0 8px 24px rgba(66, 211, 146, 0.4);
}

.dark .feedback-modal {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}
</style>

