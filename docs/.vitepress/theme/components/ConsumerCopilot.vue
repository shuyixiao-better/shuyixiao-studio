<template>
  <div v-if="isApiAvailable" class="consumer-copilot">
    <!-- 标题区域 -->
    <div class="copilot-header">
      <h2>🤖 消费决策助手</h2>
      <p class="subtitle">理性消费，看穿套路</p>
      <button v-if="conversation.length > 0" class="clear-btn" @click="clearConversation">
        清空对话
      </button>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="(msg, index) in conversation" 
        :key="index"
        :class="['message', msg.role]"
      >
        <div class="message-avatar">
          <img v-if="msg.role === 'user'" src="/images/我的头像.jpg" alt="用户头像" class="avatar-img" />
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div v-if="msg.role === 'assistant'" class="markdown-content" v-html="renderMarkdownSync(msg.content)"></div>
          <div v-else class="text-content">{{ msg.content }}</div>
          <div v-if="msg.usage" class="message-usage">
            <small>Token: {{ msg.usage.total_tokens || 'N/A' }}</small>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="message assistant loading">
        <div class="message-avatar">
          🤖
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- 欢迎消息 -->
      <div v-if="conversation.length === 0 && !isLoading" class="welcome-message">
        <div class="welcome-icon">💡</div>
        <h3>开始你的理性消费之旅</h3>
        <p>输入商品信息或消费问题，AI将帮你分析：</p>
        <ul class="features-list">
          <li>✅ 是否值得购买</li>
          <li>✅ 可能的促销套路</li>
          <li>✅ 替代方案建议</li>
          <li>✅ 价格合理性分析</li>
        </ul>
        <div class="example-questions">
          <p class="example-title">💬 示例问题：</p>
          <div class="example-btn" @click="sendExample('Nike 工装裤 699 军绿色值得买吗？')">
            Nike 工装裤 699 军绿色值得买吗？
          </div>
          <div class="example-btn" @click="sendExample('滔博的Nike黑色为什么不参与65折？')">
            滔博的Nike黑色为什么不参与65折？
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown.enter.exact.prevent="handleEnter"
          @keydown.shift.enter="insertNewline"
          placeholder="输入商品信息或消费问题..."
          rows="3"
          maxlength="2000"
          :disabled="isLoading || !isApiAvailable"
          class="message-input"
          ref="messageInput"
        ></textarea>
        <div class="input-footer">
          <span class="char-count">{{ inputMessage.length }} / 2000</span>
          <span class="input-hint">Enter发送，Shift+Enter换行</span>
        </div>
      </div>
      <button 
        @click="sendMessage" 
        :disabled="isLoading || !inputMessage.trim() || !isApiAvailable"
        class="send-button"
      >
        <span v-if="!isLoading">发送</span>
        <span v-else class="sending">发送中...</span>
      </button>
    </div>

    <!-- 提示信息 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast-${toast.type}`">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
  <RequiresBackendNotice v-else-if="isGitHubPages" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { getDeployTarget, hasBackend } from '../utils/deploy-env.js';

// 状态管理
const conversation = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const isApiAvailable = ref(false);
const isGitHubPages = ref(false);
const messagesContainer = ref(null);
const messageInput = ref(null);
let markedInstance = null;

// 提示信息
const toast = ref({
  show: false,
  message: '',
  type: 'info'
});

// 加载知识库
let knowledgeBase = null;

// 初始化
onMounted(async () => {
  // 先检测是否为 GitHub Pages，如果是则不显示组件
  if (checkGitHubPages()) {
    return; // 不继续初始化，组件会被 v-if 隐藏
  }
  
  await checkApiAvailability();
  if (!isApiAvailable.value) { isGitHubPages.value = true; return; }
  await loadKnowledgeBase();
  // 动态加载marked
  try {
    const { marked } = await import('marked');
    markedInstance = marked;
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  } catch (error) {
    console.warn('Failed to load marked:', error);
  }
});

// 检测当前环境（Netlify 或 GitHub Pages）
const detectEnvironment = getDeployTarget;
const checkGitHubPages = () => {
  isGitHubPages.value = ['cloudflare', 'github'].includes(detectEnvironment());
  return isGitHubPages.value;
};
const checkApiAvailability = async () => {
  isApiAvailable.value = await hasBackend();
};

// 加载知识库
const loadKnowledgeBase = async () => {
  try {
    const response = await fetch('/data/consumer-knowledge.json');
    knowledgeBase = await response.json();
  } catch (error) {
    console.warn('Failed to load knowledge base:', error);
  }
};

// 构建系统提示词（包含知识库内容）
const buildSystemPrompt = () => {
  let prompt = `你是一个理性消费教练，擅长帮用户看穿商家定价套路，做出明智的消费决策。

