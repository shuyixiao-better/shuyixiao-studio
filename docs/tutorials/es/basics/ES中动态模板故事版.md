---
layout: doc
title: ES中动态模板故事版
description: >-
  想象数字村有一家神奇的建筑公司，每当新工地（字段）出现时，公司会根据工地特征**自动生成定制化建筑蓝图（映射规则）**。这就是Elasticsearch的动态模板——让字段拥有智能匹配的超能力！
date: '2025-10-09'
tags:
  - Elasticsearch
author: 舒一笑不秃头
---
# ES中动态模板故事版

> # 6、映射模板
>
> ## 6.1 简介
>
> 之前讲过的映射类型或者字段参数，都是为确定的某个字段而声明的，如果希望对符合某类要求的特定字段制定映射，就需要用到映射模板：Dynamic templates。
>
> 映射模板有时候也被称作：自动映射模板、动态模板等。
>
> ## 6.2 用法
>
> ### 6.2.1 基本语法
>
> ```
> "dynamic_templates": [
>     {
>       "my_template_name": { 
>         ... match conditions ... 
>         "mapping": { ... } 
>       }
>     },
>     ...
> ]
> ```
>
> ### 6.2.2 C**onditions参数**
>
> - **match_mapping_type** ：主要用于对数据类型的匹配
> - **match 和 unmatch**：用于对字段名称的匹配
>
> ### 6.2.3 案例
>
> ```
> PUT test_dynamic_template
> {
>   "mappings": {
>     "dynamic_templates": [
>       {
>         "integers": {
>           "match_mapping_type": "long",
>           "mapping": {
>             "type": "integer"
>           }
>         }
>       },
>       {
>         "longs_as_strings": {
>           "match_mapping_type": "string",
>           "match": "num_*",
>           "unmatch": "*_text",
>           "mapping": {
>             "type": "keyword"
>           }
>         }
>       }
>     ]
>   }
> }
> 
> ```
>
> 以上代码会产生以下效果：
>
> - 所有 long 类型字段会默认映射为 integer
> - 所有文本字段，如果是以 num_ 开头，并且不以 _text 结尾，会自动映射为 keyword 类型
>
> ```
> post test_dynamic_template{
>  "test1":1234,
>  "num_text":"abc",
>  "num_123":"abc",
>  "123_text":"abc"
> }
> 
> get test_dynamic_template/_mapping
> ```



# **动态模板：建筑公司的「智能蓝图生成器」🏗️📐**

想象数字村有一家神奇的建筑公司，每当新工地（字段）出现时，公司会根据工地特征**自动生成定制化建筑蓝图（映射规则）**。这就是Elasticsearch的动态模板——让字段拥有智能匹配的超能力！

---

## **故事：建筑公司的智能蓝图系统**

### **1. 普通建筑模式（静态映射）**
```json
// 传统做法：每个工地单独设计
"building_age": { "type": "integer" },
"building_name": { "type": "text" }
```
**痛点：**
- 📝 每块新工地都要手工画蓝图
- ⏳ 效率低下
- 🤯 容易出错（比如把"age_123"误设为text类型）

---

### **2. 智能蓝图系统上线（动态模板）**
```json
PUT construction_site
{
  "mappings": {
    "dynamic_templates": [
      // 规则1：数字工地标准化
      {
        "integer_fields": {                  // 模板名称
          "match_mapping_type": "long",       // 识别特征：数字工地
          "mapping": { "type": "integer" }    // 自动蓝图：建整数楼
        }
      },
      // 规则2：特殊名称工地标准化
      {
        "num_keywords": {                     // 模板名称
          "match_mapping_type": "string",      // 识别特征：文本工地
          "match": "num_*",                   // 名称以num_开头
          "unmatch": "*_text",                 // 且不以_text结尾
          "mapping": { "type": "keyword" }     // 自动蓝图：建关键词楼
        }
      }
    ]
  }
}
```

---

## **智能蓝图如何工作？**

### **场景1：数字工地的标准化（规则1）**
```json
// 新工地："lot_size": 5000（long类型）
→ 匹配规则1 → 自动转为integer类型
```

### **场景2：特殊文本工地的处理（规则2）**
```json
// 新工地1："num_123": "100"（文本）
→ 名称以"num_"开头 ✅
→ 不以"_text"结尾 ✅
→ 自动转为keyword类型

// 新工地2："num_text": "abc"（文本）
→ 名称以"num_"开头 ✅
→ 以"_text"结尾 ❌ → 不应用规则 → 保持text类型

// 新工地3："123_text": "abc"（文本）
→ 名称不以"num_"开头 ❌ → 不应用规则
```

---

## **你的测试案例解析**

