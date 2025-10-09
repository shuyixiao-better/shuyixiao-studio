---
layout: doc
title: ES中norms参数故事版
description: 想象一下，你是一家大型超市的经理，超市里有成千上万种商品，每个商品都有**商品描述标签**。顾客通过搜索框来查找他们需要的商品。
date: '2025-10-09'
tags:
  - Elasticsearch
author: 舒一笑不秃头
---
# ES中norms参数故事版

> ## norms
>
> norms 对字段评分有用，text 默认开启 norms，如果不是特别需要，不要开启 norms。



# Elasticsearch的norms参数：超市商品的“标签长度智能评分”系统

## 一个超市搜索的故事

想象一下，你是一家大型超市的经理，超市里有成千上万种商品，每个商品都有**商品描述标签**。顾客通过搜索框来查找他们需要的商品。

### 默认情况：智能评分系统（norms: true）

当norms开启时（text类型字段的默认设置），你的超市使用了一套**智能评分系统**：

```json
"product_description": {
  "type": "text",    
  "norms": true      // 开启智能评分（可省略）
}
```

**工作方式：**
- 📏 **测量标签长度**：系统会自动测量每个商品描述标签的长度
- ⚖️ **智能评分**：短标签商品 vs 长标签商品
  - "有机苹果"（短标签）→ **高分**
  - "产自日本青森县精选红富士苹果..."（长标签）→ **低分**
- 🏆 **排序结果**：搜索"苹果"时，短标签商品排在前面

**为什么这样设计？**
搜索"苹果"时，顾客更可能想要找的是标签简洁的“有机苹果”，而不是描述冗长的苹果品种介绍。短文本通常更精准匹配用户意图。

### 关闭评分：公平竞技模式（norms: false）

当你明确关闭norms时，系统变得“一视同仁”：

```json
"product_description": {
  "type": "text",
  "norms": false  // 关闭长度评分
}
```

**效果：**
- 📊 **平等对待**：所有商品描述无论长短，评分起点相同
- 💾 **节省空间**：不再存储长度评分数据
- ⚡ **提升性能**：减少评分计算复杂度

## 为什么不同类型的字段默认值不同？

### Text字段（默认norms: true）
```json
"product_name": {
  "type": "text"  // 默认开启norms
}
```
**原因**：text字段会被分词成多个词项，不同文档的字段长度差异很大，需要长度归一化来公平评分。

### Keyword字段（默认norms: false）
```json
"product_id": {
  "type": "keyword"  // 默认关闭norms
}
```
**原因**：keyword字段是整体匹配，不存在长度差异问题，不需要长度归一化。

## norms的实际代价与收益

### 存储开销
| 设置 | 存储成本 | 比喻 |
|------|----------|------|
| **norms: true** | 每文档每字段约1字节 | 每个商品多一张评分卡 |
| **norms: false** | 无额外存储 | 没有评分卡，省空间 |

虽然每个字段只增加约1字节，但在数十亿文档的索引中，这会累积成GB级别的存储开销。

### 性能影响
```json
// 需要排序的场景适合开启norms
"product_title": {
  "type": "text",
  "norms": true  // 支持相关性排序
}

// 仅过滤的场景适合关闭norms  
"product_code": {
  "type": "text",
  "norms": false  // 只需匹配存在性
}
```

## 什么时候关闭norms？

### ✅ 推荐关闭的场景
1. **仅用于过滤的字段**
   ```json
   "product_tags": {
     "type": "text",
     "norms": false  // 只需知道是否存在
   }
   ```

2. **存储空间敏感的场景**
   ```json
   "log_content": {
     "type": "text", 
     "norms": false  // 日志数据量大，省空间
   }
   ```

3. **明确不需要相关性排序的字段**
   ```json
   "internal_notes": {
     "type": "text",
     "norms": false  // 内部备注不参与搜索排序
   }
   ```

### ❌ 不建议关闭的场景
1. **主要搜索字段**
   ```json
   "product_title": {
     "type": "text",
     "norms": true  // 需要智能排序
   }
   ```

2. **内容搜索字段**
   ```json
   "article_content": {
     "type": "text",
     "norms": true  // 内容搜索需要相关性评分
   }
   ```

## 实战配置示例

```json
PUT smart_store
{
  "mappings": {
    "properties": {
      // 主要搜索字段 - 开启norms
      "product_name": {
        "type": "text",
        "norms": true
      },
      
      // 过滤字段 - 关闭norms
      "product_category": {
        "type": "text",
        "norms": false
      },
      
      // 大文本字段 - 关闭norms节省空间
      "product_specification": {
        "type": "text",
        "norms": false
      },
      
      // keyword字段 - 保持默认（false）
      "product_sku": {
        "type": "keyword"
      }
    }
  }
}
```

## 记忆口诀

**norms三句话：**
1. **text默认开** → 短文本得分高，长文本得分低
2. **keyword默认关** → 整体匹配无长度差异
3. **不需要排序就关** → 省空间提性能

**简单决策法则：**
- 🟢 **保持开启**：用户会直接搜索的字段
- 🔴 **考虑关闭**：仅用于过滤或空间紧张的字段

记住这个超市商品标签的比喻，你就能轻松掌握norms参数的精髓！🛒✨
