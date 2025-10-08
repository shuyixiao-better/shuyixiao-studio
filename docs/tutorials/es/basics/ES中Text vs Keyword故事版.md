# ES中Text vs Keyword故事版

> 刚开始学习 Elasticsearch 的人经常会混淆Text 和Keyword数据类型。 它们之间的区别很简单，但非常关键。
>
> 原理性的区别：
>
> 对于 `Text`类型，将文本存储到倒排索引之前，会使用分析器对其进行分析，而 `Keyword`类型则不会分析。
>
> ## Text 类型
>
> ### 概述
>
> 当一个字段是要被全文搜索的，比如 Email 内容、产品描述，这些字段应该使用 text 类型。设置  text 类型以后，字段内容会被分析，在生成倒排索引以前，字符串会被分析器分成一个一个词项。text类型的字段不用于排序，很少用于聚合。
>
> ### 注意事项
>
> - 适用于全文检索：如 match 查询
> - 文本字段会被分词
> - 默认情况下，会创建倒排索引
> - 自动映射器会为 Text 类型创建 Keyword 字段好的，我们用一个非常生活化的比喻来解释 Text 和 Keyword 这两种核心数据类型，保证你一次就懂，永远不忘！

## **图书馆的两种查找方式：Text vs Keyword**

想象一下，你面前有一个巨大的图书馆（Elasticsearch索引），里面有成千上万本书（文档）。每本书都有**书名**（title字段）。

现在你要找书，有两种完全不同的查找方式：

### **1. Text 类型：像"智能语义搜索" 🔍**

**比喻：问图书管理员问题**
- "我想找关于**人工智能**和**机器学习**的书籍"

**管理员（Text类型）会这样做：**
1. **拆解分析**：把你的问题拆成关键词：`"人工"`、`"智能"`、`"机器"`、`"学习"`
2. **模糊匹配**：找到包含**任何一个关键词**的书籍
3. **相关性排序**：包含关键词越多的书排越前面

**特点：**
- ✅ **支持模糊搜索**：搜"AI"也能找到"人工智能"相关的书
- ✅ **理解语义**：搜"电脑技术"可能找到"计算机科学"的书  
- ❌ **无法精确匹配**：搜"人工"也会找到"工人"相关的书
- ❌ **不能用于排序**：无法按书名字母顺序排列

### **2. Keyword 类型：像"精确ISBN号查找" 📚**

**比喻：直接报出书籍的唯一编号**
- "我要ISBN号为 **978-7-121-33456-1** 的这本书"

**管理员（Keyword类型）会这样做：**
1. **完全匹配**：只找编号**完全一致**的书
2. **非黑即白**：要么找到，要么找不到，没有"差不多"
3. **精确排序**：可以按ISBN号顺序排列所有书籍

**特点：**
- ✅ **精确匹配**：必须完全一致才能找到
- ✅ **支持排序**：可以按字母顺序、数字顺序排列
- ✅ **高效筛选**：适合做分类、标签筛选
- ❌ **不支持模糊搜索**：搜"人工"绝对找不到"人工智能"

---

## **图片中的映射解析：为什么要有两种？**

你上传的图片正好展示了这个经典设计：

```json
"title": {
  "type": "text",           // 🔍 智能语义搜索版本
  "fields": {
    "keyword": {           // 📚 精确匹配版本  
      "type": "keyword",
      "ignore_above": 256
    }
  }
}
```

**这就相当于给同一本书配了两个检索系统：**

### **场景1：用户想找相关书籍（用text类型）**
```json
// 用户搜索："苹果手机"
GET books/_search
{
  "query": {
    "match": {
      "title": "苹果手机"  // 使用text版本
    }
  }
}
// 可能找到：《iPhone使用指南》、《苹果产品大全》等
```

### **场景2：管理员要精确统计（用keyword类型）**
```json
// 管理员要统计书名完全相同的书籍
GET books/_search
{
  "query": {
    "term": {
      "title.keyword": "苹果手机完全指南"  // 使用keyword版本
    }
  }
}
// 只会找到书名完全匹配的书籍
```

---

