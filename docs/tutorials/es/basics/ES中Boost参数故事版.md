# ES中Boost参数故事版

> ## boost
>
> **boost**：对当前字段相关度的评分权重，默认1
>
> ```java
> delete blog
> PUT blog
> {
>   "mappings": {
>     "properties": {
>       "content":{
>         "type": "text",
>         "boost": 2
>       }
>     }
>   }
> }
> 
> GET blog/_search
> {
>   "query": {
>     "match": {
>       "content": {
>         "query": "你好",
>         "boost": 2
>       }
>     }
>   }
> }
> ```
>

# **Boost 参数：数字村的"重要性放大器" 🔊**

想象数字村有一个公告栏，村民们会发布各种消息。但有些消息特别重要，需要更显眼的位置！Elasticsearch 的 `boost` 参数就像给这些重要消息装上了"放大镜"，让它们在搜索结果中更加突出。

## **故事：公告栏的优先级系统**

### **1. 默认情况：所有消息平等（boost: 1）**
```json
PUT notices
{
  "mappings": {
    "properties": {
      "title": {"type": "text"},    // 默认boost=1
      "content": {"type": "text"}   // 默认boost=1
    }
  }
}
```
- 村民搜索"停水通知"时，所有包含这个词的消息都平等展示
- 标题和内容的重要性一样

### **2. 设置永久优先级（mapping中的boost）**
管理员决定：**标题比内容更重要**，给标题设置boost=2：
```json
PUT notices
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "boost": 2   // 标题的重要性是内容的2倍！
      },
      "content": {"type": "text"}  // 默认boost=1
    }
  }
}
```
**效果：**
- 当标题和内容都出现"停水通知"时：
  - 标题匹配的消息得分 × 2
  - 内容匹配的消息得分 × 1
- 标题匹配的消息会排在前面

### **3. 临时提升优先级（查询时的boost）**
某天水管爆裂，管理员临时决定：**所有提到"紧急维修"的内容都要特别关注**：
```json
GET notices/_search
{
  "query": {
    "match": {
      "content": {
        "query": "紧急维修",
        "boost": 3   // 临时提升3倍重要性！
      }
    }
  }
}
```
**效果：**
- 匹配"紧急维修"的消息得分 × 3
- 这些消息会排在搜索结果最前面

---

## **你的DSL示例解析**

### **永久提升字段权重**
```json
PUT blog
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "boost": 2   // 永久提升content字段权重
      }
    }
  }
}
```
- 所有搜索中，匹配`content`字段的结果都会获得2倍得分

### **临时提升搜索词权重**
```json
GET blog/_search
{
  "query": {
    "match": {
      "content": {
        "query": "你好",
        "boost": 2   // 本次搜索中提升"你好"的权重
      }
    }
  }
}
```
- 本次搜索中，匹配"你好"的文档得分翻倍

---

## **Boost 参数的核心原理**

### **相关性评分公式**
```
最终得分 = 原始相关性得分 × boost值
```

### **不同场景的boost效果**
| boost值 | 效果 | 比喻 |
|---------|------|------|
| **1** | 默认重要性 | 普通公告 |
| **>1** | 提升重要性 | 加粗+放大的公告 |
| **<1** | 降低重要性 | 缩小字体的公告 |
| **0** | 完全忽略 | 不展示的公告 |

---

## **实际应用场景**

### **场景1：电商搜索**
```json
GET products/_search
{
  "query": {
    "multi_match": {
      "query": "手机",
      "fields": [
        "title^3",   // 标题权重最高（3倍）
        "category^2",// 分类其次（2倍）
        "description" // 描述默认权重（1倍）
      ]
    }
  }
}
```
- 标题匹配的结果最优先展示

### **场景2：新闻搜索**
```json
GET news/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "冬奥会",
              "boost": 5   // 标题匹配最重要
            }
          }
        },
        {
          "match": {
            "content": {
              "query": "冬奥会",
              "boost": 1   // 内容匹配次要
            }
          }
        }
      ]
    }
  }
}
```
- 优先展示标题包含"冬奥会"的新闻

### **场景3：促销活动**
```json
GET products/_search
{
  "query": {
    "match": {
      "tags": {
        "query": "限时特惠",
        "boost": 10  // 临时提升促销商品权重
      }
    }
  }
}
```
- 促销商品获得10倍权重，排在搜索结果最前面

---

## **使用注意事项**

### **1. 不要滥用boost**
- 过高的boost值（如100）会扭曲搜索结果
- 建议值范围：0.1 ~ 10

### **2. 永久vs临时boost**
| 类型 | 设置位置 | 特点 | 适用场景 |
|------|----------|------|----------|
| **永久boost** | mapping定义 | 影响所有查询 | 固定重要字段（如标题） |
| **临时boost** | 查询语句 | 仅影响当前查询 | 促销活动、热点事件 |

### **3. 组合使用效果更佳**
```json
"query": {
  "bool": {
    "should": [
      {"term": {"is_featured": {"value": true, "boost": 5}}},
      {"match": {"title": {"query": "手机", "boost": 3}}},
      {"match": {"description": "手机"}
    ]
  }
}
```
- 特色商品获得5倍权重
- 标题匹配获得3倍权重
- 描述匹配保持默认权重

### **4. 替代方案：function_score**
对于更复杂的权重控制，可以使用function_score：
```json
"query": {
  "function_score": {
    "query": {"match": {"content": "你好"}},
    "functions": [
      {
        "filter": {"term": {"category": "紧急通知"}},
        "weight": 5
      }
    ]
  }
}
```

## **记忆口诀**

**Boost是重要性放大器：**
- **大于1** → 提升优先级（乘数效应）
- **等于1** → 保持默认
- **小于1** → 降低优先级（0.5=减半）
- **永久设置** → 在mapping中定义
- **临时提升** → 在查询时指定

记住：**boost是相对值**，不是绝对值！合理使用能让你的搜索结果排序更符合业务需求。🎯