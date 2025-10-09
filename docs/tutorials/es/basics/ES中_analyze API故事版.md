---
layout: doc
title: ES中_analyze API故事版
description: >-
  想象数字村的文字厨房里有个神奇的**食材检测仪**，任何文本食材放进去，都能立即看到会被切菜机处理成什么样子！这就是Elasticsearch的_analyze
  API！
date: '2025-10-09'
tags:
  - Elasticsearch
author: 舒一笑不秃头
---
# ES中_analyze API故事版

> # _analyze API
>
> 在 Elasticsearch 中，可以使用 _analyze API 对指定的文本进行分词和分析，以便于调试和优化分词器的性能。
>
> 要使用 _analyze API，可以使用以下 HTTP 请求：
>
> ```
> GET /{index}/_analyze
> {
>   "analyzer": "{analyzer_name}",
>   "text": "{text}"
> }
> ```
>
> 其中，{index} 是要分析的索引名称，{analyzer_name} 是要使用的分词器的名称，{text} 是要分析的文本内容。这个请求将返回一个包含分析结果的 JSON 格式的响应。
>
> 例如，如果要对 "I am Teacher Li Jin, and I am familiar with technologies such as JVM and MQ" 进行分词，可以使用以下请求：
>
> ```
> GET /message/_analyze  
> {  
>   "text": "I am Teacher Li Jin, and I am familiar with technologies such as JVM and MQ",  
>   "analyzer": "standard"  
> }
> ```
>
> 这个请求将使用标准分词器对 "Quick brown fox" 进行分词，并返回以下结果：
>
> ```
> {
>   "tokens" : [
>     {
>       "token" : "i",
>       "start_offset" : 0,
>       "end_offset" : 1,
>       "type" : "<ALPHANUM>",
>       "position" : 0
>     },
>     {
>       "token" : "am",
>       "start_offset" : 2,
>       "end_offset" : 4,
>       "type" : "<ALPHANUM>",
>       "position" : 1
>     },
>     {
>       "token" : "teacher",
>       "start_offset" : 5,
>       "end_offset" : 12,
>       "type" : "<ALPHANUM>",
>       "position" : 2
>     },
>     {
>       "token" : "li",
>       "start_offset" : 13,
>       "end_offset" : 15,
>       "type" : "<ALPHANUM>",
>       "position" : 3
>     },
>     {
>       "token" : "jin",
>       "start_offset" : 16,
>       "end_offset" : 19,
>       "type" : "<ALPHANUM>",
>       "position" : 4
>     },
>     {
>       "token" : "and",
>       "start_offset" : 21,
>       "end_offset" : 24,
>       "type" : "<ALPHANUM>",
>       "position" : 5
>     },
>     {
>       "token" : "i",
>       "start_offset" : 25,
>       "end_offset" : 26,
>       "type" : "<ALPHANUM>",
>       "position" : 6
>     },
>     {
>       "token" : "am",
>       "start_offset" : 27,
>       "end_offset" : 29,
>       "type" : "<ALPHANUM>",
>       "position" : 7
>     },
>     {
>       "token" : "familiar",
>       "start_offset" : 30,
>       "end_offset" : 38,
>       "type" : "<ALPHANUM>",
>       "position" : 8
>     },
>     {
>       "token" : "with",
>       "start_offset" : 39,
>       "end_offset" : 43,
>       "type" : "<ALPHANUM>",
>       "position" : 9
>     },
>     {
>       "token" : "technologies",
>       "start_offset" : 44,
>       "end_offset" : 56,
>       "type" : "<ALPHANUM>",
>       "position" : 10
>     },
>     {
>       "token" : "such",
>       "start_offset" : 57,
>       "end_offset" : 61,
>       "type" : "<ALPHANUM>",
>       "position" : 11
>     },
>     {
>       "token" : "as",
>       "start_offset" : 62,
>       "end_offset" : 64,
>       "type" : "<ALPHANUM>",
>       "position" : 12
>     },
>     {
>       "token" : "jvm",
>       "start_offset" : 65,
>       "end_offset" : 68,
>       "type" : "<ALPHANUM>",
>       "position" : 13
>     },
>     {
>       "token" : "and",
>       "start_offset" : 69,
>       "end_offset" : 72,
>       "type" : "<ALPHANUM>",
>       "position" : 14
>     },
>     {
>       "token" : "mq",
>       "start_offset" : 73,
>       "end_offset" : 75,
>       "type" : "<ALPHANUM>",
>       "position" : 15
>     }
>   ]
> }
> 
> ```
>
> 这个响应包含了分析结果，其中包括了分词后的单词、单词的偏移量、类型和位置等信息。
>
> 总之，_analyze API 可以帮助您了解分词器的工作原理和分析结果，以便于优化分词器的性能和效果。



# **_analyze API：数字村的「食材检测仪」🔍🥬**

想象数字村的文字厨房里有个神奇的**食材检测仪**，任何文本食材放进去，都能立即看到会被切菜机处理成什么样子！这就是Elasticsearch的_analyze API！

---

## **故事：厨房里的神奇检测仪**

### **1. 检测仪的基本操作**
```bash
# 检测仪使用公式
GET /{厨房}/_analyze  
{
  "text": "{待检测食材}",
  "analyzer": "{切菜机型号}"
}
```

### **2. 实际检测演示**
```json
GET /message/_analyze  
{
  "text": "I am Teacher Li Jin, and I am familiar with technologies such as JVM and MQ",
  "analyzer": "standard"  // 使用标准切菜机
}
```

