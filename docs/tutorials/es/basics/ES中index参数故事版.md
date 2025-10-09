---
layout: doc
title: ES中index参数故事版
description: 想象数字村有个大型超市，每件商品都有**条形码（索引）**。超市经理发现有些商品根本不需要扫码，于是设计了灵活的**扫码开关系统（index参数）**：
date: '2025-10-09'
tags:
  - Elasticsearch
  - Java
author: 舒一笑不秃头
---
# ES中index参数故事版

> ## index
>
> index 属性指定一个字段是否被索引，该属性为 true 表示字段被索引，false 表示字段不被索引。
>
> ```java
> # index
> DELETE users
> PUT users
> {
>   "mappings": {
>     "properties": {
>       "age":{
>         "type": "integer",
>         "index": false
>       }
>     }
>   }
> }
> 
> PUT users/_doc/1
> {
>   "age":99
> }
> 
> GET users/_search
> {
>   "query": {
>     "term": {
>       "age": 99
>     }
>   }
> }
> 
> GET users/_doc/1
> ```
>



# **index参数：数字村的「商品扫码系统」🛒📱**

想象数字村有个大型超市，每件商品都有**条形码（索引）**。超市经理发现有些商品根本不需要扫码，于是设计了灵活的**扫码开关系统（index参数）**：

---

## **故事：超市的智能货架**

### **1. 默认模式（index: true → 开启扫码）**
```json
"product_name": {
  "type": "text",   // 默认开启索引
  "index": true     // 可省略
}
```
**货架管理员行为：**
- 📦 **新商品上架** → 立即生成条形码
- 🔍 **顾客扫码查询** → 秒速找到商品位置
- 📊 **销售统计** → 快速生成报表

**操作示例：**
```json
PUT supermarket/_doc/1
{
  "product_name": "有机苹果"
}

// 顾客扫码查询
GET supermarket/_search
{
  "query": {"match": {"product_name": "苹果"}}  // ✅ 立即找到
}
```

### **2. 节能模式（index: false → 关闭扫码）**
```json
"expiry_date": {
  "type": "date",
  "index": false   // 关闭索引
}
```
**货架管理员行为：**
- 📦 **商品照常入库** → 存入仓库
- 🚫 **不生成条形码** → 节省贴码时间
- 🔒 **无法扫码查询** → 只能手动查找

**操作示例：**
```json
PUT supermarket/_doc/2
{
  "expiry_date": "2023-12-31"  // 入库但没条形码
}

// 尝试扫码查询（失败）
GET supermarket/_search
{
  "query": {"term": {"expiry_date": "2023-12-31"}}  // ❌ 找不到
}

// 但仓库记录存在！
GET supermarket/_doc/2
/* 返回：
  "expiry_date": "2023-12-31"  ✅ */
```

---

## **为什么需要关闭扫码？**

### **三大实用场景**
| 场景 | 示例 | 省力效果 |
|------|------|----------|
| **敏感数据保护** | 用户身份证号 | 🛡️ 防止被搜索到 |
| **大内容优化** | 商品详情HTML | 💾 节省存储空间 |
| **临时数据** | 日志时间戳 | ⚡ 提升写入速度 |

### **你的DSL案例解析**
```json
PUT users
{
  "mappings": {
    "properties": {
      "age":{
        "type": "integer",
        "index": false   // 关闭年龄扫码
      }
    }
  }
}
```
- 🚫 顾客无法通过"年龄扫描仪"找人
- 📦 但年龄数据仍存档案库

---

## **避坑指南**

### **坑1：误关核心字段**
```json
// 错误配置
"product_id": {
  "type": "keyword",
  "index": false   // ❌ 商品ID无法搜索！
}

// 后果：顾客无法通过ID查商品
```
**解决方案：** 关键字段永远开启索引

### **坑2：与doc_values混淆**
```json
"price": {
  "type": "float",
  "index": false,   // 禁止搜索
  "doc_values": false // 禁止排序/聚合
}
```
**双重关闭效果：**
- 🔒 无法搜索价格
- 📉 无法按价格排序
- 🧮 无法计算平均价格

---

## **智能开关策略**

### **推荐配置方案**
```json
PUT smart_supermarket
{
  "mappings": {
    "properties": {
      // 必须扫码字段
      "barcode": {"type": "keyword"},  // 默认index:true
      
      // 无需扫码字段
      "product_html": {
        "type": "text",
        "index": false   // 大文本不索引
      },
      
      // 敏感字段
      "supplier_contact": {
        "type": "keyword",
        "index": false   // 保护联系方式
      },
      
      // 展示型字段
      "shelf_life_days": {
        "type": "integer",
        "index": false   // 保质期仅展示
      }
    }
  }
}
```

### **特殊场景：结合copy_to**
```json
"product_notes": {
  "type": "text",
  "index": false,   // 原始笔记不索引
  "copy_to": "search_field"  // 但复制到搜索字段
},
"search_field": {
  "type": "text"    // 集中索引
}
```
- 📝 原始笔记不建索引 → 省空间
- 🔍 但可通过search_field搜索

---

## **记忆口诀**

**商品扫码两模式：**
- **扫码开启（index:true）**  
  `快速查找` `即时统计` `默认必备`  
- **扫码关闭（index:false）**  
  `保护隐私` `节省资源` `手动可见`  

**三大禁用原则：**  
> 1️⃣ **敏感信息**必关 → 防泄露  
> 2️⃣ **大文本内容**可关 → 省空间  
> 3️⃣ **仅展示字段**推荐关 → 提性能  

**特别注意：**  
⚠️ 关闭扫码 ≠ 商品消失 → 仓库里依然存在！  
⚠️ 关键字段永远保持开启 → 否则超市会瘫痪  

记住这个超市扫码系统的比喻，轻松掌握索引开关的精髓！ 🎯🛒
