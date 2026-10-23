<template>
  <div class="requirement-boundary-container">
    <!-- 头部提示 -->
    <div class="header-section">
      <div class="header-icon"><LineIcon name="tools" /></div>
      <h2 class="header-title">需求边界守卫者</h2>
      <p class="header-desc">在动手之前，先明确需求的边界范围，避免做无用功</p>
      <div class="warning-badge">
        <span></span>
        <span>今日反思：在没有明确需求边界前就动手，导致做了多余的工作</span>
      </div>
    </div>

    <!-- 需求输入区域 -->
    <div class="input-section">
      <div class="input-group">
        <label for="requirement-title"> 需求标题</label>
        <input
          id="requirement-title"
          v-model="requirementTitle"
          type="text"
          placeholder="例如：为预览服务增加鸿蒙字体支持"
          @input="updateBoundary"
        />
      </div>

      <div class="input-group full-width">
        <label for="requirement-desc"> 需求描述</label>
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
        <span></span>
        <span>定义需求边界</span>
        <span class="subtitle">在开始之前，明确哪些是在范围内，哪些是范围外</span>
      </div>

      <div class="boundary-cards">
        <!-- 边界内 -->
        <div class="boundary-card in-scope">
          <div class="card-header">
            <span class="card-icon"><LineIcon name="tools" /></span>
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

              </button>
            </div>
            <button class="add-btn" @click="addItem('in')">
               添加项
            </button>
          </div>
        </div>

        <!-- 边界外 -->
        <div class="boundary-card out-scope">
          <div class="card-header">
            <span class="card-icon"><LineIcon name="tools" /></span>
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

              </button>
            </div>
            <button class="add-btn" @click="addItem('out')">
               添加项
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 澄清清单 -->
    <div class="checklist-section">
      <div class="section-title">
        <span></span>
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
        <span></span>
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
              <span class="scope-label"> 实际需求：</span>
              <span>预览服务渲染时需要支持鸿蒙字体</span>
            </div>
            <div class="case-scope-item">
              <span class="scope-label"> 多余工作：</span>
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
         保存当前边界定义
      </button>
      <button class="action-btn secondary" @click="clearAll">
         清空重来
      </button>
      <button class="action-btn secondary" @click="loadExample">
         加载示例
      </button>
    </div>

    <!-- 保存提示 -->
    <div v-if="showSaveTip" class="save-tip">
       边界定义已保存到本地存储
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
  max-width: var(--ui-size-1200);
  margin: var(--sp-32) auto;
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  border: var(--ui-border) solid var(--vp-c-divider);
  box-shadow: none;
}
.header-section {
  text-align: center;
  padding: var(--sp-32);
  margin-bottom: var(--sp-32);
}

.header-icon {
  font-size: var(--ui-text-hero);
  margin-bottom: var(--sp-16);
}

.header-title {
  font-size: var(--ui-text-title);
  font-weight: var(--ui-weight-heading);
  margin: var(--sp-8) 0;
  background: var(--vp-c-bg-soft);
}

.header-desc {
  font-size: var(--ui-text-base);
  color: var(--vp-c-text-2);
  margin: var(--sp-8) 0 var(--sp-16);
}

.warning-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-12) var(--sp-24);
  background: var(--vp-c-bg-soft);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-tag);
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
  box-shadow: none;
}
.input-section {
  margin-bottom: var(--sp-32);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-16);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
}

.input-group input,
.input-group textarea {
  padding: var(--sp-12) var(--sp-16);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
  transition: var(--ui-transition);
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: none;
}

.input-group textarea {
  resize: vertical;
  font-family: inherit;
}
.boundary-section {
  margin-bottom: var(--sp-32);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  font-size: var(--ui-text-quote);
  font-weight: var(--ui-weight-heading);
  margin-bottom: var(--sp-24);
  color: var(--vp-c-text-1);
}

.section-title .subtitle {
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-body);
  color: var(--vp-c-text-1);
  margin-left: auto;
}

.boundary-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-32);
}

.boundary-card {
  background: var(--vp-c-bg);
  border-radius: var(--ui-radius-card);
  padding: var(--sp-24);
  border: var(--ui-focus) solid var(--vp-c-divider);
  transition: var(--ui-transition);
}

.boundary-card.in-scope {
  border-color: var(--vp-c-divider);
}

.boundary-card.out-scope {
  border-color: var(--vp-c-divider);
}

.boundary-card:hover {
  box-shadow: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--sp-12);
  margin-bottom: var(--sp-16);
  padding-bottom: var(--sp-16);
  border-bottom: var(--ui-focus) solid var(--vp-c-divider);
}

.card-icon {
  font-size: var(--ui-text-section);
}

