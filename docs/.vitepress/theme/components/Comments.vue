<template>
  <!-- 如果是 pandacoder-weekly 路由，不显示评论 -->
  <div v-if="!isPandaCoderWeekly" class="comments-section">
    <div class="comments-header">
      <h2 class="comments-title">💬 评论区</h2>
      <button 
        @click="deleteMode = !deleteMode" 
        class="toggle-delete-btn"
        :class="{ active: deleteMode }"
      >
        {{ deleteMode ? '✅ 退出删除模式' : '🗑️ 管理评论' }}
      </button>
    </div>
    
    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
          <button 
            v-if="deleteMode"
            @click="deleteComment(comment.id)" 
            class="delete-btn"
            title="删除评论"
          >
            🗑️ 删除
          </button>
        </div>
        <div class="comment-content" v-html="formatContent(comment.content)"></div>
        <div v-if="comment.images && comment.images.length > 0" class="comment-images">
          <img 
            v-for="(img, idx) in comment.images" 
            :key="idx" 
            :src="img" 
            @click="previewImage(img)"
            class="comment-image"
          />
        </div>
      </div>
    </div>
    
    <div v-else class="no-comments">
      暂无评论，快来抢沙发吧！
    </div>

    <!-- 评论表单 -->
    <div class="comment-form">
      <h3>发表评论</h3>
      <input 
        v-model="form.author" 
        type="text" 
        placeholder="您的昵称" 
        class="form-input"
        maxlength="20"
        @paste="handlePaste"
      />
      <textarea 
        v-model="form.content" 
        placeholder="说点什么吧...（支持 Ctrl+V 粘贴图片）" 
        class="form-textarea"
        rows="4"
        maxlength="500"
        @paste="handlePaste"
      ></textarea>
      
      <!-- 图片上传 -->
      <div class="image-upload">
        <label class="upload-btn">
          📷 上传图片
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            @change="handleImageUpload"
            style="display: none"
          />
        </label>
        <span class="upload-hint">最多3张，每张不超过2MB</span>
      </div>
      
      <!-- 图片预览 -->
      <div v-if="form.images.length > 0" class="image-preview">
        <div v-for="(img, idx) in form.images" :key="idx" class="preview-item">
          <img :src="img" />
          <button @click="removeImage(idx)" class="remove-img">×</button>
        </div>
      </div>

      <button 
        @click="submitComment" 
        :disabled="submitting || !form.author || !form.content"
        class="submit-btn"
      >
        {{ submitting ? '提交中...' : '发表评论' }}
      </button>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewImg" class="image-modal" @click="previewImg = null">
      <img :src="previewImg" />
    </div>

    <!-- Toast 提示 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>

    <!-- 密码输入对话框 -->
    <div v-if="passwordDialog.show" class="dialog-overlay" @click="passwordDialog.show = false">
      <div class="dialog" @click.stop>
        <h3>删除评论</h3>
        <p>请输入管理员密码</p>
        <input 
          v-model="passwordDialog.password" 
          type="password" 
          placeholder="管理员密码"
          class="dialog-input"
          @keyup.enter="confirmDelete"
        />
        <div class="dialog-actions">
          <button @click="passwordDialog.show = false" class="dialog-btn cancel">取消</button>
          <button @click="confirmDelete" class="dialog-btn confirm">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const comments = ref([]);
const form = ref({
  author: '',
  content: '',
  images: []
});
const submitting = ref(false);
const previewImg = ref(null);
const showDeleteButton = ref(false);
const deleteMode = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });
const passwordDialog = ref({ show: false, commentId: null });

// 检查是否是 PandaCoder 周报页面
const isPandaCoderWeekly = computed(() => {
  return route.path.includes('/tools/pandacoder-weekly/');
});

// API 基础路径
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

// 使用 v2 版本（不依赖邮件功能）
const API_ENDPOINT = import.meta.env.DEV 
  ? `${API_BASE}/comments`
  : `${API_BASE}/comments-v2`;

// 获取当前文章路径
const getArticlePath = () => {
  return route.path;
};

// 加载评论
const loadComments = async () => {
  try {
    const path = getArticlePath();
    const response = await fetch(`${API_ENDPOINT}?path=${encodeURIComponent(path)}`);
    const data = await response.json();
    if (data.comments) {
      comments.value = data.comments.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    }
  } catch (error) {
    console.error('加载评论失败:', error);
  }
};

// 显示 Toast 提示
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// 提交评论
const submitComment = async () => {
  if (!form.value.author.trim() || !form.value.content.trim()) {
    showToast('请填写昵称和评论内容', 'error');
    return;
  }

  submitting.value = true;
  try {
    console.log('提交评论:', {
      path: getArticlePath(),
      author: form.value.author,
      contentLength: form.value.content.length,
      imagesCount: form.value.images.length
    });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: getArticlePath(),
        author: form.value.author,
        content: form.value.content,
        images: form.value.images
      })
    });

    const data = await response.json();
    console.log('提交响应:', data);

    if (data.success) {
      // 直接添加到评论列表，无需重新加载
      comments.value.unshift(data.comment);
      
      showToast('评论发表成功！', 'success');
      form.value.content = '';
      form.value.images = [];
    } else {
      showToast('评论发表失败：' + (data.error || '未知错误'), 'error');
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    showToast('评论发表失败，请稍后重试', 'error');
  } finally {
    submitting.value = false;
  }
};

