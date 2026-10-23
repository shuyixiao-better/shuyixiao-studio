<template>
  <!-- 如果是 pandacoder-weekly 路由，不显示评论 -->
  <div v-if="!isPandaCoderWeekly" id="评论区" class="comments-section">
    <div class="comments-header">
      <h2 class="comments-title"> 评论区</h2>
      <button 
        @click="deleteMode = !deleteMode" 
        class="toggle-delete-btn"
        :class="{ active: deleteMode }"
      >
        {{ deleteMode ? ' 退出删除模式' : ' 管理评论' }}
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
             删除
          </button>
        </div>
        <div class="comment-content" v-html="formatContent(comment.content)"></div>
        <div v-if="comment.images && comment.images.length > 0" class="comment-images">
          <img 
            v-for="(img, idx) in comment.images" 
            :key="idx" 
            :src="img" 
            @click="previewImage(img)" role="button" tabindex="0" :alt="`评论图片 ${idx + 1}`" @keydown.enter="previewImage(img)" @keydown.space.prevent="previewImage(img)"
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
        <label class="upload-btn" role="button" tabindex="0" @keydown.enter.prevent="uploadInput?.click()" @keydown.space.prevent="uploadInput?.click()">
           上传图片
          <input ref="uploadInput"
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
const uploadInput = ref(null);
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
  if (isPandaCoderWeekly.value) return;
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
  margin-top: var(--sp-80);
  padding: 0 var(--sp-32);
  max-width: var(--ui-size-900);
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-40);
  padding-top: var(--sp-48);
}

.comments-title {
  font-size: var(--ui-text-title);
  margin: 0;
  font-weight: var(--ui-weight-heading);
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  gap: var(--sp-12);
  letter-spacing: normal;
}

.toggle-delete-btn {
  padding: var(--sp-8) var(--sp-20);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: var(--ui-border) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  transition: var(--ui-transition);
  display: flex;
  align-items: center;
  gap: var(--sp-8);
}

.toggle-delete-btn:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: none;
}

.toggle-delete-btn.active {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  border-color: transparent;
  box-shadow: none;
}

.comments-list {
  margin-bottom: var(--sp-48);
  display: flex;
  flex-direction: column;
  gap: var(--sp-32);
}

.comment-item {
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  transition: var(--ui-transition);
  position: relative;
  box-shadow: none;
}

.comment-item:hover {
  box-shadow: none;
  border-color: var(--vp-c-brand-soft);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--sp-20);
  gap: var(--sp-16);
}

.comment-author {
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-lg);
  display: flex;
  align-items: center;
  gap: var(--sp-12);
}

.comment-time {
  font-size: var(--ui-text-sm);
  color: var(--ui-muted);
  background: var(--vp-c-bg-soft);
  padding: var(--sp-4) var(--sp-12);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
}

.delete-btn {
  margin-left: auto;
  padding: var(--sp-8) var(--sp-12);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: var(--ui-border) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  font-size: var(--ui-text-sm);
  transition: var(--ui-transition);
  font-weight: var(--ui-weight-medium);
  opacity: 0.8;
}

.delete-btn:hover {
  opacity: 1;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  box-shadow: none;
}

.comment-content {
  color: var(--vp-c-text-1);
  line-height: var(--ui-leading-body);
  word-wrap: break-word;
  font-size: var(--ui-text-base);
  padding-left: var(--sp-64);
  opacity: 0.9;
}

.comment-images {
  display: flex;
  gap: var(--sp-16);
  margin-top: var(--sp-24);
  flex-wrap: wrap;
  padding-left: var(--sp-64);
}

.comment-image {
  max-width: var(--ui-size-200);
  max-height: var(--ui-size-200);
  border-radius: var(--ui-radius-input);
  cursor: zoom-in;
  transition: var(--ui-transition);
  border: var(--ui-focus) solid var(--vp-c-bg-soft);
  box-shadow: none;
}

.comment-image:hover {
  box-shadow: none;
  border-color: var(--vp-c-brand-1);
}

.no-comments {
  text-align: center;
  padding: var(--sp-80) var(--sp-32);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  margin-bottom: var(--sp-48);
  position: relative;
  overflow: hidden;
}

.comment-form {
  padding: var(--sp-48);
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) solid var(--vp-c-divider);
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.comment-form h3 {
  margin: 0 0 var(--sp-32);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-section);
  font-weight: var(--ui-weight-heading);
  display: flex;
  align-items: center;
  gap: var(--sp-12);
  justify-content: center;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--sp-20);
  margin-bottom: var(--sp-20);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
  font-family: inherit;
  box-sizing: border-box;
  transition: var(--ui-transition);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: none;
}

.form-textarea {
  resize: vertical;
  min-height: var(--sp-152);
}

.image-upload {
  display: flex;
  align-items: center;
  gap: var(--sp-20);
  margin-bottom: var(--sp-32);
  padding: var(--sp-20);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  border: var(--ui-border) dashed var(--vp-c-divider);
  transition: var(--ui-transition);
}

