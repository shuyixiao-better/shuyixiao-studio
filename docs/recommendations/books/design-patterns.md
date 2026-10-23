---
title: 设计模式：可复用面向对象软件的基础
description: Erich Gamma等著 - 经典的"四人帮"设计模式书籍
date: '2025-12-31'
---

# 🎨 设计模式：可复用面向对象软件的基础

<div class="book-header">
  <div class="book-cover">🎨</div>
  <div class="book-meta">
    <h2>设计模式：可复用面向对象软件的基础</h2>
    <p class="author">作者：Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides</p>
    <p class="rating">推荐指数：⭐⭐⭐⭐⭐</p>
    <p class="category">分类：技术成长 / 软件设计</p>
  </div>
</div>

## 📝 推荐理由

这是软件工程领域的经典之作，由四位作者（被称为"四人帮"Gang of Four，简称GoF）共同编写。书中系统地介绍了23种设计模式，这些模式至今仍是软件设计的基石。

### 为什么推荐这本书？

1. **经典权威**：软件设计模式的开山之作，影响了整个软件行业
2. **系统完整**：涵盖创建型、结构型、行为型三大类23种模式
3. **实例丰富**：每个模式都有详细的代码示例和应用场景
4. **思想深刻**：不仅教模式，更教设计思想和原则

### 我的收获

- **提升设计能力**：学会用模式思维解决常见的设计问题
- **代码更优雅**：写出更灵活、可维护、可扩展的代码
- **沟通更高效**：用模式名称与团队成员高效沟通设计方案
- **理解框架源码**：很多框架都大量使用设计模式，理解模式后读源码更轻松

## 🎯 适合人群

- ✅ 有一定编程基础的开发者
- ✅ 想要提升代码设计能力的工程师
- ✅ 需要重构遗留代码的技术人员
- ✅ 准备架构师认证的候选人

## 📚 核心内容

### 创建型模式（5种）

#### 1. 单例模式（Singleton）
**意图**：确保一个类只有一个实例，并提供全局访问点

**应用场景**：
- 配置管理器
- 数据库连接池
- 日志记录器

