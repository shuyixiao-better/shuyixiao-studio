---
layout: doc
title: ES中映射参数故事版
description: 让我们用一个生动的故事来理解 `index` 这个重要的映射参数！
date: '2025-10-09'
tags:
  - Elasticsearch
  - Java
author: 境焕说AI
---
# ES中映射参数故事版

> # 映射参数
>
> ## index
>
> **index**：是否对创建对当前字段创建倒排索引，默认 true，如果不创建索引，该字段不会通过索引被搜索到,但是仍然会在 source 元数据中展示
>
> ```java
> ##index
> delete users
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
> ```
>
# **映射参数 index：数字村的"电话簿登记处" 📞**

让我们用一个生动的故事来理解 `index` 这个重要的映射参数！

## **故事：数字村的电话簿系统**

想象数字村有一个**电话簿管理员**，他的工作是维护全村人的联系方式。但这个管理员有个特殊规则：**只有在他那里登记过的人，才能被其他人通过电话簿找到**。

### **1. 默认情况：自动登记（index: true）**

正常情况下，每个新村民的电话都会**自动登记**到电话簿中：

```json
PUT villagers
{
  "mappings": {
    "properties": {
      "name": {"type": "text"},    // 自动登记到电话簿
      "phone": {"type": "keyword"}  // 自动登记到电话簿
    }
  }
}
```

**结果：**
- 任何人都可以通过电话簿查找村民
- 搜索 `"张三"` 或 `"13800138000"` 都能找到对应的人

### **2. 特殊设置：隐私保护模式（index: false）**

现在有个村民**王五**，他很注重隐私，不希望自己的电话被登记在公共电话簿上：

```json
PUT users
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer",
        "index": false  // 告诉管理员：别登记这个！
      }
    }
  }
}
```

**王五的想法：**
- "我的年龄是**隐私信息**，不想让别人通过年龄搜到我"
- "但当我展示个人资料时，年龄**可以显示**"

### **3. 实际操作演示**

#### **步骤1：创建隐私保护的档案系统**
```json
DELETE users

PUT users
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer",
        "index": false  // 年龄不加入"电话簿"
      }
    }
  }
}
```

#### **步骤2：存入王五的档案**
```json
PUT users/_doc/1
{
  "age": 99
}
```

#### **步骤3：尝试通过年龄搜索（失败！）**
```json
GET users/_search
{
  "query": {
    "term": {
      "age": 99  // 试图通过年龄99岁来找人
    }
  }
}
```

**结果：** 搜索返回 **0 个结果**！
- 🔍 **搜索失败原因**：年龄字段没有加入"电话簿"（倒排索引）
- 📞 **管理员回应**："抱歉，电话簿里没有登记年龄信息，我无法帮你查找"

#### **步骤4：但信息确实存储了！**
```json
GET users/_doc/1
```

**返回结果：**
```json
{
  "_index": "users",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "age": 99  // 年龄信息确实存在！
  }
}
```

✅ **信息安全存储**：年龄99岁这个信息确实保存在档案里，只是不能通过搜索找到

---

## **深入理解：index 参数的两种模式**

### **模式1：公开登记（index: true）✅**
```json
"phone": {
  "type": "keyword",
  "index": true  // 默认值，可以省略
}
```
- **比喻**：电话登记在公共电话簿上
- **效果**：可以通过 `13800138000` 搜索到这个人
- **使用场景**：需要被搜索的字段（姓名、标题、标签等）

### **模式2：隐私保护（index: false）🚫**
```json
"age": {
  "type": "integer", 
  "index": false  // 明确声明不索引
}
```
- **比喻**：电话**不登记**在公共电话簿上
- **效果**：**无法**通过年龄搜索到这个人
- **使用场景**：敏感信息、仅用于展示的字段、大文本内容等

---

## **实际应用场景**

### **场景1：保护用户隐私**
```json
PUT user_profiles
{
  "mappings": {
    "properties": {
      "user_id": {"type": "keyword"},      // 可搜索
      "email": {"type": "keyword"},         // 可搜索  
      "id_card": {
        "type": "keyword",
        "index": false  // 身份证号不允搜索！
      },
      "phone": {
        "type": "keyword", 
        "index": false  // 手机号不允许搜索！
      }
    }
  }
}
```

### **场景2：优化存储性能**
```json
PUT articles
{
  "mappings": {
    "properties": {
      "title": {"type": "text"},          // 需要搜索
      "content": {
        "type": "text",
        "index": false  // 文章内容太大，不建索引节省空间
      },
      "html_content": {
        "type": "text", 
        "index": false  // HTML源码不需要搜索
      }
    }
  }
}
```

### **场景3：组合使用示例**
```json
PUT products
{
  "mappings": {
    "properties": {
      "product_id": {"type": "keyword"},    // 可搜索
      "product_name": {"type": "text"},      // 可搜索
      "description": {"type": "text"},      // 可搜索
      "internal_notes": {                   // 内部备注，不搜索
        "type": "text",
        "index": false
      },
      "image_base64": {                    // Base64图片，不搜索
        "type": "binary",
        "index": false
      },
      "create_time": {"type": "date"},     // 可搜索、可排序
      "update_time": {                     // 仅记录，不搜索
        "type": "date", 
        "index": false
      }
    }
  }
}
```

---

## **重要注意事项**

### **1. index: false 不等于不存储**
```json
// 错误理解：设置了 index: false 数据就丢了？
// 正确理解：数据正常存储，只是不能通过这个字段搜索

GET users/_doc/1
// 仍然能看到：{"age": 99} - 数据完好无损！
```

### **2. 与 enabled 参数的区别**
```json
"age": {
  "type": "integer",
  "index": false    // 可存储，不可搜索
}

"metadata": {
  "enabled": false  // 完全忽略，不存储不搜索
}
```

### **3. 生产环境使用建议**
```json
PUT best_practice
{
  "mappings": {
    "properties": {
      // 需要搜索的字段
      "searchable_field": {"type": "text"},
      
      // 敏感信息保护
      "sensitive_data": {
        "type": "keyword",
        "index": false
      },
      
      // 大内容优化
      "large_content": {
        "type": "text", 
        "index": false
      },
      
      // 仅用于展示的字段
      "display_only": {
        "type": "keyword",
        "index": false
      }
    }
  }
}
```

## **记忆口诀**

**index参数很简单，就像电话簿登记：**
- **index: true** → **公开登记**，大家都能搜到
- **index: false** → **隐私保护**，存储但不让搜
- **默认都是 true** → 自动登记，方便搜索
- **敏感大数据** → 设为false，安全又省空间

记住这个电话簿的比喻，你就能轻松掌握 index 参数的精髓了！📚✨
