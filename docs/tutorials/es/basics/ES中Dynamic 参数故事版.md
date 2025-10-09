---
layout: doc
title: ES中Dynamic 参数故事版
description: 想象数字村就像一个快速发展的城市，而 `dynamic` 参数就是**城市规划局**制定的土地开发政策，决定了新来的居民（字段）能否在村里自由建房：
date: '2025-10-09'
tags:
  - Elasticsearch
author: 舒一笑不秃头
---
# ES中Dynamic 参数故事版

> ## dynamic
>
> **dynamic**：控制是否可以动态添加新字段- **true** 新检测到的字段将添加到映射中。（默认）
>
> **false** 新检测到的字段将被忽略。这些字段将不会被索引，因此将无法搜索，但仍会出现在_source返回的匹配项中。这些字段不会添加到映射中，必须显式添加新字段。



# **Dynamic 参数：数字村的「城市规划局」 🏗️📜**

想象数字村就像一个快速发展的城市，而 `dynamic` 参数就是**城市规划局**制定的土地开发政策，决定了新来的居民（字段）能否在村里自由建房：

---

## **三种城市规划政策**

### **1. 自由开发区（dynamic: true）→ 默认政策**
```json
PUT free_city
{
  "mappings": {
    "dynamic": true   // 默认值，可省略
  }
}
```
**政策特点：**
- 📍 **新居民随意建房**：新字段自动创建映射
- 📍 **自动颁发房产证**：自动生成字段类型
- 📍 **即时开通水电**：新字段可被搜索

**操作演示：**
```json
// 首次插入新字段
PUT free_city/_doc/1
{
  "new_field": "自由建造"   // 自动创建text类型字段
}

// 立即可以搜索
GET free_city/_search
{
  "query": {"match": {"new_field": "自由"}}  // ✅ 能搜到
}
```
> **适用场景**：开发测试环境、日志类灵活数据

---

### **2. 管控开发区（dynamic: false）→ 半开放政策**
```json
PUT controlled_city
{
  "mappings": {
    "dynamic": false   // 关闭自动建设
  }
}
```
**政策特点：**
- 🚧 **新居民可暂住**：新字段数据会保存
- 🚫 **但不发房产证**：不创建字段映射
- 🚫 **不通水电**：新字段不可搜索
- 📜 **需审批建设**：必须显式添加字段

**操作演示：**
```json
// 插入新字段
PUT controlled_city/_doc/1
{
  "illegal_field": "无证建筑"
}

// 尝试搜索（失败）
GET controlled_city/_search
{
  "query": {"match": {"illegal_field": "无证"}}  // ❌ 找不到
}

// 但数据实际存在！
GET controlled_city/_doc/1 
/* 返回：
  "_source": {
    "illegal_field": "无证建筑"   // ✅ 藏在仓库里
  }
*/
```
> **适用场景**：已知核心字段+允许未知附加字段（如HTTP头信息）

---

### **3. 严格规划区（dynamic: strict）→ 红线政策**
```json
PUT strict_city
{
  "mappings": {
    "dynamic": "strict"   // 严禁违规建设
  }
}
```
**政策特点：**
- 🔴 **新居民禁止进入**：未知字段直接拒绝
- 📝 **必须先审批**：必须预先定义字段
- 🛑 **违建强拆**：插入未知字段会报错

**操作演示：**
```json
// 尝试插入新字段
PUT strict_city/_doc/1
{
  "unknown_field": "测试"
}
// ❌ 立即报错！
// "strict_dynamic_mapping_exception": "mapping set to strict"
```
> **适用场景**：金融系统、核心业务数据等严格场景

---

## **城市规划对比表**

| 政策类型 | 比喻 | 新字段处理 | 搜索支持 | 数据存储 | 生产建议 |
|----------|------|------------|----------|----------|----------|
| **true（自由区）** | 自由建房 | 自动创建映射 | ✅ 可搜索 | ✅ 保存 | 开发环境 |
| **false（管控区）** | 无证暂住 | 忽略字段 | ❌ 不可搜索 | ✅ 保存 | 日志/扩展字段 |
| **strict（严格区）** | 禁止进入 | 拒绝写入 | - | ❌ 不保存 | 核心业务系统 |

---

## **实战配置指南**

### **场景1：用户档案系统（推荐 strict）**
```json
PUT user_profiles
{
  "mappings": {
    "dynamic": "strict",  // 严禁未知字段
    "properties": {
      "user_id": {"type": "keyword"},
      "name": {"type": "text"},
      "age": {"type": "integer"}
    }
  }
}
```
- 避免恶意插入非法字段
- 保证数据结构纯净

### **场景2：网站访问日志（推荐 false）**
```json
PUT web_logs
{
  "mappings": {
    "dynamic": false,  // 允许未知字段
    "properties": {
      "timestamp": {"type": "date"},
      "url": {"type": "keyword"},
      "response_code": {"type": "integer"}
    }
  }
}
```
- 可接收浏览器头、Cookie等动态字段
- 避免映射爆炸（mapping explosion）

### **场景3：快速原型开发（可用 true）**
```json
PUT prototype
{
  "mappings": {
    "dynamic": true   // 自由添加字段
  }
}
```
- 快速验证数据结构
- 生产前需重构为严格模式

---

## **动态模板搭配技巧**

```json
PUT smart_city
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings_as_keywords": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"   // 自动转keyword
          }
        }
      }
    ],
    "dynamic": true   // 仍允许自动创建
  }
}
```
- 自由开发区 + 建筑规范 = 既灵活又可控

---

## **记忆口诀**

**城市规划三政策：**
- **true → 自由开发**  
  `新字段自动注册，随意搜索`  
- **false → 管控开发**  
  `新字段偷偷暂住，不能搜索`  
- **strict → 严格审批**  
  `无证字段直接驱逐，绝不妥协`  

**黄金法则：**  
> 📍 核心系统用 **strict** → 安全第一  
> 📍 扩展数据用 **false** → 灵活存储  
> 📍 开发调试用 **true** → 快速验证  

记住这个城市规划局的比喻，你就能精准控制数据王国的疆土扩张！🗺️👑