## **生活中的实际例子**

### **Text类型的使用场景（需要智能搜索）**
| 场景 | 搜索内容 | 匹配结果 |
|------|----------|----------|
| **文章内容搜索** | "气候变化的影响" | 包含"气候"、"变化"、"影响"等词的文章 |
| **商品描述搜索** | "轻薄便携笔记本电脑" | 描述中有"轻薄"、"便携"、"笔记本"的商品 |
| **邮件正文搜索** | "项目进度汇报" | 包含这些关键词的邮件 |

### **Keyword类型的使用场景（需要精确匹配）**
| 场景 | 搜索内容 | 匹配结果 |
|------|----------|----------|
| **用户名验证** | "张三" | 只找用户名为"张三"的用户 |
| **订单状态筛选** | "已发货" | 只找状态为"已发货"的订单 |
| **商品分类** | "电子产品" | 只找分类为"电子产品"的商品 |
| **身份证号查询** | "110101199001011234" | 精确匹配身份证号 |

---

## **记忆技巧：一张图分清Text vs Keyword**

| 特征 | Text类型（智能搜索） | Keyword类型（精确匹配） |
|------|---------------------|------------------------|
| **好比** | 智能语音助手 | 条形码扫描器 |
| **搜索方式** | "帮我找关于健康的书" | "ISBN: 9781234567890" |
| **是否分词** | ✅ 会拆分成词语 | ❌ 保持完整 |
| **匹配方式** | 模糊匹配、相关性排序 | 完全一致匹配 |
| **适合场景** | 文章内容、商品描述 | ID、状态码、分类标签 |
| **排序聚合** | 不适合 | 非常适合 |

---

## **实战建议**

1. **大部分文本字段**：都应该像图片中那样，**同时配置text和keyword**
   - `text`用于搜索
   - `keyword`用于排序、聚合、精确匹配

2. **明确知道用途的字段**：
   - 永远只需要精确匹配的（如ID、状态码）→ 只用`keyword`
   - 永远只需要全文搜索的（如文章正文）→ 只用`text`

3. **ignore_above: 256的含义**：
   - 如果书名超过256个字符，keyword版本就不存储了
   - 防止过长的文本占用太多空间

记住这个图书馆的比喻，你就再也不会混淆Text和Keyword了！🎯





> ## 4.2 Keyword 类型
>
> ### 4.2.1 概述
>
> Keyword 类型适用于不分词的字段，如姓名、Id、数字等。如果数字类型不用于范围查找，用 Keyword 的性能要高于数值类型。
>
> ### 4.2.2 语法和语义
>
> 如当使用 keyword 类型查询时，其字段值会被作为一个整体，并保留字段值的原始属性。
>
> ```
> GET test_index/_search
> {
>   "query": {
>     "match": {
>       "title.keyword": "测试文本值"
>     }
>   }
> }
> ```
>
> ### 4.2.3 注意事项
>
> - Keyword 不会对文本分词，会保留字段的原有属性，包括大小写等。
> - Keyword 仅仅是字段类型，而不会对搜索词产生任何影响
> - Keyword 一般用于需要精确查找的字段，或者聚合排序字段
> - Keyword 通常和 Term 搜索一起用（会在 DSL 中提到）
> - Keyword 字段的 ignore_above 参数代表其截断长度，默认 256，如果超出长度，字段值会被忽略，而不是截断。
>
> ### 演示DSL
>
> ```java
> ### Text 和 Keyword 类型
> delete /text-vs-keyword
> 
> #新建索引
> PUT /text-vs-keyword
> #设置索引mapping
> PUT /text-vs-keyword/_mapping
> {
>     "properties": {
>         "keyword_field": {
>             "type": "keyword"
>         },
>         "text_field": {
>             "type": "text"
>         },
>         "text_and_keyword_mapping": {
>             "type": "text",
>             "fields": {
>                 "keyword_type": {
>                     "type": "keyword"
>                 }
>             }
>         }
>     }
> }
> 
> POST /text-vs-keyword/_doc/example
> {
>     "keyword_field": "The quick brown fox jumps over the lazy dog",
>     "text_field": "The quick brown fox jumps over the lazy dog"
> }
> 
> 
> 
> ### 使用Term Query查询keyword字段
> # 　term　只有当文本完全匹配才会返回结果
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "term": {
>       "keyword_field": {
>         "value": "The quick brown fox jumps over the lazy dog"
>       }
>     }
>   }
> }
> #  Term Query在查询时不会对输入的关键词进行分析。
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "term": {
>       "keyword_field": {
>         "value": "The"
>       }
>     }
>   }
> }
> 
> 
> 
> ### 使用Match Query查询keyword字段
> #　Match Query在查询时会对输入的关键词进行分析
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "match": {
>       "keyword_field": "The quick brown fox jumps over the lazy dog"
>     }
>   }
> }
> 
> ### 使用Term Query查询text字段
> # 倒排索引中，索引过程只存储分析后的分词
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "term": {
>       "text_field": {
>         "value": "The quick brown fox jumps over the lazy dog"
>       }
>     }
>   }
> }
> #　标准分析器中的小写字母过滤器会将分词转化为小写
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "term": {
>       "text_field": {
>         "value": "The"
>       }
>     }
>   }
> }
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "term": {
>       "text_field": {
>         "value": "the"
>       }
>     }
>   }
> }
> 
> ### 使用Match Query查询text字段
> 
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "match": {
>       "text_field": "The"
>     }
>   }
> }
> 
> GET /text-vs-keyword/_search
> {
>   "query": {
>     "match": {
>       "text_field": "the LAZ dog tripped over th QUICK brown dog"
>     }
>   }
> }
> ```
>好的，我们继续用图书馆的比喻来深入理解 Keyword 类型，并结合你提供的演示 DSL 进行详细解析！