// 删除评论
const deleteComment = (commentId) => {
  passwordDialog.value = {
    show: true,
    commentId,
    password: ''
  };
};

// 确认删除
const confirmDelete = async () => {
  const { commentId, password } = passwordDialog.value;
  
  if (!password) {
    showToast('请输入密码', 'error');
    return;
  }

  try {
    console.log('删除评论:', commentId);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: getArticlePath(),
        commentId,
        password
      })
    });

    const data = await response.json();
    console.log('删除响应:', data);
    
    passwordDialog.value.show = false;
    
    if (data.success) {
      // 直接从列表中移除，无需重新加载
      comments.value = comments.value.filter(c => c.id !== commentId);
      showToast('评论已删除', 'success');
    } else {
      showToast('删除失败：' + (data.error || '未知错误'), 'error');
    }
  } catch (error) {
    console.error('删除评论失败:', error);
    showToast('删除失败，请稍后重试', 'error');
    passwordDialog.value.show = false;
  }
};

// 图片上传处理
const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  
  if (form.value.images.length + files.length > 3) {
    showToast('最多只能上传3张图片', 'error');
    return;
  }

  for (const file of files) {
    if (file.size > 2 * 1024 * 1024) {
      showToast(`图片 ${file.name} 超过2MB，请压缩后上传`, 'error');
      continue;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

// 处理粘贴事件（支持粘贴图片）
const handlePaste = async (event) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault();
      
      if (form.value.images.length >= 3) {
        showToast('最多只能上传3张图片', 'error');
        return;
      }

      const file = item.getAsFile();
      if (file.size > 2 * 1024 * 1024) {
        showToast('图片超过2MB，请压缩后上传', 'error');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.images.push(e.target.result);
        showToast('图片已添加', 'success');
      };
      reader.readAsDataURL(file);
    }
  }
};

// 移除图片
const removeImage = (index) => {
  form.value.images.splice(index, 1);
};

// 预览图片
const previewImage = (img) => {
  previewImg.value = img;
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return date.toLocaleDateString('zh-CN');
};

// 格式化评论内容（支持换行）
const formatContent = (content) => {
  return content.replace(/\n/g, '<br>');
};

// 检查是否显示删除按钮（按住Shift键3秒）
let shiftTimer = null;
const handleKeyDown = (e) => {
  if (e.key === 'Shift' && !shiftTimer) {
    shiftTimer = setTimeout(() => {
      showDeleteButton.value = true;
    }, 3000);
  }
};

const handleKeyUp = (e) => {
  if (e.key === 'Shift') {
    if (shiftTimer) {
      clearTimeout(shiftTimer);
      shiftTimer = null;
    }
  }
};

onMounted(() => {
  loadComments();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});
</script>

<style scoped>
.comments-section {
  margin-top: 60px;
  padding: 2rem;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.comments-section:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.comments-title {
  font-size: 1.8rem;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-delete-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toggle-delete-btn:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.toggle-delete-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.comments-list {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
}

.comment-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-soft);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.comment-author {
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-author::before {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  border-radius: 50%;
  opacity: 0.2;
}

.comment-time {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.delete-btn {
  margin-left: auto;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.2);
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-weight: 500;
}

.delete-btn:hover {
  background: #ff4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
}

.comment-content {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  word-wrap: break-word;
  font-size: 1rem;
  padding-left: 3.5rem;
}

.comment-images {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  padding-left: 3.5rem;
}

.comment-image {
  max-width: 180px;
  max-height: 180px;
  border-radius: 12px;
  cursor: zoom-in;
  transition: all 0.3s ease;
  border: 2px solid var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.comment-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand-1);
}

.no-comments {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 2px dashed var(--vp-c-divider);
  margin-bottom: 2rem;
}

.no-comments::before {
  content: '💭';
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.comment-form {
  padding: 2rem;
  background: var(--vp-c-bg);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.comment-form h3 {
  margin: 0 0 1.5rem;
  color: var(--vp-c-text-1);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-form h3::before {
  content: '✍️';
  font-size: 1.2rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px var(--vp-c-brand-dimm);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px dashed var(--vp-c-divider);
}

.upload-btn {
  padding: 0.6rem 1.2rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.upload-hint {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.image-preview {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.preview-item:hover {
  transform: scale(1.05);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.remove-img:hover {
  background: #ff4444;
  transform: scale(1.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--vp-c-text-3);
  box-shadow: none;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.image-modal img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  z-index: 10000;
  animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog {
  background: var(--vp-c-bg);
  border-radius: 24px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid var(--vp-c-divider);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dialog h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.dialog p {
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  text-align: center;
}

.dialog-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  box-sizing: border-box;
  margin-bottom: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.dialog-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px var(--vp-c-brand-dimm);
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.dialog-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.dialog-btn.cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.dialog-btn.cancel:hover {
  background: var(--vp-c-divider);
  transform: translateY(-2px);
}

.dialog-btn.confirm {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.dialog-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .comments-section {
    padding: 1.5rem;
    margin-top: 40px;
  }

  .comments-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .toggle-delete-btn {
    width: 100%;
    justify-content: center;
  }

  .comment-item {
    padding: 1.2rem;
  }

  .comment-content,
  .comment-images {
    padding-left: 0;
  }

  .comment-header {
    flex-wrap: wrap;
  }

  .delete-btn {
    width: 100%;
    margin-top: 0.5rem;
    justify-content: center;
    display: flex;
  }

  .comment-image {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
