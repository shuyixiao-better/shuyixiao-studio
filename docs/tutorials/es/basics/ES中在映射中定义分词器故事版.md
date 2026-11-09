---
layout: doc
title: ES中在映射中定义分词器故事版
description: >-
  想象数字村有一家神奇的**文字加工厂**，专门处理各种文本原材料。工厂里有不同型号的**文本处理机（分词器）**，每种机器都有独特的加工方式！今天我们就来参观这家工厂，看看如何为不同产品线选择合适的机器。
date: '2025-10-09'
tags:
  - Elasticsearch
author: 境焕说AI
---
# ES中在映射中定义分词器故事版

> # 在映射中定义分词器
>
> ## 语法
>
> ```
> PUT {index}
> {
>   "mappings": {
>     "properties": {
>       "title":{
>         "type": "text",
>         "analyzer": "{analyzer}"
>       }
>     }
>   }
> }
> ```
>
> ## 内置分词器
>
> * **Standard Analyzer（标准分析器）** ：标准分析器是 ES 默认的分析器，它使用 Unicode 文本分割算法将文本分割成单个词汇单元。它会去除标点符号和空格，并将文本转换为小写形式。例如，将输入文本 "Hello, World!" 分析为 "hello" 和 "world"。
> * **Whitespace Analyzer（空格分析器）** ：空格分析器根据空格字符将文本分割为词汇单元。它保留空格和标点符号，不做大小写转换。例如，将输入文本 "Hello, World!" 分析为 "Hello,"、"World!" 和 ""（空字符）。
> * **Simple Analyzer（简单分析器）** ：简单分析器根据非字母字符将文本分割为词汇单元，并将词汇单元转换为小写形式。它不处理停用词和词干提取。例如，将输入文本 "Quick brown fox" 分析为 "quick"、"brown" 和 "fox"。
> * **Keyword Analyzer（关键字分析器）** ：关键字分析器将整个输入作为单个词汇单元，不进行分词。它通常用于不需要对输入进行分词的场景，如精确匹配。
> * **Language-specific Analyzers（特定语言分析器）** ：Elasticsearch 还提供了针对特定语言的分析器，如英语（English Analyzer）、法语（French Analyzer）、德语（German Analyzer）等。这些分析器根据特定的语言规则和语法进行分词、停用词过滤、词干提取等处理。



# **分词器：文字加工厂的「智能文本处理机」🏭📝**

想象数字村有一家神奇的**文字加工厂**，专门处理各种文本原材料。工厂里有不同型号的**文本处理机（分词器）**，每种机器都有独特的加工方式！今天我们就来参观这家工厂，看看如何为不同产品线选择合适的机器。

---

## **故事：文字加工厂的生产线配置**

### **1. 生产线设置公式（映射语法）**
```json
PUT {index}  // 创建新工厂
{
  "mappings": {
    "properties": {
      "title": {              // 产品线名称
        "type": "text",       // 生产文本产品
        "analyzer": "{analyzer}"  // 选择处理机器型号
      }
    }
  }
}
```

**实际建厂示例：**
```json
PUT book_factory  // 创建书籍加工厂
{
  "mappings": {
    "properties": {
      "book_title": {        // 书籍标题生产线
        "type": "text",
        "analyzer": "standard"  // 安装标准处理机
      }
    }
  }
}
```

---

## **五大主力处理机型号**

### **1. 标准处理机（Standard Analyzer）🏆**
**工厂定位：** 全能型主力设备，**默认安装**在所有生产线！

**加工特点：**
- 🧼 **清洁去杂**：自动去除标点符号
- 🔄 **规格统一**：所有文本转为小写
- 🔪 **智能分割**：按单词边界切分

**加工演示：**
```json
// 原料投入
"Hello, World! 你好世界"

// 加工成品
["hello", "world", "你", "好", "世", "界"]
```

**适用产品线：**
- 国际文档、多语言内容
- 不知道选什么时的安全选择

---

### **2. 空格分割机（Whitespace Analyzer）✂️**
**工厂定位：** 简单粗暴的基础设备

**加工特点：**
- ⚡ **极简操作**：只认空格，其他一律不管
- 🎯 **保留原貌**：不改变大小写，不过滤标点
- 🚀 **高速运行**：处理速度最快

**加工演示：**
```json
// 原料投入
"Hello, World! 2023年"

// 加工成品
["Hello,", "World!", "2023年"]  // 标点原样保留
```