## **Keyword 类型：图书馆的"精确查找系统"**

### **4.2.1 Keyword 类型概述**

想象一下图书馆的**图书编号系统**：
- 每本书有唯一的**索书号**（如 `TP311.13/123`）
- 这个编号是**完整不可分割**的
- 管理员通过编号能**精确找到**特定书籍
- 编号还可以**按顺序排列**书籍

**这就是 Keyword 类型的特点：**
- ✅ **保持完整**：文本不会被拆分
- ✅ **精确匹配**：必须完全一致才能找到
- ✅ **支持排序**：可以按字母顺序排列
- ✅ **高效聚合**：适合分类统计

### **4.2.2 语法和语义解析**

从你提供的图片和 DSL 来看，Keyword 的使用非常直观：

```json
// 搜索时必须完全匹配整个字符串
GET test_index/_search
{
  "query": {
    "term": {
      "title.keyword": "测试文本值"  // 必须一模一样！
    }
  }
}
```

**比喻理解：**
- 就像在图书馆说："我要** exact 书名**为《测试文本值》的书"
- 管理员只会找**书名完全一致**的书
- 说错一个字都找不到！

---

## **演示 DSL 深度解析**

让我们用生活化的例子来理解这些复杂的查询：

### **1. 基础设置：创建测试环境**
```json
PUT /text-vs-keyword
{
  "mappings": {
    "properties": {
      "keyword_field": {"type": "keyword"},  // 纯Keyword字段
      "text_field": {"type": "text"},         // 纯Text字段  
      "text_and_keyword_mapping": {           // 双重字段（重要！）
        "type": "text",                       // 智能搜索版
        "fields": {
          "keyword_type": {"type": "keyword"} // 精确匹配版
        }
      }
    }
  }
}
```

**插入测试数据：**
```json
POST /text-vs-keyword/_doc/example
{
  "keyword_field": "The quick brown fox jumps over the lazy dog",
  "text_field": "The quick brown fox jumps over the lazy dog"
}
```

### **2. Keyword 字段的查询演示**

#### **场景1：精确查找（成功）**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "term": {
      "keyword_field": {
        "value": "The quick brown fox jumps over the lazy dog"
      }
    }
  }
}
```
**结果：✅ 找到文档**
- **比喻**：你说出**完整正确的书名**，管理员找到了书

#### **场景2：精确查找（失败）**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "term": {
      "keyword_field": {
        "value": "The"  // 只输入部分内容
      }
    }
  }
}
```
**结果：❌ 找不到文档**
- **比喻**：你只说书名的**第一个字**，管理员无法确定你要哪本书

