<template>
  <div class="comments-section">
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
  padding: 30px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.comments-title {
  font-size: 24px;
  margin: 0;
  color: var(--vp-c-text-1);
}

.toggle-delete-btn {
  padding: 8px 16px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toggle-delete-btn:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.toggle-delete-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.comments-list {
  margin-bottom: 30px;
}

.comment-item {
  padding: 20px;
  margin-bottom: 16px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.comment-author {
  font-weight: 600;
  color: var(--vp-c-brand);
}

.comment-time {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.delete-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #cc0000;
  transform: scale(1.05);
}

.comment-content {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  word-wrap: break-word;
}

.comment-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.comment-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.comment-image:hover {
  transform: scale(1.05);
}

.no-comments {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
}

.comment-form {
  padding: 24px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.comment-form h3 {
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.upload-btn {
  padding: 8px 16px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: var(--vp-c-brand-light);
}

.upload-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.image-preview {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-img {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  z-index: 10000;
  animation: slideDown 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: #67c23a;
}

.toast.error {
  background: #f56c6c;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog h3 {
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.dialog p {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.dialog-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.dialog-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.dialog-btn.cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.dialog-btn.cancel:hover {
  background: var(--vp-c-divider);
}

.dialog-btn.confirm {
  background: #f56c6c;
  color: white;
}

.dialog-btn.confirm:hover {
  background: #f45454;
}

@media (max-width: 768px) {
  .comments-section {
    padding: 20px;
  }
  
  .comments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .toggle-delete-btn {
    width: 100%;
  }
  
  .comment-item {
    padding: 16px;
  }
  
  .comment-header {
    flex-wrap: wrap;
  }
  
  .delete-btn {
    margin-left: 0;
    margin-top: 8px;
  }
  
  .comment-image {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