```java
public class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

#### 2. 工厂方法模式（Factory Method）
**意图**：定义创建对象的接口，让子类决定实例化哪个类

**应用场景**：
- 日志记录器工厂
- 数据库连接工厂
- 文档处理器工厂

#### 3. 抽象工厂模式（Abstract Factory）
**意图**：提供一个创建一系列相关或相互依赖对象的接口

**应用场景**：
- UI组件库（不同主题）
- 跨平台应用开发
- 数据库访问层

#### 4. 建造者模式（Builder）
**意图**：将复杂对象的构建与表示分离

**应用场景**：
- 复杂对象的构建（如HTTP请求）
- 配置对象的创建
- SQL查询构建器

#### 5. 原型模式（Prototype）
**意图**：通过复制现有实例来创建新对象

**应用场景**：
- 对象克隆
- 缓存对象复用
- 避免昂贵的初始化

### 结构型模式（7种）

#### 6. 适配器模式（Adapter）
**意图**：将一个类的接口转换成客户期望的另一个接口

**应用场景**：
- 第三方库集成
- 遗留系统改造
- 接口兼容

#### 7. 桥接模式（Bridge）
**意图**：将抽象部分与实现部分分离

**应用场景**：
- 跨平台应用
- 驱动程序设计
- 多维度变化的系统

#### 8. 组合模式（Composite）
**意图**：将对象组合成树形结构以表示"部分-整体"的层次结构

**应用场景**：
- 文件系统
- 组织架构
- UI组件树

#### 9. 装饰器模式（Decorator）
**意图**：动态地给对象添加额外的职责

**应用场景**：
- Java I/O流
- Web过滤器
- 功能增强

#### 10. 外观模式（Facade）
**意图**：为子系统提供统一的高层接口

**应用场景**：
- 简化复杂系统
- 第三方库封装
- 微服务网关

#### 11. 享元模式（Flyweight）
**意图**：运用共享技术有效地支持大量细粒度对象

**应用场景**：
- 字符串常量池
- 对象池
- 缓存系统

#### 12. 代理模式（Proxy）
**意图**：为其他对象提供一种代理以控制对这个对象的访问

**应用场景**：
- 远程代理（RPC）
- 虚拟代理（延迟加载）
- 保护代理（权限控制）

### 行为型模式（11种）

#### 13. 责任链模式（Chain of Responsibility）
**意图**：使多个对象都有机会处理请求，避免请求发送者与接收者耦合

**应用场景**：
- 审批流程
- 异常处理
- 过滤器链

#### 14. 命令模式（Command）
**意图**：将请求封装成对象

**应用场景**：
- 撤销/重做功能
- 事务管理
- 任务队列

#### 15. 解释器模式（Interpreter）
**意图**：给定一个语言，定义它的文法表示，并定义一个解释器

**应用场景**：
- 表达式求值
- SQL解析
- 规则引擎

#### 16. 迭代器模式（Iterator）
**意图**：提供一种方法顺序访问聚合对象中的元素

**应用场景**：
- 集合遍历
- 数据库结果集
- 文件系统遍历

#### 17. 中介者模式（Mediator）
**意图**：用一个中介对象来封装一系列对象交互

**应用场景**：
- 聊天室
- MVC中的Controller
- 事件总线

#### 18. 备忘录模式（Memento）
**意图**：在不破坏封装性的前提下，捕获对象的内部状态

**应用场景**：
- 撤销功能
- 事务回滚
- 游戏存档

#### 19. 观察者模式（Observer）
**意图**：定义对象间的一对多依赖关系

**应用场景**：
- 事件监听
- 消息订阅
- MVC模式

#### 20. 状态模式（State）
**意图**：允许对象在内部状态改变时改变它的行为

**应用场景**：
- 订单状态流转
- TCP连接状态
- 工作流引擎

#### 21. 策略模式（Strategy）
**意图**：定义一系列算法，把它们封装起来，并使它们可以互相替换

**应用场景**：
- 支付方式选择
- 排序算法选择
- 价格计算策略

#### 22. 模板方法模式（Template Method）
**意图**：定义算法骨架，将某些步骤延迟到子类

**应用场景**：
- 框架扩展点
- 算法框架
- 生命周期回调

#### 23. 访问者模式（Visitor）
**意图**：表示一个作用于某对象结构中的各元素的操作

**应用场景**：
- 编译器
- 文档处理
- 对象结构遍历

## 💡 设计原则

### SOLID原则

1. **单一职责原则（SRP）**：一个类应该只有一个引起变化的原因
2. **开闭原则（OCP）**：对扩展开放，对修改关闭
3. **里氏替换原则（LSP）**：子类应该能够替换父类
4. **接口隔离原则（ISP）**：客户端不应该依赖它不需要的接口
5. **依赖倒置原则（DIP）**：依赖于抽象，而不是具体实现

### 其他重要原则

- **组合优于继承**：优先使用对象组合而不是类继承
- **针对接口编程**：依赖于接口而不是实现
- **封装变化**：找出应用中可能需要变化的地方，把它们独立出来

## 🔧 实战应用

### Spring框架中的设计模式

```
Spring框架使用的设计模式：
├── 单例模式：Bean默认是单例的
├── 工厂模式：BeanFactory
├── 代理模式：AOP实现
├── 模板方法：JdbcTemplate
├── 观察者模式：事件监听机制
├── 适配器模式：HandlerAdapter
└── 装饰器模式：BeanWrapper
```

### 实际项目应用建议

1. **不要过度设计**：根据实际需求选择合适的模式
2. **理解意图**：重点理解模式要解决的问题
3. **灵活运用**：可以组合使用多个模式
4. **重构应用**：在重构时引入设计模式

## 📖 阅读建议

### 学习路径

1. **第一阶段**：理解每个模式的意图和结构
2. **第二阶段**：学习模式的应用场景和实现
3. **第三阶段**：在实际项目中识别和应用模式
4. **第四阶段**：理解模式之间的关系和组合使用

### 学习方法

- **画UML图**：通过画类图加深理解
- **写代码实现**：亲手实现每个模式
- **阅读源码**：看框架如何使用设计模式
- **实际应用**：在项目中尝试使用

## 🔗 相关资源

- [设计模式在线教程](https://refactoring.guru/design-patterns)
- [Head First设计模式](https://www.oreilly.com/library/view/head-first-design/0596007124/)
- [设计模式详解](https://refactoring.guru/design-patterns/catalog)

## 💬 读者评价

> "这本书让我理解了什么是优雅的代码设计。" —— 高级Java工程师

> "虽然出版年代久远，但思想永不过时。" —— 架构师

> "读完这本书，再看框架源码就豁然开朗了。" —— 技术负责人

## 🎓 延伸阅读

- 《Head First设计模式》：更易读的设计模式入门书
- 《重构：改善既有代码的设计》：如何通过重构应用设计模式
- 《企业应用架构模式》：企业级应用的设计模式

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1)); border-radius: 12px;">
  <p style="font-size: 1.1rem; margin-bottom: 1rem;">
    <strong>🎨 掌握设计模式，写出优雅代码</strong>
  </p>
  <a href="/recommendations/" style="display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; text-decoration: none; border-radius: 50px; font-weight: 600;">
    返回书单首页
  </a>
</div>

<style scoped>
.book-header {
  display: flex;
  gap: var(--sp-32);
  padding: var(--sp-32);
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  margin-bottom: var(--sp-32);
}

.book-cover {
  font-size: var(--ui-text-hero);
  width: var(--sp-120);
  height: var(--sp-160);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  flex-shrink: 0;
}

.book-meta h2 {
  margin: 0 0 var(--sp-16);
  font-size: var(--ui-text-title);
  color: var(--vp-c-text-1);
}

.book-meta p {
  margin: var(--sp-8) 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
