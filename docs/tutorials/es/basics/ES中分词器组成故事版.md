---
layout: doc
title: ES中分词器组成故事版
description: 想象数字村的文字厨房里有一条**智能食材加工流水线**，任何文本食材都要经过三个车间的精密处理，才能变成美味的搜索佳肴！
date: '2025-10-09'
tags:
  - Elasticsearch
author: 境焕说AI
---
# ES中分词器组成故事版

> # 分词器的组成
>
> ## **Character Filter**
>
> 分词之前的预处理，过滤无用字符
>
> ```
> PUT <index_name>
> {
>   "settings": {
>     "analysis": {
>       "char_filter": {
>         "my_char_filter": {
>           "type": "<value>"  // 参数 type: html_strip、mapping、pattern_replace
>         }
>       }
>     }
>   }
> }
> ```
>
> ### HTML 标签过滤器
>
> 字符过滤器会去除 HTML 标签和转义 HTML 元素，如 `<b>`、&amp;
>
> ```
> PUT test_char_filter
> {
>   "settings": {
>     "analysis": {
>       "char_filter": {
>         "my_char_filter": {
>           "type": "html_strip", 
>           "escaped_tags": [
>             "a"
>           ]
>         }
>       }
>     }
>   }
> }
> GET test_html_strip_filter/_analyze
> {
>   "tokenizer": "standard", 
>   "char_filter": ["my_char_filter"],
>   "text": ["<p>I'm so <a>happy</a>!</p>"]
> }
> ```
>
> **参数：**
>
> * escaped_tags：需要保留的 html 标签
>
> ###  字符映射过滤器：Mapping Character Filter
>
> **通过定义映替换为规则，把特定字符替换为指定字符**
>
> ```
> PUT test_html_strip_filter
> {
>   "settings": {
>     "analysis": {
>       "char_filter": {
>         "my_char_filter": {
>           "type": "mapping",	// mapping 代表使用字符映射过滤器
>           "mappings": [				// 数组中规定的字符会被等价替换为 => 指定的字符
>             "滚 => *",
>             "垃 => *",
>             "圾 => *"
>           ]
>         }
>       }
>     }
>   }
> }
> GET test_html_strip_filter/_analyze
> {
>   //"tokenizer": "standard", 
>   "char_filter": ["my_char_filter"],
>   "text": "你就是个垃圾！滚"
> }
> ```
>
> ### 正则替换过滤器：Pattern Replace Character Filter
>
> ```
> PUT text_pattern_replace_filter
> {
>   "settings": {
>     "analysis": {
>       "char_filter": {
>         "my_char_filter": {
>           "type": "pattern_replace",	// pattern_replace 代表使用正则替换过滤器
>           "pattern": """(\d{3})\d{4}(\d{4})""",	// 正则表达式
>           "replacement": "$1****$2"
>         }
>       }
>     }
>   }
> }
> GET text_pattern_replace_filter/_analyze
> {
>   "char_filter": ["my_char_filter"],
>   "text": "您的手机号是18868686688"
> }
> ```
>
> ## Tokenizer
>
> **可以把切词器理解为预定义的切词规则。**
>
> **官方内置了很多种切词器，默认的切词器为 standard。**
>
> 在 Elasticsearch (ES) 中，Tokenizer 是一种文本处理组件，用于将输入的文本数据分割成称为词汇单元（Tokens）的片段。Tokenizer 在文本分析过程中起到了关键的作用，它将文本转换为可供索引和搜索的基本单位。
>
> ES 提供了多种内置的 Tokenizer，每种 Tokenizer 都有不同的分割规则。下面是一些常见的 Tokenizer 示例：
>
> 1. Standard Tokenizer（标准分词器）：
>    * 这是 ES 默认的 Tokenizer，它使用 Unicode 文本分割算法将文本分割成单个词汇单元。它会去除标点符号和空格，并将文本转换为小写形式。例如，输入文本 "Hello, World!" 会被分割成两个词汇单元 "hello" 和 "world"。
> 2. Whitespace Tokenizer（空格分词器）：
>    * 这个 Tokenizer 根据空格字符将文本分割为词汇单元。它保留空格和标点符号，不做大小写转换。例如，输入文本 "Hello, World!" 会被分割成三个词汇单元 "Hello,"、"World!" 和 ""（空字符）。
> 3. Keyword Tokenizer（关键字分词器）：
>    * 这个 Tokenizer 将整个输入作为单个词汇单元。它通常用于不需要对输入进行分词的场景，如精确匹配。例如，输入文本 "Hello, World!" 会作为一个完整的词汇单元存储。
> 4. Pattern Tokenizer（模式分词器）：
>    * 这个 Tokenizer 根据正则表达式模式将文本分割为词汇单元。你可以根据自定义的模式定义如何分割文本。例如，使用模式 `\W+`，输入文本 "Hello, World!" 会被分割成两个词汇单元 "Hello" 和 "World"。
> 5. Language-specific Tokenizers（特定语言分词器）：
>    * ES 还提供了针对特定语言的 Tokenizer，如英语、中文、日语等。这些分词器会根据特定的语言规则和语法进行分词。例如，中文分词器会将中文文本按照词语进行分割。
>
> 这些示例只是 ES 中一些常见的 Tokenizer，你还可以自定义 Tokenizer 来满足特定需求。Tokenizer 是 ES 中文本处理流程的关键组件之一，它的选择和配置对于索引和搜索的结果影响重大。根据你的数据和需求，选择适合的 Tokenizer 可以提高搜索的准确性和性能。
>
> ## Token Filter
>
> ### 作用
>
> 在 Elasticsearch (ES) 中，Token Filter 是一种文本处理组件，用于对 Tokenizer 分割得到的词汇单元进行进一步的处理和修改。Token Filter 可以修改、删除或添加新的词汇单元，以改善索引和搜索的效果。
>
> 在 Elasticsearch 的查询 DSL (Domain Specific Language) 中，可以通过配置 Token Filter 来定义如何处理和修改文本数据。
>
> ### 常见的 token filter
>
> * `synonym`：用于将指定的词汇替换为其同义词。这对于扩展搜索能力或纠正拼写错误很有用。例如，将 "car" 替换为 "automobile"。
> * `ngram`：将词汇单元拆分成 n-gram（连续的 n 个字符），用于支持部分匹配和模糊搜索。例如，"quick" 可以拆分成 "qu"、"qui"、"quic"、"quick"。
> * `stemmer`：应用词干提取算法，将单词还原为其词干形式。例如，将 "running" 还原为 "run"。
> * `stop`：移除停用词，这些词在搜索中往往没有实际意义或频繁出现。例如，"the"、"is"、"and"。
> * `trim`：修剪词汇单元的前导和尾随空格。
> * `phonetic`：生成音译代码，用于支持音译搜索。例如，将 "Smith" 转换为 "SM0".
>
> ### 案例
>
> 下面是一个示例，演示了如何在查询中使用 Token Filter：
>
> 假设我们有一个索引，其中包含一个名为 "description" 的字段，我们希望在查询时使用 Token Filter 对输入的查询文本进行处理。
>
> ```
> PUT stop_token_filter
> {
>   "settings": {
>     "analysis": {
>       "filter": {
>         "my_filter": {
>           "type": "stop",
>           "stopwords": [
>             "www"
>           ],
>           "ignore_case": true
>         }
>       }
>     }
>   }
> }
> GET stop_token_filter/_analyze
> {
>   "tokenizer": "whitespace", 
>   "filter": ["my_filter"], 
>   "text": ["WWW ELASTIC ORG CN"]
> }
> ```
>