.image-upload:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.upload-btn {
  padding: var(--sp-12) var(--sp-24);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  transition: var(--ui-transition);
  display: flex;
  align-items: center;
  gap: var(--sp-8);
}

.upload-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  box-shadow: none;
}

.upload-hint {
  font-size: var(--ui-text-sm);
  color: var(--ui-muted);
}

.image-preview {
  display: flex;
  gap: var(--sp-20);
  margin-bottom: var(--sp-32);
  flex-wrap: wrap;
  padding: var(--sp-20);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
}

.preview-item {
  position: relative;
  width: var(--sp-120);
  height: var(--sp-120);
  border-radius: var(--ui-radius-input);
  overflow: hidden;
  box-shadow: none;
  transition: var(--ui-transition);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: var(--sp-8);
  right: var(--sp-8);
  width: var(--sp-28);
  height: var(--sp-28);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: none;
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  font-size: var(--ui-text-lg);
  line-height: var(--ui-leading-body);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--ui-transition);
}

.remove-img:hover {
  background: var(--vp-c-bg-soft);
}

.submit-btn {
  width: 100%;
  padding: var(--sp-20);
  background: var(--vp-c-brand-1);
  color: var(--ui-on-brand);
  border: none;
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-quote);
  font-weight: var(--ui-weight-heading);
  cursor: pointer;
  transition: var(--ui-transition);
  box-shadow: none;
  letter-spacing: normal;
}

.submit-btn:hover:not(:disabled) {
  box-shadow: none;
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
  background: var(--ui-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.image-modal img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: var(--ui-radius-card);
  box-shadow: none;
}
.toast {
  position: fixed;
  top: var(--sp-100);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--sp-16) var(--sp-40);
  border-radius: var(--ui-radius-input);
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-lg);
  font-weight: var(--ui-weight-medium);
  z-index: 10000;
  box-shadow: none;
  display: flex;
  align-items: center;
  gap: var(--sp-12);
}

.toast.success {
  background: var(--vp-c-bg-soft);
}

.toast.error {
  background: var(--vp-c-bg-soft);
}
.dialog-overlay {
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
}

.dialog {
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-card);
  padding: var(--sp-40);
  width: 90%;
  max-width: var(--ui-size-420);
  box-shadow: none;
  border: var(--ui-border) solid var(--vp-c-divider);
}

.dialog h3 {
  margin: 0 0 var(--sp-16) 0;
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-section);
  font-weight: var(--ui-weight-heading);
  text-align: center;
}

.dialog p {
  margin: 0 0 var(--sp-32) 0;
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-lg);
  text-align: center;
}

.dialog-input {
  width: 100%;
  padding: var(--sp-20);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-card);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-lg);
  box-sizing: border-box;
  margin-bottom: var(--sp-32);
  text-align: center;
  transition: var(--ui-transition);
}

.dialog-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: none;
}

.dialog-actions {
  display: flex;
  gap: var(--sp-20);
  justify-content: center;
}

.dialog-btn {
  padding: var(--sp-16) var(--sp-32);
  border: none;
  border-radius: var(--ui-radius-card);
  font-size: var(--ui-text-lg);
  font-weight: var(--ui-weight-heading);
  cursor: pointer;
  transition: var(--ui-transition);
  flex: 1;
}

.dialog-btn.cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.dialog-btn.cancel:hover {
  background: var(--vp-c-divider);
}

.dialog-btn.confirm {
  background: var(--vp-c-brand-1);
  color: var(--ui-on-brand);
  box-shadow: none;
}

.dialog-btn.confirm:hover {
  box-shadow: none;
}
@media (max-width: 768px) {
  .comments-section {
    padding: 0 var(--sp-24);
    margin-top: var(--sp-48);
  }

  .comments-header {
    flex-direction: column;
    gap: var(--sp-24);
    align-items: center;
    padding-top: var(--sp-32);
    margin-bottom: var(--sp-32);
  }

  .comments-title {
    font-size: var(--ui-text-title);
  }

  .toggle-delete-btn {
    width: 100%;
    justify-content: center;
    padding: var(--sp-12);
  }

  .comment-item {
    padding: var(--sp-24);
  }

  .comment-content,
  .comment-images {
    padding-left: 0;
  }

  .comment-header {
    flex-wrap: wrap;
    gap: var(--sp-12);
  }

  .comment-author {
    font-size: var(--ui-text-lg);
  }

  .delete-btn {
    width: 100%;
    margin-top: var(--sp-16);
    justify-content: center;
    display: flex;
    padding: var(--sp-8);
  }

  .comment-image {
    max-width: 100%;
    width: 100%;
    height: var(--ui-size-200);
  }

  .comment-form {
    padding: var(--sp-24);
  }

  .image-upload {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .upload-btn {
    justify-content: center;
  }
}
</style>
