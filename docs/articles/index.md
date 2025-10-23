---
layout: doc
title: 技术文章
---

# 📝 技术文章

欢迎来到我的技术文章专区！这里记录了我在技术探索路上的点滴思考和实践经验。

## 最新文章

### 网站功能

- [博客统计系统使用指南](./site-stats-guide.md) - 了解如何使用阅读数、点赞和访问量统计功能

### 技术分享

- [设计模式实战](./design-patterns.md) - 深入浅出讲解常用设计模式
- [微服务通信方案](./microservice-communication.md) - 微服务架构下的通信策略
- [PandaCoder - SQL监控神器](./panda-coder-intro.md) - 致敬MyBatis Log Plugin，但我们做得更极致！自动关联API、可视化统计、超大JSON支持
- [Spring Boot Starter 开发](./spring-boot-starter.md) - 自定义 Starter 从零到一

## 文章分类

<div class="article-categories">
  <div class="category-card">
    <h3>🏗️ 架构设计</h3>
    <p>系统架构、微服务、分布式系统设计经验分享</p>
  </div>
  
  <div class="category-card">
    <h3>💻 编程实践</h3>
    <p>代码设计、设计模式、最佳实践探讨</p>
  </div>
  
  <div class="category-card">
    <h3>🔧 工具开发</h3>
    <p>插件开发、工具制作、效率提升方案</p>
  </div>
  
  <div class="category-card">
    <h3>📚 学习笔记</h3>
    <p>技术学习心得、踩坑记录、问题解决</p>
  </div>
</div>

## 订阅更新

关注我的公众号，第一时间获取最新文章推送：

[关注公众号](/about/wechat)

<style scoped>
.article-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 32px 0;
}

.category-card {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.category-card h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  border: none;
  color: white;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  opacity: 0.95;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .article-categories {
    grid-template-columns: 1fr;
  }
}
</style>
