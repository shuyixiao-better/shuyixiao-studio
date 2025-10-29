<template>
  <div class="requirement-boundary-container">
    <!-- 头部提示 -->
    <div class="header-section">
      <div class="header-icon">🛡️</div>
      <h2 class="header-title">需求边界守卫者</h2>
      <p class="header-desc">在动手之前，先明确需求的边界范围，避免做无用功</p>
      <div class="warning-badge">
        <span>⚠️</span>
        <span>今日反思：在没有明确需求边界前就动手，导致做了多余的工作</span>
      </div>
    </div>

    <!-- 需求输入区域 -->
    <div class="input-section">
      <div class="input-group">
        <label for="requirement-title">📋 需求标题</label>
        <input
          id="requirement-title"
          v-model="requirementTitle"
          type="text"
          placeholder="例如：为预览服务增加鸿蒙字体支持"
          @input="updateBoundary"
        />
      </div>
      
      <div class="input-group full-width">
        <label for="requirement-desc">📝 需求描述</label>
        <textarea
          id="requirement-desc"
          v-model="requirementDesc"
          rows="3"
          placeholder="简要描述这个需求的目标..."
          @input="updateBoundary"
        ></textarea>
      </div>
    </div>

    <!-- 边界定义区域 -->
    <div class="boundary-section">
      <div class="section-title">
        <span>🎯</span>
        <span>定义需求边界</span>
        <span class="subtitle">在开始之前，明确哪些是在范围内，哪些是范围外</span>
      </div>

      <div class="boundary-cards">
        <!-- 边界内 -->
        <div class="boundary-card in-scope">
          <div class="card-header">
            <span class="card-icon">✅</span>
            <h3 class="card-title">在范围内</h3>
            <span class="item-count">({{ inScopeItems.length }})</span>
          </div>
          <div class="card-body">
            <div 
              v-for="(item, index) in inScopeItems" 
              :key="index"
              class="scope-item"
            >
              <input
                v-model="item.text"
                type="text"
                placeholder="例如：渲染时支持鸿蒙字体"
                class="item-input"
                @input="updateBoundary"
              />
              <button 
                class="remove-btn"
                @click="removeItem('in', index)"
                v-if="inScopeItems.length > 1"
              >
                ✕
              </button>
            </div>
            <button class="add-btn" @click="addItem('in')">
              ➕ 添加项
            </button>
          </div>
        </div>

        <!-- 边界外 -->
        <div class="boundary-card out-scope">
          <div class="card-header">
            <span class="card-icon">❌</span>
            <h3 class="card-title">范围外（无需做）</h3>
            <span class="item-count">({{ outScopeItems.length }})</span>
          </div>
          <div class="card-body">
            <div 
              v-for="(item, index) in outScopeItems" 
              :key="index"
              class="scope-item"
            >
              <input
                v-model="item.text"
                type="text"
                placeholder="例如：预览页面的字体也需要适配（这是多余的）"
                class="item-input"
                @input="updateBoundary"
              />
              <button 
                class="remove-btn"
                @click="removeItem('out', index)"
                v-if="outScopeItems.length > 1"
              >
                ✕
              </button>
            </div>
            <button class="add-btn" @click="addItem('out')">
              ➕ 添加项
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 澄清清单 -->
    <div class="checklist-section">
      <div class="section-title">
        <span>📋</span>
        <span>需求澄清清单</span>
        <span class="subtitle">在动手前，回答这些问题</span>
      </div>
      <div class="checklist-items">
        <label 
          v-for="(check, index) in checklist" 
          :key="index"
          class="checklist-item"
          :class="{ checked: check.checked }"
        >
          <input
            v-model="check.checked"
            type="checkbox"
            class="checkbox-input"
            @change="updateBoundary"
          />
          <span class="checkmark"></span>
          <span class="check-text">{{ check.text }}</span>
        </label>
      </div>
    </div>

    <!-- 历史案例 -->
    <div class="case-section">
      <div class="section-title">
        <span>💡</span>
        <span>今日反思案例</span>
      </div>
      <div class="case-card">
        <div class="case-header">
          <span class="case-date">{{ todayDate }}</span>
          <span class="case-tag warning">反思</span>
        </div>
        <div class="case-content">
          <h4 class="case-title">预览服务鸿蒙字体适配</h4>
          <div class="case-scope">
            <div class="case-scope-item">
              <span class="scope-label">✅ 实际需求：</span>
              <span>预览服务渲染时需要支持鸿蒙字体</span>
            </div>
            <div class="case-scope-item">
              <span class="scope-label">❌ 多余工作：</span>
              <span>认为预览页面也需要适配鸿蒙字体，但这不是必需的</span>
            </div>
          </div>
          <div class="case-lesson">
            <strong>教训：</strong>在明确需求边界之前就开始实现，导致做了超出需求范围的工作。应该先与需求方确认边界，再动手。
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <button class="action-btn primary" @click="saveBoundary">
        💾 保存当前边界定义
      </button>
      <button class="action-btn secondary" @click="clearAll">
        🗑️ 清空重来
      </button>
      <button class="action-btn secondary" @click="loadExample">
        📖 加载示例
      </button>
    </div>

    <!-- 保存提示 -->
    <div v-if="showSaveTip" class="save-tip">
      ✅ 边界定义已保存到本地存储
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 需求信息
const requirementTitle = ref('')
const requirementDesc = ref('')

// 边界项
const inScopeItems = ref([{ text: '' }])
const outScopeItems = ref([{ text: '' }])

