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
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.05) 0%, rgba(62, 175, 124, 0.1) 100%);
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 6px 24px rgba(62, 175, 124, 0.15);
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.wechat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
}

.wechat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(62, 175, 124, 0.25);
}

.wechat-info {
  flex: 1;
}

.wechat-title {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  margin: 0 0 0.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.wechat-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.8rem;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wechat-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.wechat-qrcode {
  width: 110px;
  height: 110px;
  margin-left: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.wechat-qrcode img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 移动端微信卡片优化 */
@media (max-width: 640px) {
  .wechat-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
    border-radius: 12px;
  }

  .wechat-title {
    font-size: 0.85rem;
  }

  .wechat-name {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
  }

  .wechat-desc {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .wechat-qrcode {
    margin: 1.2rem auto 0;
    width: 100px;
    height: 100px;
  }
}

/* 平板端微信卡片 */
@media (min-width: 641px) and (max-width: 768px) {
  .wechat-card {
    padding: 1.5rem 1.25rem;
  }

  .wechat-name {
    font-size: 1.5rem;
  }

  .wechat-qrcode {
    width: 100px;
    height: 100px;
    margin-left: 1rem;
  }
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.article-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-card:hover::before {
  transform: scaleX(1);
}

.article-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(62, 175, 124, 0.2);
  border-color: var(--vp-c-brand-1);
}

.article-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.article-date::before {
  content: '📅';
  font-size: 0.75rem;
}

.article-title {
  margin: 0.5rem 0 0.8rem;
  font-size: 1.4rem;
  line-height: 1.4;
  font-weight: 600;
}

.article-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.article-title a:hover {
  color: var(--vp-c-brand-1);
}

.article-desc {
  margin: 0.5rem 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-dimm), rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  font-weight: 500;
  transition: all 0.3s ease;
}

.article-tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  transform: translateY(-2px);
}

.article-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
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

/* 移动端文章卡片优化 */
@media (max-width: 640px) {
  .article-list {
    gap: 1.2rem;
    margin-top: 1.5rem;
  }

  .article-card {
    padding: 1.2rem;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  }

  .article-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(62, 175, 124, 0.18);
  }

  .article-date {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .article-title {
    font-size: 1.15rem;
    margin: 0.4rem 0 0.6rem;
    line-height: 1.35;
  }

  .article-desc {
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0.4rem 0 0.8rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    margin-top: 0.8rem;
    padding-top: 0.8rem;
  }

  .article-tags {
    width: 100%;
  }

  .article-tag {
    font-size: 0.7rem;
    padding: 0.25rem 0.7rem;
  }

  .article-stats {
    width: 100%;
    justify-content: space-between;
    font-size: 0.75rem;
    gap: 0.5rem;
  }

  .article-stats span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

/* 平板端文章卡片 */
@media (min-width: 641px) and (max-width: 768px) {
  .article-list {
    gap: 1.3rem;
  }

  .article-card {
    padding: 1.35rem;
  }

  .article-title {
    font-size: 1.3rem;
  }

  .article-desc {
    font-size: 0.9rem;
  }

  .article-tag {
    font-size: 0.73rem;
  }

  .article-stats {
    font-size: 0.78rem;
  }
}

/* 暗色模式优化 */
.dark .article-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .article-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 28px rgba(66, 211, 146, 0.15);
}

.dark .wechat-card {
  background: linear-gradient(135deg, rgba(66, 211, 146, 0.08) 0%, rgba(66, 211, 146, 0.12) 100%);
  border-color: var(--vp-c-brand-1);
}
</style>