#### **场景3：Match查询Keyword字段**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "match": {
      "keyword_field": "The quick brown fox jumps over the lazy dog"
    }
  }
}
```
**结果分析**：
- Match查询会对搜索词进行分词
- 但Keyword字段存储的是完整字符串
- 这相当于用多个单词去匹配一个完整字符串，通常找不到

### **3. Text 字段的查询演示**

#### **场景1：精确查找Text字段（失败）**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "term": {
      "text_field": {
        "value": "The quick brown fox jumps over the lazy dog"
      }
    }
  }
}
```
**结果：❌ 找不到文档**
- **原因**：Text字段被分词成：`["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]`
- Term查询要求精确匹配单个词条，但提供的是一整句话

#### **场景2：搜索单个单词（注意大小写）**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "term": {
      "text_field": {
        "value": "The"  // 大写T
      }
    }
  }
}
```
**结果：❌ 找不到**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "term": {
      "text_field": {
        "value": "the"  // 小写t
      }
    }
  }
}
```
**结果：✅ 找到文档**
- **原因**：标准分析器会将文本转为小写，所以索引中是`"the"`而不是`"The"`

#### **场景3：Match查询Text字段（成功）**
```json
GET /text-vs-keyword/_search
{
  "query": {
    "match": {
      "text_field": "The"  // 即使输入大写，也能找到
    }
  }
}
```
**结果：✅ 找到文档**
- **原因**：Match查询会对搜索词进行同样的分析处理（转为小写）

---

## **关键知识点总结**

### **1. Term Query vs Match Query**

| 查询类型 | 处理方式 | 适合字段 | 比喻 |
|---------|----------|----------|------|
| **Term Query** | 不分析搜索词，精确匹配 | Keyword字段 | 报出完整ISBN号找书 |
| **Match Query** | 先分析搜索词，再匹配 | Text字段 | 描述书籍内容找相关书 |

### **2. ignore_above 参数的重要性**

从图片中可以看到：
```json
"keyword": {
  "type": "keyword",
  "ignore_above": 256  // 关键参数！
}
```

**这个参数的意义：**
- 如果字段值超过256个字符，Elasticsearch**不会索引**这个值
- 这是为了**防止过长的文本占用过多存储空间**
- 比如存储文章内容时，用Keyword类型就不合适（会超过256字符）

### **3. 双重字段设计的智慧**

你图片中的设计是最佳实践：
```json
"title": {
  "type": "text",        // 用于智能搜索
  "fields": {
    "keyword": {         // 用于精确匹配
      "type": "keyword",
      "ignore_above": 256
    }
  }
}
```

**这样设计的好处：**
- **搜索时**：用 `title` 进行智能搜索
- **排序时**：用 `title.keyword` 进行精确排序
- **聚合时**：用 `title.keyword` 进行分组统计

### **4. 生产环境使用建议**

```json
// 好的映射设计示例
PUT /products
{
  "mappings": {
    "properties": {
      "product_id": {
        "type": "keyword"  // ID永远用keyword
      },
      "product_name": {
        "type": "text",    // 名称需要搜索
        "fields": {
          "raw": {
            "type": "keyword"  // 同时支持精确匹配
          }
        }
      },
      "category": {
        "type": "keyword"  // 分类适合用keyword
      },
      "description": {
        "type": "text"     // 描述只需要搜索，不需要精确匹配
      }
    }
  }
}
```

## **记忆口诀**

**Text 和 Keyword，用途要分清：**
- **Text 像百度**：智能搜索，理解语义
- **Keyword 像字典**：精确匹配，一字不差
- **双重字段最聪明**：搜索用Text，排序用Keyword
- **Term对Keyword**：精确查找
- **Match对Text**：智能搜索

记住这些原则，你就能在实际项目中游刃有余地使用 Elasticsearch 的文本搜索功能了！🎯