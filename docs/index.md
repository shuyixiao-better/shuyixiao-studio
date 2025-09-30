---
layout: home

hero:
  name: "舒一笑不秃头"
  text: "技术博客"
  tagline: 代码是我的文字，程序是我的诗篇，我不是程序员，我是诗人 ✨
  image:
    src: /logo.png
    alt: shuyixiaobutuotou-studio
  actions:
    - theme: brand
      text: 🚀 开始阅读
      link: /articles/
    - theme: alt
      text: 📖 关于我
      link: /about/

features:
  - icon:
      src: /wxgzh.gif
      alt: 舒一笑的架构笔记
      width: 72
      height: 72
    title: 关注公众号
    details: 关注「舒一笑的架构笔记」获取更多Java与架构设计知识
    link: /about/wechat
    class: highlighted
  - icon:
      src: /icons/article.svg
      alt: 技术博文
      width: 72
      height: 72
    title: 技术博文
    details: 分享Java、Spring、微服务、架构设计等技术文章
    link: /articles/
    class: active
  - icon:
      src: /icons/project.svg
      alt: 实战项目
      width: 72
      height: 72
    title: 实战项目
    details: 从零开始，手把手教你构建完整应用
    link: /projects/
  - icon:
      src: /icons/roadmap.svg
      alt: 学习路线
      width: 72
      height: 72
    title: 学习路线
    details: 体系化的技术学习指南，助你成长为技术专家
    link: /roadmap/
  - icon:
      src: /icons/interview.svg
      alt: 面试精选
      width: 72
      height: 72
    title: 面试精选
    details: 高质量的技术面试题解析，助你拿到理想offer
    link: /interview/
  - icon:
      src: /icons/tools.svg
      alt: 开发工具
      width: 72
      height: 72
    title: 开发工具
    details: 提升效率的开发工具与插件推荐
    link: /tools/
  - icon:
      src: /icons/resources.svg
      alt: 资源导航
      width: 72
      height: 72
    title: 资源导航
    details: 精选优质学习资源，一站式技术导航
    link: /resources/

---

<style>
/* 现代化特性卡片布局 - 网格风格 */
.VPFeatures {
  background: var(--vp-c-bg);
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
}

.VPFeatures .container {
  max-width: 1200px;
  position: relative;
  z-index: 1;
  margin: 0 auto;
}

.VPFeatures .items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2.5rem;
  max-width: 1100px;
  margin: 3rem auto 0;
  padding: 0 1rem;
  justify-content: center;
}

.VPFeatures .item {
  position: relative;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-height: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  cursor: pointer;
}

.VPFeatures .item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.05), rgba(62, 175, 124, 0.02));
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.VPFeatures .item:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 60px rgba(62, 175, 124, 0.25);
  border-color: rgba(62, 175, 124, 0.4);
}

.VPFeatures .item:hover::before {
  opacity: 1;
}

.VPFeatures .item.active {
  background: rgba(62, 175, 124, 0.08);
  border-color: rgba(62, 175, 124, 0.5);
  box-shadow: 0 12px 40px rgba(62, 175, 124, 0.3);
}

.VPFeatures .item.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3eaf7c, #2c9d6e);
  border-radius: 20px 20px 0 0;
}

.VPFeatures .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.2), rgba(62, 175, 124, 0.1));
  border-radius: 20px;
  transition: all 0.4s ease;
  margin-bottom: 1.25rem;
  color: #3eaf7c;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(62, 175, 124, 0.2);
}

.VPFeatures .icon img,
.VPFeatures .icon svg {
  width: 36px;
  height: 36px;
  color: inherit;
  transition: all 0.3s ease;
}

.VPFeatures .icon svg {
  stroke: currentColor;
  stroke-width: 1.5;
}