**适用产品线：**
- 代码文件、技术文档
- 需要保留特殊符号的场景

---

### **3. 简易处理机（Simple Analyzer）📦**
**工厂定位：** 入门级经济设备

**加工特点：**
- 🔤 **字母优先**：遇到非字母就切一刀
- 🔄 **基础处理**：统一转小写
- 🚫 **功能精简**：不过滤停用词，不提取词干

**加工演示：**
```json
// 原料投入
"Quick brown-fox jumps"

// 加工成品
["quick", "brown", "fox", "jumps"]  // 连字符处切断
```

**适用产品线：**
- 简单英文内容
- 预算有限的加工需求

---

### **4. 整装打包机（Keyword Analyzer）📎**
**工厂定位：** 原装保鲜设备

**加工特点：**
- 📦 **原封不动**：完全不切割，整段文本作为一个单元
- 🎯 **精确匹配**：搜索时必须完全一致
- 💾 **节省空间**：不建索引，存储紧凑

**加工演示：**
```json
// 原料投入
"iPhone14 Pro Max 256GB"

// 加工成品
["iPhone14 Pro Max 256GB"]  // 完整保留！
```

**适用产品线：**
- 产品型号、ID编号
- 电话号码、邮政编码
- 需要精确匹配的字段

---

### **5. 母语专家机（Language-specific Analyzers）🌍**
**工厂定位：** 外语专业设备，按语种分不同型号

**专家团队：**
- 🇬🇧 **英语专家**：智能处理时态、单复数
- 🇫🇷 **法语专家**：处理法语特殊字符
- 🇩🇪 **德语专家**：处理复合词拆分
- 🇨🇳 **中文专家**：智能分词（需要安装IK插件）

**英语专家机演示：**
```json
// 原料投入
"Running jumps happily"

// 加工成品
["run", "jump", "happily"]  // 词干提取+时态处理
```

**适用产品线：**
- 特定语言的内容库
- 需要高级语言处理的场景

---

## **工厂实战：为不同产品线选配机器**

### **场景1：国际新闻网站**
```json
PUT news_factory
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard"  // 标准机处理多语言标题
      },
      "author_id": {
        "type": "text", 
        "analyzer": "keyword"   // 整装机保证作者ID精确匹配
      }
    }
  }
}
```

### **场景2：中文小说库**
```json
PUT novel_factory  
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "ik_smart"  // 中文专家机（需安装IK插件）
      }
    }
  }
}
```

### **场景3：技术文档库**
```json
PUT code_factory
{
  "mappings": {
    "properties": {
      "code_snippet": {
        "type": "text",
        "analyzer": "whitespace"  // 空格机保留代码格式
      }
    }
  }
}
```

---

## **选择机器的黄金法则**

### **决策流程图**
```
文本内容 → 是否需要精确匹配？ → 是 → 选择Keyword整装机
                ↓否
         → 是否是中文？ → 是 → 选择IK中文机
                ↓否  
         → 是否需要保留特殊符号？ → 是 → 选择Whitespace空格机
                ↓否
         → 是否是简单英文？ → 是 → 选择Simple简易机  
                ↓否
         → 选择Standard标准机（万能选择）
```

### **记忆口诀**
**文本加工五虎将：**
- **标准机**：万能选手，默认首选 🏆
- **空格机**：符号保留，代码专用 ✂️  
- **简易机**：英文简单，经济实惠 📦
- **整装机**：精确匹配，原样保鲜 📎
- **专家机**：母语处理，专业精准 🌍

**选型三问：**
> 1️⃣ 要精确匹配吗？ → 选Keyword  
> 2️⃣ 是中文内容吗？ → 选IK中文分析器  
> 3️⃣ 要保留符号吗？ → 选Whitespace  
> 4️⃣ 其他情况 → 选Standard最安全  

---

## **特别提醒：中文处理需要特殊装备**

Elasticsearch默认没有中文专家机，需要**安装IK插件**：
```bash
# 在ES容器中安装IK中文处理机
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.14.0/elasticsearch-analysis-ik-7.14.0.zip
```

**安装后即可使用：**
```json
"analyzer": "ik_smart"  // 智能中文分词
"analyzer": "ik_max_word"  // 最细粒度中文分词
```

记住这个文字加工厂的比喻，下次配置映射时就能轻松选出最适合的分词器了！🏭🎯