# **分词器三剑客：文字厨房的「食材加工流水线」🏭🔪🧂**

想象数字村的文字厨房里有一条**智能食材加工流水线**，任何文本食材都要经过三个车间的精密处理，才能变成美味的搜索佳肴！

---

## **故事：文字厨房的三车间流水线**

### **第一车间：食材清洗车间（Character Filter）🚿**

这个车间负责**清洗食材杂质**，确保进入切菜机的食材干净卫生！

#### **1.1 HTML标签清洗机**
```json
"char_filter": {
  "my_char_filter": {
    "type": "html_strip",      // 专用HTML清洗机
    "escaped_tags": ["a"]      // 特别保留<a>标签
  }
}
```

**工作效果：**
```text
输入：<p>I'm so <a>happy</a>!</p>
↓ 清洗去除<p>、</p>等标签
输出：I'm so <a>happy</a>!
```

**检测结果：**
```json
GET test_char_filter/_analyze
{
  "tokenizer": "standard", 
  "char_filter": ["my_char_filter"],
  "text": ["<p>I'm so <a>happy</a>!</p>"]
}
// 输出：["I'm", "so", "<a>happy</a>"]
```

#### **1.2 敏感词替换机（Mapping Filter）🔤**
```json
"char_filter": {
  "my_char_filter": {
    "type": "mapping",
    "mappings": [
      "滚 => *",    // 把"滚"替换成*
      "垃 => *",    // 把"垃"替换成*  
      "圾 => *"     // 把"圾"替换成*
    ]
  }
}
```

