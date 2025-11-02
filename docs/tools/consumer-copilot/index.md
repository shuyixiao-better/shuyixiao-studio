---
layout: doc
title: 消费决策助手
description: AI驱动的理性消费助手，帮你看穿商家套路，做出明智决策
---

<script setup>
import { onMounted } from 'vue';

// Netlify 域名（完整功能版本）- 如果用户在其他 Netlify 域名，跳转到这里
// 注意：如果是 poeticcoder.cn，需要跳转到其他 Netlify 域名
const NETLIFY_URL = 'https://www.poeticcoder.com'; // 默认 Netlify 域名
const CURRENT_PATH = '/tools/consumer-copilot/';

// 检测环境并处理跳转
onMounted(() => {
  if (typeof window === 'undefined') return;
  
  // 检测当前环境
  const hostname = window.location.hostname;
  
  // GitHub Pages 域名（www.poeticcoder.cn）
  if (hostname.includes('poeticcoder.cn')) {
    showRedirectNotice();
    return;
  }
  
  // 如果已经在 Netlify 域名，不需要跳转
  // 其他所有域名都视为 Netlify 环境
  if (hostname.includes('poeticcoder.com') || 
      hostname.includes('shuyixiao.cn') ||
      hostname.includes('netlify.app')) {
    return; // Netlify 环境，正常使用
  }
  
  // 未知环境，尝试检测 API 是否可用
  fetch('/api/chat', { method: 'OPTIONS' })
    .then(response => {
      // 如果不是 Netlify 环境（404或405），显示跳转提示
      if (response.status === 404 || response.status === 405) {
        showRedirectNotice();
      }
    })
    .catch(() => {
      // 网络错误，显示跳转提示
      showRedirectNotice();
    });
});

