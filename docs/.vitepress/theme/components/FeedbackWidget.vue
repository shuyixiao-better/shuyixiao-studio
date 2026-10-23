<template>
  <Teleport to="body">
    <!-- 悬浮按钮 - 仅在支持 API 的环境显示 -->
    <button type="button"
      v-if="!isModalOpen && isApiAvailable" 
      class="feedback-button" 
      @click="openModal"
      :class="{ 'feedback-button-hidden': isScrollingUp }"
      title="给作者留言" aria-label="给作者留言"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <!-- 反馈弹窗 -->
    <Transition name="modal">
      <div v-if="isModalOpen" class="feedback-modal-overlay" @click="closeModal">
        <div class="feedback-modal" @click.stop>
          <!-- 关闭按钮 -->
          <button class="close-button" @click="closeModal" aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- 标题 -->
          <div class="modal-header">
            <h3> 给作者留言</h3>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
import { hasBackend } from '../utils/deploy-env.js';
import { useData, useRoute } from 'vitepress';

const { frontmatter, page } = useData();
const route = useRoute();

// 状态管理
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isScrollingUp = ref(false);
const isApiAvailable = ref(false); // 是否支持 API（Netlify Functions）
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

// 获取反馈接收邮箱（从 meta 标签读取）
const getFeedbackEmail = () => {
  if (typeof document !== 'undefined') {
    const metaTag = document.querySelector('meta[name="feedback-email"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || 'shuyixiao@163.com';
    }
  }
  // 默认邮箱（如果没有配置）
  return 'shuyixiao@163.com';
};

// 生成 mailto 链接（用于 GitHub Pages 等不支持 API 的环境）
const generateMailtoLink = () => {
  const subject = encodeURIComponent(`📬 用户反馈${currentArticle.value ? `：${currentArticle.value}` : ''}`);
  const bodyParts = [];
  
  if (formData.value.name) {
    bodyParts.push(`姓名：${formData.value.name}`);
  }
  if (formData.value.email) {
    bodyParts.push(`邮箱：${formData.value.email}`);
  }
  if (formData.value.contact) {
    bodyParts.push(`联系方式：${formData.value.contact}`);
  }
  bodyParts.push('');
  bodyParts.push(`反馈内容：`);
  bodyParts.push(formData.value.content);
  bodyParts.push('');
  if (currentArticle.value) {
    bodyParts.push(`文章标题：${currentArticle.value}`);
  }
  if (currentArticleUrl.value) {
    bodyParts.push(`文章链接：${currentArticleUrl.value}`);
  }
  
  const body = encodeURIComponent(bodyParts.join('\n'));
  const receiverEmail = getFeedbackEmail();
  
  return `mailto:${receiverEmail}?subject=${subject}&body=${body}`;
};

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
  if (typeof window === 'undefined') return;
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

    // 特殊处理 404：本地开发环境或 API 不存在
    if (response.status === 404) {
      showToast('⚠️ 本地开发环境不支持邮件发送\n请使用 pnpm docs:dev:netlify 命令测试', 'info');
      console.warn('💡 提示：本地开发需要使用 Netlify CLI\n运行命令：pnpm docs:dev:netlify');
      isSubmitting.value = false;
      return;
    }

    // 特殊处理 405：GitHub Pages 等静态部署环境不支持
    if (response.status === 405) {
      // 提供备用方案：生成邮件链接
      const mailtoLink = generateMailtoLink();
      showToast('📧 GitHub Pages 不支持在线发送\n已为您生成邮件链接', 'info');
      
      // 延迟一下让用户看到提示，然后打开邮件客户端
      setTimeout(() => {
        window.location.href = mailtoLink;
        // 关闭弹窗
        setTimeout(() => {
          closeModal();
          // 重置表单
          formData.value = {
            name: '',
            email: '',
            contact: '',
            content: ''
          };
        }, 500);
      }, 1500);
      isSubmitting.value = false;
      return;
    }

    // 尝试解析 JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // JSON 解析失败，可能是服务器错误
      // 如果是 405，提供备用方案
      if (response.status === 405) {
        const mailtoLink = generateMailtoLink();
        showToast('📧 当前环境不支持在线发送\n已为您生成邮件链接', 'info');
        setTimeout(() => {
          window.location.href = mailtoLink;
          setTimeout(() => {
            closeModal();
            formData.value = {
              name: '',
              email: '',
              contact: '',
              content: ''
            };
          }, 500);
        }, 1500);
        isSubmitting.value = false;
        return;
      }
      throw new Error('服务器响应格式错误');
    }

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
    // 网络错误或其他错误
    // 检查是否是 405 相关错误
    if (error.message && error.message.includes('405') || 
        (error.message && error.message.includes('Method Not Allowed'))) {
      const mailtoLink = generateMailtoLink();
      showToast('📧 当前环境不支持在线发送\n已为您生成邮件链接', 'info');
      setTimeout(() => {
        window.location.href = mailtoLink;
        setTimeout(() => {
          closeModal();
          formData.value = {
            name: '',
            email: '',
            contact: '',
            content: ''
          };
        }, 500);
      }, 1500);
      isSubmitting.value = false;
      return;
    }
    
    console.error('Submit feedback error:', error);
    showToast(error.message || '发送失败，请稍后重试', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 检测 API 是否可用（检测是否为 Netlify 环境）
const checkApiAvailability = async () => {
  isApiAvailable.value = await hasBackend();
};

// 监听ESC键关闭弹窗
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    // 检测 API 可用性
    checkApiAvailability();
    
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
.feedback-button {
  position: fixed;
  bottom: var(--sp-80);
  right: var(--sp-32);
  width: var(--sp-56);
  height: var(--sp-56);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: none;
  transition: var(--ui-transition);
  z-index: 999;
  color: var(--vp-c-text-2);
}

.feedback-button:hover {
  box-shadow: none;
}

.feedback-button-hidden {
  opacity: 0;
  pointer-events: none;
}

.feedback-button svg {
  width: var(--sp-24);
  height: var(--sp-24);
}
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ui-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--sp-20);
}
.feedback-modal {
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-card);
  max-width: var(--ui-size-560);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: none;
  position: relative;
  padding: var(--sp-32);
}
.close-button {
  position: absolute;
  top: var(--sp-16);
  right: var(--sp-16);
  width: var(--sp-32);
  height: var(--sp-32);
  border: none;
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--ui-transition);
  color: var(--vp-c-text-2);
}