.VPFeatures .icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(62, 175, 124, 0.3), transparent);
  transition: all 0.4s ease;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.VPFeatures .item:hover .icon {
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.3), rgba(62, 175, 124, 0.2));
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px rgba(62, 175, 124, 0.4);
  border-color: rgba(62, 175, 124, 0.4);
}

.VPFeatures .item:hover .icon::before {
  width: 100%;
  height: 100%;
}

.VPFeatures .item:hover .icon img,
.VPFeatures .item:hover .icon svg {
  transform: scale(1.1);
}

.VPFeatures .item.active .icon {
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.35), rgba(62, 175, 124, 0.25));
  box-shadow: 0 8px 25px rgba(62, 175, 124, 0.35);
  border-color: rgba(62, 175, 124, 0.5);
}

.VPFeatures .title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  text-align: center;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  position: relative;
  z-index: 2;
}

.VPFeatures .subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  margin: 0 0 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  opacity: 0.8;
  position: relative;
  z-index: 2;
}

.VPFeatures .details {
  text-align: center;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  hyphens: auto;
  opacity: 0.7;
  position: relative;
  z-index: 2;
}

/* 移除按钮样式，改为整体卡片可点击 */
.VPFeatures .item a {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 响应式设计 - 网格布局 */
@media (max-width: 640px) {
  .VPFeatures {
    padding: 3rem 1rem;
  }
  
  .VPFeatures .items {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
    gap: 2rem;
    max-width: 400px;
  }
  
  .VPFeatures .item {
    padding: 2rem 1.5rem;
    min-height: 160px;
  }
  
  .VPFeatures .icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .VPFeatures .icon img,
  .VPFeatures .icon svg {
    width: 30px;
    height: 30px;
  }
  
  .VPFeatures .title {
    font-size: 1.2rem;
  }
  
  .VPFeatures .subtitle {
    font-size: 0.8rem;
  }
  
  .VPFeatures .details {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .VPFeatures .items {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2rem;
    max-width: 700px;
  }
  
  .VPFeatures .item {
    padding: 2.25rem 1.75rem;
    min-height: 180px;
  }
  
  .VPFeatures .icon {
    width: 68px;
    height: 68px;
    margin-bottom: 1.125rem;
  }
  
  .VPFeatures .icon img,
  .VPFeatures .icon svg {
    width: 34px;
    height: 34px;
  }
  
  .VPFeatures .title {
    font-size: 1.25rem;
  }
  
  .VPFeatures .subtitle {
    font-size: 0.82rem;
  }
  
  .VPFeatures .details {
    font-size: 0.875rem;
    -webkit-line-clamp: 2;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .VPFeatures .items {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 2.25rem;
    max-width: 950px;
  }
  
  .VPFeatures .item {
    padding: 2.5rem 2rem;
    min-height: 200px;
  }
  
  .VPFeatures .icon {
    width: 72px;
    height: 72px;
    margin-bottom: 1.25rem;
  }
  
  .VPFeatures .icon img,
  .VPFeatures .icon svg {
    width: 36px;
    height: 36px;
  }
  
  .VPFeatures .title {
    font-size: 1.3rem;
  }
  
  .VPFeatures .subtitle {
    font-size: 0.85rem;
  }
  
  .VPFeatures .details {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
}

@media (min-width: 1025px) {
  .VPFeatures .items {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 2.5rem;
    max-width: 1100px;
  }
  
  .VPFeatures .item {
    padding: 2.5rem 2rem;
    min-height: 200px;
  }
  
  .VPFeatures .icon {
    width: 72px;
    height: 72px;
    margin-bottom: 1.25rem;
  }
  
  .VPFeatures .icon img,
  .VPFeatures .icon svg {
    width: 36px;
    height: 36px;
  }
  
  .VPFeatures .title {
    font-size: 1.3rem;
  }
  
  .VPFeatures .subtitle {
    font-size: 0.85rem;
  }
  
  .VPFeatures .details {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
}
</style>

<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-icon">🔍</div>
  <div class="divider-line"></div>
</div>

<div class="recent-posts">
  <h2>最新文章</h2>
  <div class="post-list">
    <div class="post-grid">
      <div class="post-item">
        <div class="post-date">2025-09-27</div>
        <h3 class="post-title"><a href="/articles/spring-boot-starter">手把手教你开发一个Spring Boot Starter</a></h3>
        <div class="post-desc">Spring Boot Starter机制详解，从零开始开发自己的Starter组件</div>
        <div class="post-meta">
          <span class="post-tag">Spring Boot</span>
          <span class="post-tag">Java</span>
        </div>
      </div>
      <div class="post-item">
        <div class="post-date">2025-09-25</div>
        <h3 class="post-title"><a href="/articles/design-patterns">设计模式实战：策略模式在业务中的应用</a></h3>
        <div class="post-desc">通过实际业务场景，深入理解策略模式的应用与实现</div>
        <div class="post-meta">
          <span class="post-tag">设计模式</span>
          <span class="post-tag">Java</span>
        </div>
      </div>
      <div class="post-item">
        <div class="post-date">2025-09-20</div>
        <h3 class="post-title"><a href="/articles/microservice-communication">微服务架构下的通信方案选型</a></h3>
        <div class="post-desc">详解微服务间通信的几种主流方案及其适用场景</div>
        <div class="post-meta">
          <span class="post-tag">微服务</span>
          <span class="post-tag">架构设计</span>
        </div>
      </div>
    </div>
  </div>
  <div class="view-more">
    <a href="/articles/">查看更多文章 →</a>
  </div>
</div>

<style>
/* 现代化文章展示区域 */
.recent-posts {
  margin: 4rem auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 24px;
  max-width: 1400px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.recent-posts::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3), var(--vp-c-brand-1));
  border-radius: 24px 24px 0 0;
}

.recent-posts h2 {
  margin: 0 0 2rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.recent-posts h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: translateX(-50%);
  border-radius: 2px;
}

.post-list {
  margin-top: 2rem;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
  padding: 0 1rem;
}

.post-item {
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, var(--vp-c-bg), var(--vp-c-bg-soft));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.post-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.post-item:hover::before {
  transform: scaleX(1);
}

.post-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(62, 175, 124, 0.15);
  border-color: var(--vp-c-brand-1);
}

.post-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-date::before {
  content: '📅';
  font-size: 0.8rem;
}

.post-title {
  margin: 0 0 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.4;
}

.post-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
}

.post-title a:hover {
  color: var(--vp-c-brand-1);
}

.post-desc {
  margin: 0 0 1.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
}

.post-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.post-tag {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--vp-c-brand-dimm), rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  font-weight: 500;
  border: 1px solid var(--vp-c-brand-1);
  transition: all 0.3s ease;
}

.post-tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  transform: translateY(-2px);
}

.view-more {
  margin-top: 3rem;
  text-align: center;
}

.view-more a {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  color: white;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  text-decoration: none;
  transition: all 0.4s ease;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 25px rgba(62, 175, 124, 0.3);
  position: relative;
  overflow: hidden;
}

.view-more a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.view-more a:hover::before {
  left: 100%;
}

.view-more a:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(62, 175, 124, 0.4);
}

/* 分隔线样式 */
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rem auto;
  max-width: 600px;
}

.divider-line {
  flex-grow: 1;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--vp-c-brand-1), transparent);
  border-radius: 1px;
}

.divider-icon {
  font-size: 2rem;
  margin: 0 2rem;
  color: var(--vp-c-brand-1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .recent-posts {
    margin: 3rem 1rem;
    padding: 2rem 1.5rem;
  }
  
  .post-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0;
  }
  
  .post-item {
    padding: 1.5rem;
  }
  
  .recent-posts h2 {
    font-size: 1.8rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
}

@media (min-width: 1201px) {
  .post-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
}
</style>

