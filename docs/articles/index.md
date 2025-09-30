---
layout: doc
title: 技术博文
description: 分享Java、Spring、微服务、架构设计等技术文章
---

# 技术博文

<div class="wechat-card">
  <div class="wechat-info">
    <h3 class="wechat-title">关注我的微信公众号</h3>
    <h2 class="wechat-name">舒一笑的架构笔记</h2>
    <p class="wechat-desc">分享更多Java、架构设计、微服务等原创技术内容</p>
  </div>
  <div class="wechat-qrcode">
    <img src="/wxgzh.gif" alt="微信公众号:舒一笑的架构笔记" />
  </div>
</div>

<div class="article-list">
  <div class="article-card">
    <div class="article-date">2025-09-27</div>
    <h2 class="article-title"><a href="/articles/spring-boot-starter">手把手教你开发一个Spring Boot Starter</a></h2>
    <div class="article-desc">Spring Boot Starter机制详解，从零开始开发自己的Starter组件</div>
    <div class="article-meta">
      <div class="article-tags">
        <span class="article-tag">Spring Boot</span>
        <span class="article-tag">Java</span>
      </div>
      <div class="article-stats">
        <span class="article-views"><i class="icon-eye"></i> 1024</span>
        <span class="article-likes"><i class="icon-heart"></i> 88</span>
        <span class="article-comments"><i class="icon-message"></i> 36</span>
      </div>
    </div>
  </div>

  <div class="article-card">
    <div class="article-date">2025-09-25</div>
    <h2 class="article-title"><a href="/articles/design-patterns">设计模式实战：策略模式在业务中的应用</a></h2>
    <div class="article-desc">通过实际业务场景，深入理解策略模式的应用与实现</div>
    <div class="article-meta">
      <div class="article-tags">
        <span class="article-tag">设计模式</span>
        <span class="article-tag">Java</span>
      </div>
      <div class="article-stats">
        <span class="article-views"><i class="icon-eye"></i> 876</span>
        <span class="article-likes"><i class="icon-heart"></i> 65</span>
        <span class="article-comments"><i class="icon-message"></i> 29</span>
      </div>
    </div>
  </div>

  <div class="article-card">
    <div class="article-date">2025-09-20</div>
    <h2 class="article-title"><a href="/articles/microservice-communication">微服务架构下的通信方案选型</a></h2>
    <div class="article-desc">详解微服务间通信的几种主流方案及其适用场景</div>
    <div class="article-meta">
      <div class="article-tags">
        <span class="article-tag">微服务</span>
        <span class="article-tag">架构设计</span>
      </div>
      <div class="article-stats">
        <span class="article-views"><i class="icon-eye"></i> 1253</span>
        <span class="article-likes"><i class="icon-heart"></i> 102</span>
        <span class="article-comments"><i class="icon-message"></i> 45</span>
      </div>
    </div>
  </div>

  <div class="article-card">
    <div class="article-date">2025-09-15</div>
    <h2 class="article-title"><a href="/articles/java-concurrency">Java并发编程：CompletableFuture详解</a></h2>
    <div class="article-desc">深入探讨Java 8引入的CompletableFuture及其在异步编程中的应用</div>
    <div class="article-meta">
      <div class="article-tags">
        <span class="article-tag">Java</span>
        <span class="article-tag">并发编程</span>
      </div>
      <div class="article-stats">
        <span class="article-views"><i class="icon-eye"></i> 986</span>
        <span class="article-likes"><i class="icon-heart"></i> 77</span>
        <span class="article-comments"><i class="icon-message"></i> 33</span>
      </div>
    </div>
  </div>

  <div class="article-card">
    <div class="article-date">2025-09-10</div>
    <h2 class="article-title"><a href="/articles/redis-cache">Redis缓存设计与优化实践</a></h2>
    <div class="article-desc">分享Redis在高并发系统中的缓存策略与实际优化案例</div>
    <div class="article-meta">
      <div class="article-tags">
        <span class="article-tag">Redis</span>
        <span class="article-tag">缓存</span>
        <span class="article-tag">性能优化</span>
      </div>
      <div class="article-stats">
        <span class="article-views"><i class="icon-eye"></i> 1542</span>
        <span class="article-likes"><i class="icon-heart"></i> 124</span>
        <span class="article-comments"><i class="icon-message"></i> 57</span>
      </div>
    </div>
  </div>
</div>

<style>
/* 微信公众号卡片 */
.wechat-card {
  display: flex;
  flex-direction: row;
  background-color: var(--vp-c-brand-dimm);
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: space-between;
}

/* 好处网格布局 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.benefit-card {
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  border-top: 3px solid var(--vp-c-brand-1);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.benefit-card h3 {
  color: var(--vp-c-brand-1);
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.benefit-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
}

.wechat-info {
  flex: 1;
}

.wechat-title {
  font-size: 1rem;
  color: var(--vp-c-brand-1);
  margin: 0 0 0.5rem;
}

.wechat-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}

.wechat-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.wechat-qrcode {
  width: 120px;
  height: 120px;
  margin-left: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wechat-qrcode img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .wechat-card {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  .wechat-qrcode {
    margin: 1.5rem 0 0;
    width: 140px;
    height: 140px;
  }

  .wechat-name {
    font-size: 1.5rem;
  }
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
}

.article-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.article-title {
  margin: 0.5rem 0;
  font-size: 1.5rem;
}

.article-title a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.article-desc {
  margin: 0.5rem 0 1rem;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  background-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-1);
}

.article-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

/* 图标样式 */
.icon-eye::before {
  content: '👁️';
  margin-right: 0.25rem;
}

.icon-heart::before {
  content: '❤️';
  margin-right: 0.25rem;
}

.icon-message::before {
  content: '💬';
  margin-right: 0.25rem;
}
</style>