### **提交四个新工地**
```json
POST construction_site/_doc
{
  "test1":1234,       // → 触发规则1 → integer
  "num_text":"abc",   // → 不触发规则2 → text
  "num_123":"abc",    // → 触发规则2 → keyword
  "123_text":"abc"    // → 不触发任何规则 → text
}
```

### **自动生成的建筑蓝图**
```json
{
  "test1": { "type": "integer" },   // 规则1生效
  "num_text": { "type": "text" },    // 规则2排除
  "num_123": { "type": "keyword" }, // 规则2生效
  "123_text": { "type": "text" }     // 无匹配规则
}
```

---

## **动态模板三大神器**

### **1. 类型识别器（match_mapping_type）**
```json
"match_mapping_type": "string"  // 只处理文本工地
```
**支持类型：**  
`string`, `long`, `double`, `boolean`, `date`, `object`

### **2. 名称筛选器（match & unmatch）**
```json
"match": "num_*",       // 名称以num_开头
"unmatch": "*_text"     // 排除以_text结尾
```
**通配符：**
- `*` 匹配任意字符
- `?` 匹配单个字符

### **3. 正则表达式模式**
```json
"match_pattern": "regex",
"match": "^profit_\\d+$"  // 匹配profit_123
```

---

## **为什么需要动态模板？**

### **解决四大痛点**
| 痛点 | 传统方式 | 动态模板方案 |
|------|----------|--------------|
| **字段爆炸** | 手工定义每个字段 | 自动批量处理 |
| **命名规范** | 容易遗漏 | 强制统一标准 |
| **特殊处理** | 需后期修改 | 即时自动处理 |
| **多语言支持** | 复杂配置 | 按后缀自动分词 |

---

## **实战模板配方**

### **配方1：强制命名规范**
```json
{
  "numbers_as_floats": {
    "match_mapping_type": "long",
    "match": "price_*|quantity_*",  // 价格/数量字段
    "mapping": {
      "type": "scaled_float",
      "scaling_factor": 100
    }
  }
}
```

### **配方2：自动多语言处理**
```json
{
  "chinese_fields": {
    "match": "*_cn",        // 中文字段
    "mapping": {
      "type": "text",
      "analyzer": "ik_smart"
    }
  },
  "english_fields": {
    "match": "*_en",        // 英文字段
    "mapping": {
      "type": "text",
      "analyzer": "english"
    }
  }
}
```

### **配方3：智能ID识别**
```json
{
  "id_fields": {
    "match_pattern": "regex",
    "match": "^.*_id$",     // 匹配所有_id结尾字段
    "mapping": {
      "type": "keyword"
    }
  }
}
```

---

## **避坑指南**

### **坑1：模板顺序陷阱**
```json
// 错误顺序
[
  { "catch_all": { "match": "*", ... } },  // 先匹配所有
  { "special_rule": { "match": "price_*", ... } } // 永远不执行
]

// 正确顺序
[
  { "special_rule": { "match": "price_*", ... } }, // 特殊规则在前
  { "catch_all": { "match": "*", ... } }           // 兜底规则在后
]
```

### **坑2：冲突规则**
```json
// 冲突配置
{
  "rule1": { "match": "num_*", "mapping": { "type": "integer" } },
  "rule2": { "match": "num_*", "mapping": { "type": "keyword" } }
}
// 结果：按顺序执行第一个匹配的规则
```

### **坑3：过度匹配**
```json
// 危险配置
"match": "*"  // 匹配所有字段
// 可能把本应是text的字段转为keyword
```

---

## **黄金配置法则**

```json
PUT smart_city
{
  "mappings": {
    "dynamic_templates": [
      // 第1优先级：特殊字段
      {
        "id_fields": {
          "match": "*_id",
          "mapping": { "type": "keyword" }
        }
      },
      // 第2优先级：数字字段
      {
        "numeric_fields": {
          "match_mapping_type": "long|double",
          "mapping": { "type": "scaled_float", "scaling_factor": 100 }
        }
      },
      // 第3优先级：文本字段
      {
        "string_fields": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": { "raw": { "type": "keyword" } }
          }
        }
      }
    ]
  }
}
```

---

## **记忆口诀**

**智能蓝图三要素：**
1. **识类型** → 数字/文本/日期  
2. **看名字** → 前缀后缀特征  
3. **定蓝图** → 自动精准映射  

**配置口诀：**  
> 🔢 数字字段 → 统一浮点精度  
> 🔤 文本字段 → 主分面子精确  
> 🆔 ID字段 → 强制keyword类型  
> 🌐 多语言 → 按后缀自动分词  

**重要原则：**  
> ⚠️ 特殊规则放前面  
> ⚠️ 兜底规则放最后  
> ⚠️ 正则匹配要谨慎  

记住这个建筑公司的比喻，让你的Elasticsearch映射既智能又规范！ 🏗️🚀