**工作效果：**
```text
输入："你就是个垃圾！滚"
↓ 敏感词替换
输出："你就是个***！*"
```

#### **1.3 隐私脱敏机（Pattern Replace）🔒**
```json
"char_filter": {
  "my_char_filter": {
    "type": "pattern_replace",
    "pattern": """(\d{3})\d{4}(\d{4})""",  // 手机号正则
    "replacement": "$1****$2"              // 中间4位打码
  }
}
```

**工作效果：**
```text
输入："您的手机号是18868686688"
↓ 隐私脱敏
输出："您的手机号是188****6688"
```

---

## **第二车间：精准切菜车间（Tokenizer）🔪**

这个车间负责**把清洗后的食材切成标准词块**，不同的切菜机有不同的刀法！

### **四大主力切菜机**

#### **2.1 标准切菜机（Standard Tokenizer）📏**
```json
"tokenizer": "standard"
```
**刀法特点：**
- 按空格和标点切分
- 英文转小写
- 中文单字切分

**切菜效果：**
```text
"Hello World! 你好世界"
→ ["hello", "world", "你", "好", "世", "界"]
```

#### **2.2 空格切菜机（Whitespace Tokenizer）✂️**
```json
"tokenizer": "whitespace"
```
**刀法特点：**
- 严格按空格切分
- 保留标点符号

**切菜效果：**
```text
"Hello, World! 2023年"
→ ["Hello,", "World!", "2023年"]
```

#### **2.3 关键词整块机（Keyword Tokenizer）📦**
```json
"tokenizer": "keyword"
```
**刀法特点：**
- 不切分！整块处理
- 适合ID、编码等

**切菜效果：**
```text
"iPhone14 Pro Max"
→ ["iPhone14 Pro Max"]  // 完整保留
```

#### **2.4 中文智能切菜机（IK Tokenizer）🎯**
```json
"tokenizer": "ik_smart"
```
**刀法特点：**
- 理解中文语义
- 按词语而非单字切分

**切菜效果：**
```text
"我爱北京天安门"
→ ["我", "爱", "北京", "天安门"]  // 智能分词！
```

---

## **第三车间：调味精加工车间（Token Filter）🧂**

这个车间负责**对切好的词块进行调味处理**，提升口感和营养价值！

### **五大调味工艺**

#### **3.1 停用词过滤器（Stop Filter）🚫**
```json
"filter": {
  "my_filter": {
    "type": "stop",
    "stopwords": ["www"],     // 过滤"www"
    "ignore_case": true        // 忽略大小写
  }
}
```