.card-title {
  font-size: var(--ui-text-quote);
  font-weight: var(--ui-weight-heading);
  margin: 0;
  color: var(--vp-c-text-1);
}

.item-count {
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-2);
  margin-left: auto;
  padding: var(--sp-4) var(--sp-12);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-12);
}

.scope-item {
  display: flex;
  gap: var(--sp-8);
  align-items: center;
}

.item-input {
  flex: 1;
  padding: var(--sp-8) var(--sp-16);
  border: var(--ui-border) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-sm);
  transition: var(--ui-transition);
}

.item-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: none;
}

.remove-btn {
  width: var(--sp-28);
  height: var(--sp-28);
  padding: 0;
  border: none;
  border-radius: var(--ui-radius-input);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-base);
  cursor: pointer;
  transition: var(--ui-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: var(--vp-c-bg-soft);
}

.add-btn {
  padding: var(--sp-8) var(--sp-16);
  border: var(--ui-focus) dashed var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: var(--ui-text-sm);
  cursor: pointer;
  transition: var(--ui-transition);
  text-align: center;
}

.add-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}
.checklist-section {
  margin-bottom: var(--sp-32);
}

.checklist-items {
  display: grid;
  gap: var(--sp-12);
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-12);
  padding: var(--sp-16);
  background: var(--vp-c-bg);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  cursor: pointer;
  transition: var(--ui-transition);
}

.checklist-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(var(--sp-4));
}

.checklist-item.checked {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.checkbox-input {
  width: var(--sp-20);
  height: var(--sp-20);
  cursor: pointer;
  margin-top: var(--sp-4);
  flex-shrink: 0;
}

.check-text {
  flex: 1;
  color: var(--vp-c-text-1);
  font-size: var(--ui-text-base);
  line-height: var(--ui-leading-body);
}

.checklist-item.checked .check-text {
  color: var(--vp-c-text-1);
  font-weight: var(--ui-weight-medium);
}
.case-section {
  margin-bottom: var(--sp-32);
}

.case-card {
  background: var(--vp-c-bg);
  border: var(--ui-focus) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-card);
  padding: var(--sp-24);
  transition: var(--ui-transition);
}

.case-card:hover {
  box-shadow: none;
}

.case-header {
  display: flex;
  align-items: center;
  gap: var(--sp-12);
  margin-bottom: var(--sp-16);
  padding-bottom: var(--sp-16);
  border-bottom: var(--ui-focus) solid var(--vp-c-divider);
}

.case-date {
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-2);
}

.case-tag {
  padding: var(--sp-4) var(--sp-12);
  border-radius: var(--ui-radius-tag);
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-weight-medium);
}

.case-tag.warning {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.case-title {
  font-size: var(--ui-text-quote);
  font-weight: var(--ui-weight-heading);
  margin: 0 0 var(--sp-16);
  color: var(--vp-c-text-1);
}

.case-scope {
  display: flex;
  flex-direction: column;
  gap: var(--sp-12);
  margin-bottom: var(--sp-16);
  padding: var(--sp-16);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
}

.case-scope-item {
  display: flex;
  gap: var(--sp-8);
  font-size: var(--ui-text-base);
  line-height: var(--ui-leading-body);
}

.scope-label {
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  flex-shrink: 0;
}

.case-lesson {
  padding: var(--sp-16);
  background: var(--vp-c-bg-soft);
  border-left: var(--sp-4) solid var(--vp-c-divider);
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  line-height: var(--ui-leading-body);
  color: var(--vp-c-text-2);
}

.case-lesson strong {
  color: var(--vp-c-text-2);
}
.action-section {
  display: flex;
  gap: var(--sp-16);
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: var(--sp-12) var(--sp-32);
  border: var(--ui-focus) solid var(--vp-c-brand-1);
  border-radius: var(--ui-radius-input);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  cursor: pointer;
  transition: var(--ui-transition);
}

.action-btn.primary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.action-btn.primary:hover {
  box-shadow: none;
}

.action-btn.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
}

.action-btn.secondary:hover {
  background: var(--vp-c-bg-soft);
}
.save-tip {
  position: fixed;
  bottom: var(--sp-32);
  right: var(--sp-32);
  padding: var(--sp-16) var(--sp-32);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: var(--ui-radius-input);
  box-shadow: none;
  z-index: 1000;
}
@media (max-width: 768px) {
  .requirement-boundary-container {
    padding: var(--sp-24);
  }

  .header-title {
    font-size: var(--ui-text-section);
  }

  .boundary-cards {
    grid-template-columns: 1fr;
    gap: var(--sp-24);
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-4);
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
    bottom: var(--sp-16);
    right: var(--sp-16);
    left: var(--sp-16);
    padding: var(--sp-12) var(--sp-16);
  }
}
</style>