// 澄清清单
const checklist = ref([
  { text: '我是否已经与需求方确认了需求的完整范围？', checked: false },
  { text: '我是否明确了哪些功能是在需求范围内的？', checked: false },
  { text: '我是否明确了哪些功能是在需求范围外的？', checked: false },
  { text: '是否存在边界模糊的地方，需要进一步澄清？', checked: false },
  { text: '我是否理解了需求的最终目标？', checked: false },
  { text: '我是否考虑了实现成本与需求价值的匹配？', checked: false }
])

// 保存提示
const showSaveTip = ref(false)

// 当前日期
const todayDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// 添加项
const addItem = (scope) => {
  if (scope === 'in') {
    inScopeItems.value.push({ text: '' })
  } else {
    outScopeItems.value.push({ text: '' })
  }
}

// 移除项
const removeItem = (scope, index) => {
  if (scope === 'in') {
    if (inScopeItems.value.length > 1) {
      inScopeItems.value.splice(index, 1)
    }
  } else {
    if (outScopeItems.value.length > 1) {
      outScopeItems.value.splice(index, 1)
    }
  }
  updateBoundary()
}

// 更新边界
const updateBoundary = () => {
  // 这里可以添加实时保存逻辑
}

// 保存边界定义
const saveBoundary = () => {
  const boundaryData = {
    title: requirementTitle.value,
    desc: requirementDesc.value,
    inScope: inScopeItems.value.filter(item => item.text.trim()),
    outScope: outScopeItems.value.filter(item => item.text.trim()),
    checklist: checklist.value,
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('requirement-boundary', JSON.stringify(boundaryData))
  
  showSaveTip.value = true
  setTimeout(() => {
    showSaveTip.value = false
  }, 2000)
}

// 清空所有
const clearAll = () => {
  if (confirm('确定要清空所有内容吗？')) {
    requirementTitle.value = ''
    requirementDesc.value = ''
    inScopeItems.value = [{ text: '' }]
    outScopeItems.value = [{ text: '' }]
    checklist.value.forEach(check => check.checked = false)
    localStorage.removeItem('requirement-boundary')
  }
}

// 加载示例
const loadExample = () => {
  requirementTitle.value = '为预览服务增加鸿蒙字体支持'
  requirementDesc.value = '需要在预览服务中支持鸿蒙字体的渲染功能'
  inScopeItems.value = [
    { text: '预览服务渲染时需要支持鸿蒙字体' }
  ]
  outScopeItems.value = [
    { text: '预览页面的字体也需要适配（这是多余的）' }
  ]
  checklist.value.forEach(check => check.checked = false)
}

// 加载保存的数据
const loadSaved = () => {
  const saved = localStorage.getItem('requirement-boundary')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      requirementTitle.value = data.title || ''
      requirementDesc.value = data.desc || ''
      if (data.inScope && data.inScope.length > 0) {
        inScopeItems.value = data.inScope.map(text => ({ text }))
      }
      if (data.outScope && data.outScope.length > 0) {
        outScopeItems.value = data.outScope.map(text => ({ text }))
      }
      if (data.checklist) {
        checklist.value = data.checklist
      }
    } catch (e) {
      console.error('加载保存数据失败', e)
    }
  }
}

onMounted(() => {
  loadSaved()
})
</script>

<style scoped>
.requirement-boundary-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border-radius: 24px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* 头部区域 */
.header-section {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(62, 175, 124, 0.2));
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, 
    var(--vp-c-brand-1) 0%, 
    var(--vp-c-brand-3) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 1rem;
}

.warning-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #f59e0b;
  border-radius: 50px;
  color: #78350f;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

/* 输入区域 */
.input-section {
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.input-group input,
.input-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.1);
}

.input-group textarea {
  resize: vertical;
  font-family: inherit;
}

/* 边界定义区域 */
.boundary-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.section-title .subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.boundary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.boundary-card {
  background: var(--vp-c-bg);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.boundary-card.in-scope {
  border-color: #10b981;
}

.boundary-card.out-scope {
  border-color: #ef4444;
}

.boundary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.card-icon {
  font-size: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.item-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scope-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.item-input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.item-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.1);
}

.remove-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.add-btn {
  padding: 0.6rem 1rem;
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.add-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: rgba(62, 175, 124, 0.05);
}

/* 澄清清单 */
.checklist-section {
  margin-bottom: 2rem;
}

.checklist-items {
  display: grid;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checklist-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.checklist-item.checked {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.check-text {
  flex: 1;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  line-height: 1.5;
}

.checklist-item.checked .check-text {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

/* 案例区域 */
.case-section {
  margin-bottom: 2rem;
}

.case-card {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.case-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.case-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.case-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.case-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.case-tag.warning {
  background: #fef3c7;
  color: #78350f;
  margin-left: auto;
}

.case-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}

.case-scope {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.case-scope-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.scope-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex-shrink: 0;
}

.case-lesson {
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #78350f;
}

.case-lesson strong {
  color: #92400e;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 2rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(62, 175, 124, 0.3);
}

.action-btn.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
}

.action-btn.secondary:hover {
  background: rgba(62, 175, 124, 0.1);
  transform: translateY(-2px);
}

/* 保存提示 */
.save-tip {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .requirement-boundary-container {
    padding: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .boundary-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .section-title .subtitle {
    margin-left: 0;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .save-tip {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    padding: 0.75rem 1rem;
  }
}
</style>