**检测结果：**
```json
{
  "tokens": [
    {
      "token": "i",           // 切出的词块
      "start_offset": 0,     // 起始位置：第0个字符
      "end_offset": 1,       // 结束位置：第1个字符
      "type": "<ALPHANUM>",  // 类型：字母数字
      "position": 0          // 顺序位置：第一个
    },
    {
      "token": "am",         // 第二个词块
      "start_offset": 2,     // 从第2个字符开始
      "end_offset": 4,       // 到第4个字符结束
      "type": "<ALPHANUM>",
      "position": 1          // 第二个位置
    }
    // ... 更多词块
  ]
}
```

---

## **检测报告的详细解读**

### **1. token（词块）→ 切出的菜丁**
```text
原始文本："I am Teacher Li Jin"
↓ 标准切菜机处理
切分结果：["i", "am", "teacher", "li", "jin"]
```

### **2. offset（偏移量）→ 菜丁在原食材中的位置**
```text
"I am Teacher"
012345678901  ← 字符位置索引

"i"    : 位置0-1
"am"   : 位置2-4  
"teacher": 位置5-12
```

### **3. position（位置）→ 菜丁的出场顺序**
```text
"I am Teacher Li Jin"
↓ 顺序编号
0:i → 1:am → 2:teacher → 3:li → 4:jin
```

### **4. type（类型）→ 菜丁的品种分类**
- `<ALPHANUM>`：字母数字（大部分英文单词）
- `<HANGUL>`：韩文字符
- `<IDEOGRAPHIC>`：中日文字符
- `<EMOJI>`：表情符号

---

## **为什么需要食材检测仪？**

### **场景1：调试切菜效果**
```json
// 怀疑切菜机有问题？检测一下！
GET /_analyze
{
  "text": "北京烤鸭真好吃",
  "analyzer": "standard"  // 用标准机切中文
}

// 结果：["北", "京", "烤", "鸭", "真", "好", "吃"] ← 切太碎了！
// 结论：需要换中文专用切菜机
```

### **场景2：对比不同切菜机**
```json
// 对比标准机和中文机
GET /_analyze
{
  "text": "我爱北京天安门",
  "analyzer": "standard"  // 标准机：单字切分
}

GET /_analyze  
{
  "text": "我爱北京天安门", 
  "analyzer": "ik_smart"  // 中文机：词语切分
}

// 结果对比：
// 标准机：["我", "爱", "北", "京", "天", "安", "门"] ← 效果差
// 中文机：["我", "爱", "北京", "天安门"] ← 效果佳
```

### **场景3：测试自定义配方**
```json
// 测试自定义切菜机配方
GET /my_index/_analyze
{
  "text": "Hello-World! 2023年",
  "analyzer": "my_custom_analyzer"  // 自定义组合
}

// 观察：是否按预期去标点、分词语、转小写
```

---

## **检测仪的多种用法**

### **用法1：指定厨房检测（索引级配置）**
```json
GET /my_kitchen/_analyze  // 使用my_kitchen的切菜机
{
  "text": "测试文本",
  "analyzer": "standard"
}
```

### **用法2：临时组合配方（字段级配置）**
```json
GET /_analyze
{
  "text": "Hello World",
  "char_filter": ["html_strip"],  // 临时洗菜方式
  "tokenizer": "standard",        // 临时切菜方式
  "filter": ["lowercase"]         // 临时调味方式
}
```

### **用法3：模拟特定字段**
```json
GET /my_index/_analyze  
{
  "field": "product_name",  // 模拟product_name字段的处理
  "text": "iPhone14 Pro Max"
}

// 使用product_name字段配置的分词器
```

---

## **实战检测案例**

### **案例1：电商搜索优化**
```json
// 检测商品标题分词效果
GET /ecommerce/_analyze
{
  "field": "title", 
  "text": "2023新款iPhone14 Pro Max 256GB"
}

// 观察：是否正确识别"iPhone14"、"Pro"、"Max"为独立关键词
```

### **案例2：多语言内容处理**
```json
// 检测混合语言文本
GET /news/_analyze  
{
  "field": "content",
  "text": "COVID-19疫情在2023年得到控制，WHO表示赞赏"
}

// 观察：英文缩写"COVID-19"、"WHO"是否被正确处理
```

### **案例3：特殊符号处理**
```json
// 检测代码或技术文档
GET /docs/_analyze
{
  "field": "code_snippet",
  "text": "printf('Hello %s', name); // 输出欢迎信息"
}

// 观察：是否保留必要符号，过滤注释
```

---

## **检测仪的高级功能**

### **1. 详细模式（explain）**
```json
GET /_analyze
{
  "text": "北京烤鸭",
  "analyzer": "ik_max_word",
  "explain": true  // 显示详细处理过程
}

// 返回：包括每个过滤器的具体作用
```

### **2. 属性筛选（attributes）**
```json
GET /_analyze
{
  "text": "Hello World",
  "analyzer": "standard",
  "attributes": ["keyword"]  // 只返回特定属性
}
```

### **3. 多文本批量检测**
```json
GET /_analyze
{
  "texts": ["文本1", "文本2", "文本3"],  // 批量检测
  "analyzer": "standard"
}
```

---

## **记忆口诀**

**食材检测仪四步法：**
1. **选厨房** → 指定索引（或用默认）
2. **放食材** → 输入待检测文本
3. **选机器** → 指定分词器
4. **看报告** → 分析tokens结果

**检测重点：**
- 🔪 **切分粒度** → 词块大小是否合适
- 🧼 **清洗效果** → 标点符号是否处理
- 🔄 **格式统一** → 大小写是否规范
- 🚫 **停用词** → 无意义词是否过滤

**实用场景：**
> 🐛 调试分词问题 → 立即验证效果  
> 🔍 对比不同分词器 → 选择最佳方案  
> 🧪 测试自定义配置 → 确保符合预期  

记住这个食材检测仪的比喻，让你的Elasticsearch分词调试变得轻松有趣！ 🔍👨🍳
