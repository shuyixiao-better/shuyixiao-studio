<template>
  <div class="comments-section">
    <h2 class="comments-title">💬 评论区</h2>
    
    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
          <button 
            v-if="showDeleteButton"
            @click="deleteComment(comment.id)" 
            class="delete-btn"
            title="删除评论"
          >
            🗑️
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
      />
      <textarea 
        v-model="form.content" 
        placeholder="说点什么吧..." 
        class="form-textarea"
        rows="4"
        maxlength="500"
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

// API 基础路径
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

// 获取当前文章路径
const getArticlePath = () => {
  return route.path;
};

// 加载评论
const loadComments = async () => {
  try {
    const path = getArticlePath();
    const response = await fetch(`${API_BASE}/comments?path=${encodeURIComponent(path)}`);
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

// 提交评论
const submitComment = async () => {
  if (!form.value.author.trim() || !form.value.content.trim()) {
    alert('请填写昵称和评论内容');
    return;
  }

  submitting.value = true;
  try {
    const response = await fetch(`${API_BASE}/comments`, {
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
    if (data.success) {
      alert('评论发表成功！');
      form.value.content = '';
      form.value.images = [];
      await loadComments();
    } else {
      alert('评论发表失败：' + (data.error || '未知错误'));
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    alert('评论发表失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 删除评论
const deleteComment = async (commentId) => {
  const password = prompt('请输入管理员密码：');
  if (!password) return;

  try {
    const response = await fetch(`${API_BASE}/comments`, {
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
    if (data.success) {
      alert('评论已删除');
      await loadComments();
    } else {
      alert('删除失败：' + (data.error || '未知错误'));
    }
  } catch (error) {
    console.error('删除评论失败:', error);
    alert('删除失败，请稍后重试');
  }
};

// 图片上传处理
const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  
  if (form.value.images.length + files.length > 3) {
    alert('最多只能上传3张图片');
    return;
  }

  for (const file of files) {
    if (file.size > 2 * 1024 * 1024) {
      alert(`图片 ${file.name} 超过2MB，请压缩后上传`);
      continue;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
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

.comments-title {
  font-size: 24px;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
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
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
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

@media (max-width: 768px) {
  .comments-section {
    padding: 20px;
  }
  
  .comment-item {
    padding: 16px;
  }
  
  .comment-image {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