你的核心能力：
1. **套路识别**：快速识别常见的促销陷阱（如先涨后降、颜色限制、多件折扣限制等）
2. **替代思维**：提供性价比更高的替代方案
3. **价格分析**：评估价格合理性，建议购买时机
4. **决策支持**：用数据和逻辑帮助用户做决定，而不是简单说"值得"或"不值得"

回答风格：
- 简洁有力，直接点出关键点
- 用数据和事实说话，避免空话
- 给出可操作的建议，不只是分析问题`;

  // 如果有知识库，添加到提示词中
  if (knowledgeBase && knowledgeBase.knowledge_base) {
    prompt += '\n\n已知的消费规则和套路：\n';
    const rules = Object.values(knowledgeBase.knowledge_base)
      .map(item => `- ${item.rule}`)
      .join('\n');
    prompt += rules;
  }

  prompt += '\n\n现在请回答用户的问题，运用上述知识和规则给出专业建议。';

  return prompt;
};

// 构建对话历史（用于API调用）
const buildConversationHistory = () => {
  // 添加系统提示词作为第一条消息
  const history = [
    {
      role: 'system',
      content: buildSystemPrompt()
    }
  ];

  // 添加用户和助手的对话历史（排除system消息）
  const userHistory = conversation.value
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));

  return history.concat(userHistory);
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value || !isApiAvailable.value) {
    return;
  }

  const userMessage = inputMessage.value.trim();
  
  // 添加到对话历史
  conversation.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  });

  inputMessage.value = '';
  isLoading.value = true;

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  try {
    const conversationHistory = buildConversationHistory();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        conversation: conversationHistory.slice(1), // 排除system消息
        stream: true  // 启用流式输出
      })
    });

    // 处理405错误（GitHub Pages环境）
    if (response.status === 405 || response.status === 404) {
      showToast('AI功能仅在Netlify部署环境可用', 'error');
      conversation.value.pop(); // 移除刚添加的用户消息
      isLoading.value = false;
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '请求失败');
    }

    // 检查是否为流式响应
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/event-stream')) {
      // 处理流式响应
      let fullResponse = '';
      let model = '';
      let usage = null;
      
      // 创建助理消息占位符
      const assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };
      conversation.value.push(assistantMessage);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // 解码数据
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            // 检查是否是结束标记
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              // 提取增量内容
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                const delta = parsed.choices[0].delta;
                if (delta.content) {
                  fullResponse += delta.content;
                  assistantMessage.content = fullResponse;
                  
                  // 自动滚动到底部
                  await nextTick();
                  scrollToBottom();
                }
              }
              
              // 提取模型和usage信息
              if (parsed.model) {
                model = parsed.model;
                assistantMessage.model = model;
              }
              if (parsed.usage) {
                usage = parsed.usage;
                assistantMessage.usage = usage;
              }
            } catch (e) {
              // 忽略JSON解析错误
            }
          }
        }
      }
      
      // 流式响应完成
      isLoading.value = false;
      await nextTick();
      scrollToBottom();
    } else {
      // 非流式响应（降级处理）
      const data = await response.json();
      
      if (data.success) {
        conversation.value.push({
          role: 'assistant',
          content: data.response,
          usage: data.usage,
          model: data.model,
          timestamp: new Date().toISOString()
        });
        
        // 滚动到底部
        await nextTick();
        scrollToBottom();
      } else {
        throw new Error(data.error || 'AI响应异常');
      }
    }
  } catch (error) {
    console.error('Send message error:', error);
    showToast(error.message || '发送失败，请稍后重试', 'error');
    // 移除失败的消息（可能是user消息和空的assistant占位符）
    const lastMessage = conversation.value[conversation.value.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      conversation.value.pop();
    }
    const secondLastMessage = conversation.value[conversation.value.length - 1];
    if (secondLastMessage && secondLastMessage.role === 'assistant' && !secondLastMessage.content) {
      conversation.value.pop();
    }
  } finally {
    isLoading.value = false;
    // 聚焦输入框
    if (messageInput.value) {
      messageInput.value.focus();
    }
  }
};

// 发送示例问题
const sendExample = (question) => {
  inputMessage.value = question;
  sendMessage();
};

// 清空对话
const clearConversation = () => {
  if (confirm('确定要清空对话历史吗？')) {
    conversation.value = [];
    showToast('对话已清空', 'info');
  }
};

// 处理Enter键
const handleEnter = () => {
  if (!isLoading.value && inputMessage.value.trim()) {
    sendMessage();
  }
};

// 插入换行（Shift+Enter）
const insertNewline = () => {
  // 默认行为就是换行，不需要额外处理
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 监听对话变化，自动滚动
watch(conversation, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

// Markdown渲染（同步版本，用于模板）
const renderMarkdownSync = (content) => {
  if (!content) return '';
  
  // 如果marked已加载，使用marked
  if (markedInstance) {
    try {
      return markedInstance(content);
    } catch (error) {
      console.error('Markdown render error:', error);
    }
  }
  
  // 降级方案：简单Markdown处理
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br>');
};

// 显示提示
const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>

<style scoped>
.consumer-copilot {
  width: 100%;
  max-width: 100%;
  margin: 2rem 0;
  padding: 2rem;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 标题区域 */
.copilot-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.copilot-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.clear-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin-bottom: 1rem;
  min-height: 400px;
  max-height: 500px;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--vp-c-bg-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  padding: 2px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 50px);
}

.message.user .message-content {
  text-align: right;
}

.text-content {
  background: var(--vp-c-bg);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: inline-block;
  max-width: 100%;
  word-wrap: break-word;
}

.message.user .text-content {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
}

.message.assistant .text-content {
  border: 1px solid var(--vp-c-divider);
}

/* Markdown内容样式 */
.markdown-content {
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  line-height: 1.6;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.markdown-content :deep(p) {
  margin: 0.5rem 0;
}

.markdown-content :deep(code) {
  background: var(--vp-c-bg-soft);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: var(--vp-c-bg-alt);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(strong) {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.message-usage {
  margin-top: 0.5rem;
  opacity: 0.6;
}

/* 加载状态 */
.message.loading .message-content {
  display: flex;
  align-items: center;
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
  padding: 0.75rem 1rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.welcome-message h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem auto;
  max-width: 300px;
  text-align: left;
}

.features-list li {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
}

.example-questions {
  margin-top: 2rem;
}

.example-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-2);
}

.example-btn {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  color: var(--vp-c-text-1);
}

.example-btn:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* 输入区域 */
.input-container {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.input-wrapper {
  flex: 1;
}

.message-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.1);
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.send-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  height: fit-content;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.sending {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* 提示消息 */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  white-space: pre-line;
  text-align: center;
  max-width: 90%;
}

.toast-info {
  background: var(--vp-c-brand-1);
  color: white;
}

.toast-error {
  background: #ef4444;
  color: white;
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
@media (max-width: 960px) {
  .consumer-copilot {
    padding: 1.5rem;
    margin: 1rem 0;
  }

  .messages-container {
    min-height: 350px;
    max-height: 450px;
  }
}

@media (max-width: 640px) {
  .consumer-copilot {
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 12px;
  }

  .copilot-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .copilot-header h2 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .clear-btn {
    position: static;
    margin-top: 0.5rem;
    display: inline-block;
    width: 100%;
    max-width: 200px;
  }

  .messages-container {
    min-height: 300px;
    max-height: 400px;
    padding: 0.75rem;
  }

  .input-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .message-input {
    font-size: 16px; /* 防止iOS自动缩放 */
  }

  .send-button {
    width: 100%;
    padding: 0.875rem 2rem;
  }

  .message-content {
    max-width: calc(100% - 45px);
  }

  .message-avatar {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .example-btn {
    display: block;
    margin: 0.5rem 0;
    text-align: left;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .welcome-message {
    padding: 2rem 0.5rem;
  }

  .welcome-icon {
    font-size: 3rem;
  }

  .features-list {
    max-width: 100%;
    font-size: 0.9rem;
  }
}

/* 暗色模式优化 */
.dark .markdown-content {
  background: var(--vp-c-bg-alt);
}

.dark .message.user .message-avatar {
  box-shadow: 0 2px 8px rgba(66, 211, 146, 0.3);
}
</style>