// 显示跳转提示
function showRedirectNotice() {
  let countdown = 3;
  
  // 创建提示弹窗
  const notice = document.createElement('div');
  notice.className = 'redirect-notice';
  notice.innerHTML = `
    <div class="redirect-content">
      <div class="redirect-icon">🚀</div>
      <h3>AI功能需要跳转到完整版本</h3>
      <p>当前环境不支持AI对话功能</p>
      <p class="redirect-tips">完整功能版本：<strong>www.poeticcoder.com</strong></p>
      <div class="countdown">
        <span class="countdown-number">${countdown}</span>
        <span>秒后自动跳转</span>
      </div>
      <div class="redirect-buttons">
        <button class="redirect-btn-primary" onclick="window.location.href='${NETLIFY_URL}${CURRENT_PATH}'">
          立即跳转
        </button>
        <button class="redirect-btn-secondary" onclick="this.closest('.redirect-notice').remove()">
          暂不跳转
        </button>
      </div>
    </div>
  `;
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .redirect-notice {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
      padding: 1rem;
    }
    
    .redirect-content {
      background: var(--vp-c-bg);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 450px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid var(--vp-c-divider);
    }
    
    .redirect-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .redirect-content h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.35rem;
      font-weight: 600;
      color: var(--vp-c-text-1);
      background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .redirect-content p {
      margin: 0.5rem 0;
      color: var(--vp-c-text-2);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    .redirect-tips {
      margin: 1rem 0 !important;
      padding: 0.75rem;
      background: var(--vp-c-bg-soft);
      border-radius: 8px;
      border-left: 3px solid var(--vp-c-brand-1);
    }
    
    .redirect-tips strong {
      color: var(--vp-c-brand-1);
      font-weight: 600;
    }
    
    .countdown {
      margin: 1.5rem 0;
      padding: 1rem;
      background: linear-gradient(135deg, var(--vp-c-brand-soft), rgba(62, 175, 124, 0.1));
      border-radius: 12px;
      border: 1px solid var(--vp-c-brand-1);
    }
    
    .countdown-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--vp-c-brand-1);
      display: inline-block;
      min-width: 2rem;
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .redirect-buttons {
      margin-top: 1.5rem;
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .redirect-btn-primary,
    .redirect-btn-secondary {
      padding: 0.875rem 2rem;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-size: 0.95rem;
      flex: 1;
      min-width: 120px;
    }
    
    .redirect-btn-primary {
      background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
      color: white;
      box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
    }
    
    .redirect-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(62, 175, 124, 0.4);
    }
    
    .redirect-btn-secondary {
      background: var(--vp-c-bg-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-divider);
    }
    
    .redirect-btn-secondary:hover {
      background: var(--vp-c-bg-mute);
      border-color: var(--vp-c-text-3);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @media (max-width: 640px) {
      .redirect-content {
        padding: 1.5rem;
        margin: 1rem;
      }
      
      .redirect-icon {
        font-size: 3rem;
      }
      
      .redirect-content h3 {
        font-size: 1.15rem;
      }
      
      .redirect-buttons {
        flex-direction: column;
      }
      
      .redirect-btn-primary,
      .redirect-btn-secondary {
        width: 100%;
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notice);
  
  // 更新倒计时
  const countdownEl = notice.querySelector('.countdown-number');
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdownEl) {
      countdownEl.textContent = countdown;
    }
    if (countdown <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  // 3秒后自动跳转（如果用户没有点击）
  const autoRedirect = setTimeout(() => {
    clearInterval(countdownInterval);
    window.location.href = `${NETLIFY_URL}${CURRENT_PATH}`;
  }, 3000);
  
  // 如果用户点击按钮，清除自动跳转
  notice.addEventListener('click', (e) => {
    if (e.target.classList.contains('redirect-btn-primary')) {
      clearTimeout(autoRedirect);
      clearInterval(countdownInterval);
    }
    if (e.target.classList.contains('redirect-btn-secondary')) {
      clearTimeout(autoRedirect);
      clearInterval(countdownInterval);
      // 移除弹窗后，隐藏组件
      const copilotComponent = document.querySelector('.consumer-copilot');
      if (copilotComponent) {
        copilotComponent.style.display = 'none';
      }
    }
  });
}
</script>

# 🤖 消费决策助手

## 💡 简介

消费决策助手是一个基于AI的理性消费工具，帮助你：

- ✅ **识别促销套路**：快速看穿商家的定价陷阱
- ✅ **提供替代方案**：找到性价比更高的选择
- ✅ **分析价格合理性**：判断是否值得购买
- ✅ **决策支持**：用数据和逻辑帮你做决定

## 🎯 功能特点

### 核心能力

1. **套路识别**
   - 先涨后降陷阱
   - 颜色/尺码限制折扣
   - 多件折扣规则陷阱
   - 稀缺感营销识别

2. **替代思维**
   - 性价比分析
   - 功能替代方案
   - 购买时机建议

3. **价格分析**
   - 历史价格参考
   - 季节性定价规律
   - 品牌折扣规律

## 🚀 快速开始

直接在下方的对话框中输入你的消费问题，例如：

- "Nike 工装裤 699 军绿色值得买吗？"
- "滔博的Nike黑色为什么不参与65折？"
- "这款耳机999元，有更好的替代方案吗？"

## 📚 知识库

助手内置了丰富的消费知识库，包括：

- 电商折扣规则
- 消费心理学原理
- 促销陷阱识别
- 品牌折扣规律
- 价格策略分析

知识库持续更新，不断优化AI的建议质量。

## 🔒 隐私说明

- 所有对话仅在当前会话中保留
- 不会保存任何个人信息
- 不会记录你的消费行为
- 支持随时清空对话历史

## 💬 使用示例

### 示例1：商品询价

**问：** Nike 工装裤 699 军绿色值得买吗？

**答：** 根据消费知识库，滔博代理的Nike商品中，尾货颜色（如军绿）常有小程序专属折扣（约69折），而常规色（黑/白）通常85折且不参与多件65折。建议：
1. 先在小程序查看是否有专属折扣
2. 对比黑色/白色版本的实际到手价
3. 如果是尾货，可以考虑等待更大折扣

### 示例2：折扣规则咨询

**问：** 为什么黑色不参与65折活动？

**答：** 这是商家常用的SKU限制策略。多件N折活动通常对特定SKU无效（如限定色、限定尺码），目的是：
1. 控制促销成本
2. 引导购买其他商品
3. 制造"专属优惠"的稀缺感

建议查看活动详情页，确认哪些SKU参与，哪些不参与。

---

<ConsumerCopilot />

---

## 📝 反馈建议

如果你有使用建议或发现bug，欢迎通过网站右下角的反馈按钮联系我！

<style scoped>
/* 消费决策助手组件样式优化 */
:deep(.consumer-copilot) {
  margin: 2rem 0;
  width: 100%;
  box-sizing: border-box;
}

/* 在移动端优化显示 */
@media (max-width: 640px) {
  :deep(.consumer-copilot) {
    margin: 1rem 0;
    padding: 1rem !important;
  }

  :deep(.copilot-header) {
    padding-bottom: 1rem !important;
  }

  :deep(.messages-container) {
    min-height: 300px !important;
    max-height: 400px !important;
  }
}
</style>

