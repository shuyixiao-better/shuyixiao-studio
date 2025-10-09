---
layout: doc
title: ES中enable参数故事版
description: >-
  想象数字村的超市里有个**万能扫描枪**，能瞬间找到任何商品的位置。而`enable`参数就是这把扫描枪的**总电源开关**，决定了是否要激活商品的定位功能！
date: '2025-10-09'
tags:
  - Elasticsearch
  - Java
author: 舒一笑不秃头
---
# ES中enable参数故事版

> ## enable
>
> **enable**：是否创建倒排索引，可以对字段操作，也可以对索引操作，如果不创建索引，让然可以检索并在_source元数据中展示，谨慎使用，该状态无法修改。
>
> ```java
> PUT my_index
> {
>   "mappings": {
>       "enabled": false
>   }
> }
> 
> ```
>



# **enable参数：超市的「智能扫描枪开关」🛒🔌**

想象数字村的超市里有个**万能扫描枪**，能瞬间找到任何商品的位置。而`enable`参数就是这把扫描枪的**总电源开关**，决定了是否要激活商品的定位功能！

---

## **故事：超市的扫描枪系统**

### **1. 开启扫描枪（默认状态）**
```json
PUT supermarket
{
  "mappings": {}  // 默认enable=true
}
```
**工作状态：**
- 📦 **新商品入库** → 自动生成定位码
- 🔍 **顾客扫码** → 秒速找到商品位置
- 📊 **库存统计** → 实时更新

**操作示例：**
```json
PUT supermarket/_doc/1
{
  "product": "有机苹果",
  "price": 15.8
}

// 立即可以搜索
GET supermarket/_search
{
  "query": {"match": {"product": "苹果"}}  // ✅ 秒出结果
}
```

---

### **2. 关闭扫描枪（enable: false）**
```json
PUT warehouse
{
  "mappings": {
    "enabled": false   // 关闭总电源
  }
}
```
**特殊状态：**
- 📦 **商品照常入库** → 存进仓库
- 🔌 **不生成定位码** → 没有索引
- 🚫 **无法扫码查找** → 只能手动翻找

**操作验证：**
```json
PUT warehouse/_doc/1
{
  "item": "冷冻海鲜",
  "storage_date": "2023-10-01"
}

// 尝试搜索（失败）
GET warehouse/_search
{
  "query": {"term": {"item": "海鲜"}}  // ❌ 扫描枪没反应
}

// 但仓库记录还在！
GET warehouse/_doc/1
/* 返回：
  "item": "冷冻海鲜",
  "storage_date": "2023-10-01" */
```

---

## **为什么需要关闭扫描枪？**

### **三大适用场景**
| 场景 | 比喻 | 收益 |
|------|------|------|
| **纯存储仓库** | 只存不查的冷库 | 省电省资源 |
| **临时中转站** | 快递分拣中心 | 加速货物流动 |
| **敏感物品库** | 银行金库 | 防止外部探查 |

### **实际应用案例**
```json
// 日志备份系统（只需存储）
PUT log_backup
{
  "mappings": {
    "enabled": false   // 关闭索引
  }
}

// 插入日志（速度提升30%）
PUT log_backup/_doc/1
{
  "content": "用户登录失败，IP:192.168.1.1...（5000字）",
  "timestamp": "2023-10-01T12:00:00"
}
```

---

## **危险警告：不可逆操作！**

### **永久性限制**
```mermaid
graph LR
    A[创建索引] --> B{enable=false?}
    B -->|是| C[永远不可创建索引]
    B -->|否| D[随时可关闭]
```
- ⚠️ **一旦关闭永远关闭**：无法后期开启索引
- ⚠️ **无法部分启用**：全索引统一开关
- ⚠️ **字段级禁用更灵活**：优先考虑`"index":false`

### **错误案例**
```json
// 错误：试图后期开启
PUT warehouse/_settings
{
  "mappings": {
    "enabled": true   // ❌ 报错！不可修改
  }
}
// 错误信息：Cannot enable [_all] after index creation
```

---

## **更灵活的替代方案**

### **方案1：字段级禁用（推荐）**
```json
PUT flexible_warehouse
{
  "mappings": {
    "properties": {
      "secret_code": {
        "type": "keyword",
        "index": false   // 仅禁用该字段
      },
      "product_name": {
        "type": "text"   // 其他字段正常索引
      }
    }
  }
}
```
- 优点：部分字段可搜索
- 缺点：仍有索引开销

### **方案2：冷热数据分离**
```json
// 热数据索引（开启）
PUT hot_products
{ "mappings": { /*...*/ } }

// 冷数据存储（关闭索引）
PUT cold_archive
{
  "mappings": {
    "enabled": false   // 纯存档
  }
}
```

---

## **黄金使用法则**

```json
// ✅ 正确使用场景
PUT system_backup
{
  "mappings": {
    "enabled": false   // 符合以下所有条件：
  }
}
```
1. **绝不搜索**：数据只需存储，无需检索
2. **无需排序**：不会按字段排序
3. **无需统计**：不需要聚合分析
4. **数据量大**：至少GB级别以上
5. **性能敏感**：写入速度要求极高

---

## **记忆口诀**

**扫描枪开关三铁律：**
1. **关枪省电** → 提升写入速度，节省资源  
2. **永久关闭** → 开业前必须想清楚！  
3. **手动找货** → 只能通过_id或全扫描  

**适用场景歌诀：**  
> 📦 纯仓库 🚫 禁扫描  
> 🧊 冷数据 ❌ 不检索  
> 🔒 高敏感 🛑 保安全  

记住：**enable=false是Elasticsearch的"只写模式"**，用对场景能让你的数据仓库效率翻倍！ 🚀💡