**调味效果：**
```text
输入：["WWW", "ELASTIC", "ORG", "CN"]
↓ 过滤停用词
输出：["ELASTIC", "ORG", "CN"]
```

#### **3.2 同义词扩展器（Synonym Filter）🔗**
```json
"filter": {
  "synonym_filter": {
    "type": "synonym",
    "synonyms": ["手机 => 智能手机,移动电话"]
  }
}
```

**调味效果：**
```text
输入：["手机"]
↓ 同义词扩展
输出：["手机", "智能手机", "移动电话"]
```

#### **3.3 词干提取器（Stemmer Filter）🌱**
```json
"filter": {
  "stemmer_filter": {
    "type": "stemmer",
    "language": "english"
  }
}
```

**调味效果：**
```text
输入：["running", "jumps", "happily"]
↓ 词干提取
输出：["run", "jump", "happy"]
```

#### **3.4 大小写统一器（Lowercase Filter）🔡**
```json
"filter": {
  "lowercase_filter": {
    "type": "lowercase"
  }
}
```

**调味效果：**
```text
输入：["Apple", "iPhone", "PRO"]
↓ 转小写
输出：["apple", "iphone", "pro"]
```

#### **3.5 N-gram切片机（NGram Filter）🔪**
```json
"filter": {
  "ngram_filter": {
    "type": "ngram",
    "min_gram": 2,
    "max_gram": 3
  }
}
```

**调味效果：**
```text
输入：["apple"]
↓ 2-3gram切片
输出：["ap", "app", "pp", "ppl", "pl", "ple", "le"]
```

---

## **完整流水线实战演示**

### **配置一条智能加工线**
```json
PUT smart_kitchen
{
  "settings": {
    "analysis": {
      // 第一车间：清洗设备
      "char_filter": {
        "html_cleaner": {"type": "html_strip"},
        "phone_mask": {
          "type": "pattern_replace",
          "pattern": """(\d{3})\d{4}(\d{4})""",
          "replacement": "$1****$2"
        }
      },
      
      // 第二车间：切菜设备  
      "tokenizer": {
        "chinese_chef": {"type": "ik_smart"}
      },
      
      // 第三车间：调味设备
      "filter": {
        "stop_words": {"type": "stop", "stopwords": ["的", "了"]},
        "synonyms": {
          "type": "synonym", 
          "synonyms": ["手机 => 智能手机"]
        }
      },
      
      // 整条流水线组装
      "analyzer": {
        "my_pipeline": {
          "type": "custom",
          "char_filter": ["html_cleaner", "phone_mask"],  // 先清洗
          "tokenizer": "chinese_chef",                    // 再切菜
          "filter": ["lowercase", "stop_words", "synonyms"] // 后调味
        }
      }
    }
  }
}
```

### **测试流水线效果**
```json
GET smart_kitchen/_analyze
{
  "analyzer": "my_pipeline",
  "text": "<p>我的手机号是18868686688，我想买新手机</p>"
}

// 加工结果：
// 1. 清洗：去除<p>标签，手机号脱敏
// 2. 切菜：中文智能分词  
// 3. 调味：去停用词、同义词扩展
// 最终：["我", "手机号", "188****6688", "想", "买", "新", "手机", "智能手机"]
```

---

## **记忆口诀**

**文字厨房三车间：**
1. **清洗车间（Character Filter）**  
   `去杂质` `保隐私` `换敏感词`  
2. **切菜车间（Tokenizer）**  
   `分词语` `按规则` `建基础`  
3. **调味车间（Token Filter）**  
   `去停词` `扩同义` `提词干`  

**黄金配置法则：**
> 🧼 先清洗 → 处理HTML/敏感信息  
> 🔪 再切分 → 选择合适的分词器  
> 🧂 后调味 → 添加语言特色处理  

记住这条食材加工流水线，你就能烹制出最精准的搜索盛宴！ 👨🍳🎯