.close-button:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}
.modal-header {
  margin-bottom: var(--sp-24);
  text-align: center;
}

.modal-header h3 {
  margin: 0 0 var(--sp-8) 0;
  font-size: var(--ui-text-section);
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
}

.modal-subtitle {
  margin: 0;
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-1);
}
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-20);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.form-group label {
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  color: var(--vp-c-text-1);
}

.optional {
  font-size: var(--ui-text-xs);
  color: var(--ui-muted);
  font-weight: var(--ui-weight-body);
}

.required {
  color: var(--vp-c-text-2);
  margin-left: var(--sp-4);
}

.form-group input,
.form-group textarea {
  padding: var(--sp-12);
  border: var(--ui-border) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-sm);
  font-family: inherit;
  transition: var(--ui-transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: none;
}

.form-group textarea {
  resize: vertical;
  min-height: var(--sp-120);
}

.char-count {
  font-size: var(--ui-text-xs);
  color: var(--ui-muted);
  text-align: right;
}
.current-article-info {
  padding: var(--sp-12);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border-left: var(--sp-4) solid var(--vp-c-brand-1);
}

.article-badge {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  font-size: var(--ui-text-meta);
  color: var(--vp-c-text-2);
}

.article-badge svg {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}
.form-actions {
  display: flex;
  gap: var(--sp-12);
  margin-top: var(--sp-8);
}

.btn {
  flex: 1;
  padding: var(--sp-12) var(--sp-24);
  border: none;
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  cursor: pointer;
  transition: var(--ui-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-8);
}

.btn-cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.btn-cancel:hover:not(:disabled) {
  background: var(--vp-c-bg-mute);
}

.btn-submit {
  background: var(--vp-c-brand-1);
  color: var(--ui-on-brand);
}

.btn-submit:hover:not(:disabled) {
  box-shadow: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.loading-text {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
}

.spinner {
  width: var(--sp-16);
  height: var(--sp-16);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-top-color: white;
  border-radius: var(--ui-radius-input);
}
.toast {
  position: absolute;
  bottom: var(--sp-20);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--sp-12) var(--sp-24);
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  box-shadow: none;
  z-index: 10000;
  white-space: pre-line;
  text-align: center;
  max-width: 90%;
}

.toast-success {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.toast-error {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.toast-info {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
.modal-enter-active,
.modal-leave-active {
  transition: var(--ui-transition);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .feedback-modal,
.modal-leave-active .feedback-modal {
  transition: var(--ui-transition);
}

.toast-enter-active,
.toast-leave-active {
  transition: var(--ui-transition);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
@media (max-width: 640px) {
  .feedback-button {
    bottom: var(--sp-60);
    right: var(--sp-20);
    width: var(--sp-52);
    height: var(--sp-52);
  }

  .feedback-button svg {
    width: var(--sp-20);
    height: var(--sp-20);
  }

  .feedback-modal {
    padding: var(--sp-24);
    max-height: 85vh;
  }

  .modal-header h3 {
    font-size: var(--ui-text-quote);
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
.dark .feedback-button {
  box-shadow: none;
}

.dark .feedback-button:hover {
  box-shadow: none;
}

.dark .feedback-modal {
  box-shadow: none;
}

.feedback-button { width: var(--ui-float-size); height: var(--ui-float-size); right: var(--sp-20); bottom: var(--sp-72); border-radius: var(--ui-radius-circle); background: var(--ui-surface); color: var(--vp-c-text-2); border: var(--ui-border) solid var(--vp-c-divider); padding: 0; box-shadow: none; z-index: 99; }
.feedback-button:hover { background: var(--ui-surface); color: var(--vp-c-brand-1); }
.feedback-button svg { width: var(--sp-20); height: var(--sp-20); }
.feedback-modal-overlay { background: var(--ui-overlay); }
.feedback-modal { background: var(--ui-surface); border: var(--ui-border) solid var(--vp-c-divider); box-shadow: var(--ui-shadow); }
</style>

