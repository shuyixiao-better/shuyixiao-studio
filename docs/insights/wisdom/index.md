---
layout: doc
title: 智慧启迪
description: 伟大思想家与创新者的人生智慧
date: '2025-12-25'
---

# 智慧启迪

> 站在巨人的肩膀上，汲取前人的智慧，照亮我们前行的道路。

<div class="wisdom-intro">

这里收录了那些改变世界的思想家、创新者和领袖们的人生哲学与智慧箴言。他们的经历和思考，能为我们的人生旅程提供宝贵的启发和指引。

</div>

## 📚 智慧人物

<div class="wisdom-list">

<div class="wisdom-card">
  <div class="wisdom-avatar">🍎</div>
  <h3><a href="/insights/wisdom/steve-jobs">史蒂夫·乔布斯</a></h3>
  <p class="wisdom-title">苹果公司联合创始人</p>
  <p class="wisdom-desc">
    "成就一番伟业的唯一途径就是热爱自己的事业。" 乔布斯用他的一生诠释了什么是对完美的极致追求，以及如何将技术与人文完美结合。
  </p>
  <div class="wisdom-tags">
    <span class="tag">创新</span>
    <span class="tag">设计</span>
    <span class="tag">专注</span>
  </div>
</div>

</div>

<div class="coming-soon">
<div class="coming-icon">🚀</div>
<p>更多智慧人物持续更新中...</p>
</div>

<style scoped>
.wisdom-intro {
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05), 
    rgba(139, 92, 246, 0.08));
  border-radius: 16px;
  border-left: 4px solid #6366f1;
  margin: 2rem 0 3rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.wisdom-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.wisdom-card {
  padding: 2.5rem 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  border: 2px solid var(--vp-c-divider);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.wisdom-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.wisdom-avatar {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.wisdom-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
}

.wisdom-card h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.wisdom-card h3 a:hover {
  color: #6366f1;
}

.wisdom-title {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.wisdom-desc {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  text-align: left;
}

.wisdom-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1), 
    rgba(139, 92, 246, 0.15));
  color: #6366f1;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.tag:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  transform: translateY(-2px);
}

.coming-soon {
  margin: 4rem 0;
  text-align: center;
  padding: 3rem;
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  border: 2px dashed var(--vp-c-divider);
}

.coming-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.coming-soon p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@media (max-width: 768px) {
  .wisdom-list {
    grid-template-columns: 1fr;
  }
  
  .wisdom-card {
    padding: 2rem 1.5rem;
  }
}

.dark .wisdom-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .wisdom-card:hover {
  border-color: #8b5cf6;
}
</style>

