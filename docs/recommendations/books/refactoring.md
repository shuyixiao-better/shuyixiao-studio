---
title: 重构：改善既有代码的设计
description: Martin Fowler著 - 系统学习代码重构的艺术
date: '2025-12-31'
---

# 🔧 重构：改善既有代码的设计

<div class="book-header">
  <div class="book-cover">🔧</div>
  <div class="book-meta">
    <h2>重构：改善既有代码的设计</h2>
    <p class="author">作者：Martin Fowler</p>
    <p class="rating">推荐指数：⭐⭐⭐⭐⭐</p>
    <p class="category">分类：技术成长 / 代码质量</p>
  </div>
</div>

## 📝 推荐理由

Martin Fowler的经典之作，系统地介绍了代码重构的方法和技巧。这本书教会我如何识别代码中的"坏味道"，并通过系统的重构手法改善代码质量。

### 为什么推荐这本书？

1. **系统完整**：涵盖了几乎所有常见的重构手法
2. **实用性强**：每个重构手法都有详细的步骤和示例
3. **理念先进**：强调小步快跑、持续改进的重构理念
4. **影响深远**：改变了整个行业对代码质量的认知

### 我的收获

- **识别坏味道**：学会发现代码中的问题
- **重构技巧**：掌握系统的重构方法
- **测试驱动**：理解测试在重构中的重要性
- **持续改进**：养成持续优化代码的习惯

## 🎯 适合人群

- ✅ 所有开发者
- ✅ 需要维护遗留代码的工程师
- ✅ 追求代码质量的技术人员
- ✅ 技术团队负责人

## 📚 核心内容

### 代码的坏味道

1. **重复代码**：相同的代码结构出现在多个地方
2. **过长函数**：函数做了太多事情
3. **过大的类**：类承担了太多职责
4. **过长参数列表**：函数参数过多
5. **发散式变化**：一个类因多种原因而改变
6. **霰弹式修改**：一个变化需要修改多个类
7. **依恋情结**：函数对某个类的兴趣高过对自己所处类的兴趣
8. **数据泥团**：总是一起出现的数据项
9. **基本类型偏执**：过度使用基本类型
10. **switch语句**：相同的switch出现在多处


### 常用重构手法

#### 提炼函数（Extract Method）
将一段代码提炼到独立的函数中

#### 内联函数（Inline Method）
将函数调用替换为函数本体

#### 提炼变量（Extract Variable）
将复杂表达式的结果放进临时变量

#### 重命名（Rename）
给函数、变量、类起一个更好的名字

#### 搬移函数（Move Method）
将函数移到更合适的类中

#### 以对象取代基本类型（Replace Primitive with Object）
将基本类型数据发展成对象

## 💡 重构原则

### 何时重构

- **添加新功能时**：重构使添加新功能更容易
- **修补错误时**：重构帮助理解代码
- **代码审查时**：重构改善代码设计
- **定期重构**：保持代码健康

### 重构的节奏

1. **小步前进**：每次只做一个小改动
2. **频繁测试**：每次重构后都要运行测试
3. **提交代码**：重构完成后及时提交
4. **持续改进**：重构是持续的过程

## 🔧 实战应用

### 重构前的准备

```
重构检查清单：
├── 有完善的测试覆盖
├── 理解现有代码的功能
├── 确保代码可以正常运行
└── 准备好版本控制
```

### 重构示例

**重构前：**
```java
public double getPrice() {
    double basePrice = quantity * itemPrice;
    double discount = Math.max(0, quantity - 500) * itemPrice * 0.05;
    double shipping = Math.min(basePrice * 0.1, 100);
    return basePrice - discount + shipping;
}
```

**重构后：**
```java
public double getPrice() {
    return getBasePrice() - getDiscount() + getShipping();
}

private double getBasePrice() {
    return quantity * itemPrice;
}

private double getDiscount() {
    return Math.max(0, quantity - 500) * itemPrice * 0.05;
}

private double getShipping() {
    return Math.min(getBasePrice() * 0.1, 100);
}
```

## 📖 阅读建议

### 学习方法

- **理论结合实践**：边学边在项目中应用
- **小步尝试**：从简单的重构开始
- **建立习惯**：养成持续重构的习惯
- **团队推广**：在团队中推广重构文化

## 🔗 相关资源

- [Refactoring.com](https://refactoring.com/)
- [重构目录](https://refactoring.guru/refactoring/catalog)

## 💬 读者评价

> "这本书改变了我对代码质量的认知，让我学会了如何写出更好的代码。" —— 资深开发工程师

> "重构不是重写，而是持续改进。这本书教会了我正确的重构方法。" —— 技术负责人

## 🎓 延伸阅读

- 《代码整洁之道》
- 《修改代码的艺术》
- 《重构与模式》

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1)); border-radius: 12px;">
  <p style="font-size: 1.1rem; margin-bottom: 1rem;">
    <strong>🔧 持续重构，保持代码健康</strong>
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
