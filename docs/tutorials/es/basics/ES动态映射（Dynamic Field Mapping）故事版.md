# ES动态映射（Dynamic Field Mapping）故事版

> ## 3.1 自动映射：Dynamic field mapping
>
> | **field type** | **dynamic**                        |
> | :------------: | ---------------------------------- |
> |   true/false   | boolean                            |
> |      小数      | float                              |
> |      数字      | long                               |
> |     object     | object                             |
> |      数组      | 取决于数组中的第一个非空元素的类型 |
> | 日期格式字符串 | date                               |
> | 数字类型字符串 | float/long                         |
> |   其他字符串   | text + keyword                     |
>
> 除了上述字段类型之外，其他类型都必须显示映射，也就是必须手工指定，因为其他类型ES无法自动识别。
好的，让我们用数字村的故事来讲解这个非常重要的概念——**动态映射（Dynamic Field Mapping）**！

---

## **故事：数字村的智能仓库管理员**

想象数字村有一个超级智能的仓库管理员，名叫**动叔**。他的工作是：每当有村民送来新的货物（文档）时，他需要**自动判断**这个货物应该放在哪个**专属货架（字段类型）**上。

动叔非常聪明，他有一套自己的"识货宝典"（动态映射规则）。但是，这个宝典有时候也会判断失误，所以我们需要了解他的判断逻辑！

### **动叔的"识货宝典"（动态映射规则）**

| **村民送来的货物** | **动叔的判断** | **放置的货架** | **故事比喻** |
|-------------------|----------------|----------------|-------------|
| `true` / `false` | "这明显是个开关嘛！" | **boolean**（布尔型） | **是非开关铺** - 只有开/关两种状态 |
| `3.14` / `2.71` | "带小数点的数字！" | **float**（浮点型） | **实用量具店** - 处理带精度的测量值 |
| `42` / `1000` | "这是个整数！" | **long**（长整型） | **整数杂货铺** - 存放普通整数 |
| `{"name": "张三"}` | "这是个包裹对象！" | **object**（对象型） | **万能杂物间** - 存放组合物品 |
| `[1, 2, 3]` | "看看数组里第一个是什么..." | **取决于第一个元素的类型** | **看第一个物品决定放哪个货架** |
| `"2023-10-01"` | "这看起来像日期！" | **date**（日期型） | **标准时间登记处** - 识别日期格式 |
| `"123"` / `"3.14"` | "数字组成的字符串！" | **float**/**long**（数字型） | **当成数字处理，去掉引号** |
| `"hello world"` | "普通文本内容！" | **text + keyword**（文本+关键字） | **全文检索大师 + 精确身份证登记处** |

---

### **详细剧情展开**

#### **1. 布尔值的自动识别**
```json
// 村民送来：
{"is_student": true, "has_car": false}

// 动叔判断：
"is_student" → boolean类型（是非开关铺）
"has_car" → boolean类型（是非开关铺）
```

#### **2. 数字的自动识别**
```json
// 村民送来：
{"price": 19.99, "quantity": 100}

// 动叔判断：
"price" → float类型（实用量具店）- 因为有小数点
"quantity" → long类型（整数杂货铺）- 因为是整数
```

#### **3. 对象的自动识别**
```json
// 村民送来：
{"user": {"name": "张三", "age": 25}}

// 动叔判断：
"user" → object类型（万能杂物间）
"user.name" → text + keyword（全文+精确）
"user.age" → long类型（整数杂货铺）
```

#### **4. 数组的"看第一个"规则**
```json
// 场景1：数字数组
{"scores": [95, 87, 92]}
// 动叔看第一个元素：95 → long类型

// 场景2：字符串数组  
{"tags": ["促销", "新品", "热卖"]}
// 动叔看第一个元素："促销" → text + keyword类型

// 场景3：空数组
{"empty_list": []}
// 动叔懵逼了：无法判断类型！可能报错或忽略
```

#### **5. 日期的智能识别**
```json
// 村民送来：
{"birthday": "1990-05-15", "create_time": "2023/10/01 14:30:00"}

// 动叔判断：
这两个都符合常见的日期格式 → date类型（标准时间登记处）
```

#### **6. 数字字符串的特殊处理**
```json
// 村民送来：
{"age_str": "25", "price_str": "19.99"}

// 动叔判断：
"age_str" → long类型（去掉引号当成数字25）
"price_str" → float类型（去掉引号当成数字19.99）
```

#### **7. 文本的"双重保障"**
```json
// 村民送来：
{"title": "Elasticsearch教程", "content": "这是一个详细的教学文档..."}

// 动叔判断：
为这两个字段同时创建两种映射：
- text类型：用于全文搜索（可以被分词："Elasticsearch教程" → "Elasticsearch" + "教程"）
- keyword类型：用于精确匹配（必须完全匹配"Elasticsearch教程"）
```

---

### **动叔的局限性：必须显式指定的特殊货架**

有些特殊的货物，动叔的宝典里没有记录，**必须由村民明确说明**应该放在哪个货架：

```json
// 这些类型动叔无法自动识别，必须显式映射：

// 1. 地理位置
{"location": "40.7128,-74.0060"}  // 动叔会误判为text，但其实是geo_point！

// 2. IP地址
{"ip": "192.168.1.1"}  // 动叔会误判为text，但应该是ip类型！

// 3. 半精度浮点数
{"temperature": 25.5}  // 动叔会判断为float，但可能是half_float！

// 4. 嵌套类型
{"comments": [{"user": "张三", "content": "好文！"}]}  // 动叔会判断为object，但可能是nested！

// 5. 完成建议
{"suggest": "Elasticsearch"}  // 动叔会判断为text，但可能是completion！
```

---

### **实战建议：什么时候相信动叔？什么时候亲自指定？**

#### **✅ 可以相信动叔的场景（使用动态映射）：**
- **开发测试阶段**：快速验证想法
- **数据结构简单**且符合常规模式
- **日志类数据**：字段多变，不需要严格约束

#### **❌ 必须亲自指定的场景（使用显式映射）：**
- **生产环境**：需要稳定可靠的映射
- **特殊数据类型**：geo_point、ip、nested等
- **性能优化**：需要精细控制分词器、索引选项等
- **业务关键字段**：如商品ID、用户ID等

#### **显式映射示例：**
```json
// 在创建索引时明确指定映射
PUT /my_index
{
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_point"  // 明确告诉动叔：这是地理坐标！
      },
      "ip_address": {
        "type": "ip"  // 明确告诉动叔：这是IP地址！
      },
      "product_id": {
        "type": "keyword"  // 明确告诉动叔：这个只要精确匹配！
      }
    }
  }
}
```

---

## **故事总结**

数字村的智能管理员**动叔**虽然很聪明，但他的"自动判断"有时会出错。了解他的判断规则（动态映射规则）非常重要：

1. **记住宝典**：了解各种数据类型会被自动映射成什么
2. **知道局限**：明白哪些类型必须显式指定
3. **适时干预**：在重要场合亲自指定映射，避免意外

这样，你就能在享受动态映射便利的同时，避免掉进映射错误的坑里！🎯

> #Dynamic mapping
> DELETE product_mapping
> GET product_mapping/_mapping
> PUT /product_mapping/_doc/1
> {
>   "name": "xiaomi phone",
>   "desc": "shouji zhong de zhandouji",
>   "count": 123456,
>   "price": 123.123,
>   "date": "2020-05-20",
>   "isdel": false,
>   "tags": [
>     "xingjiabi",
>     "fashao",
>     "buka"
>   ]
> }
>
> GET product_mapping/_search
> {
>   "query": {
>     "match": {
>       "name.keyword": "xiaomi phone"
>     }
>   }
> }

让我们详细分析这段 Elasticsearch 操作，理解动态映射的实际应用：

### 操作流程解析

1. **删除索引（清理环境）**
   ```bash
   DELETE product_mapping
   ```
   - 删除名为 `product_mapping` 的索引（如果存在）
   - 相当于数字村的"拆迁队"，清空场地准备重建

2. **查看映射（此时索引不存在）**
   ```bash
   GET product_mapping/_mapping
   ```
   - 尝试查看映射，但索引已被删除，会返回错误
   - 相当于查看"仓库设计图"，但仓库已被拆除

3. **创建文档（触发动态映射）**
   ```bash
   PUT /product_mapping/_doc/1
   {
     "name": "xiaomi phone",
     "desc": "shouji zhong de zhandouji",
     "count": 123456,
     "price": 123.123,
     "date": "2020-05-20",
     "isdel": false,
     "tags": ["xingjiabi", "fashao", "buka"]
   }
   ```
   - **动叔（动态映射）开始工作**：
     - `name`: 字符串 → `text` + `keyword` 类型
     - `desc`: 字符串 → `text` + `keyword` 类型
     - `count`: 整数 → `long` 类型
     - `price`: 小数 → `float` 类型
     - `date`: 日期格式字符串 → `date` 类型
     - `isdel`: 布尔值 → `boolean` 类型
     - `tags`: 字符串数组 → `text` + `keyword` 类型

4. **执行查询（验证动态映射结果）**
   ```bash
   GET product_mapping/_search
   {
     "query": {
       "match": {
         "name.keyword": "xiaomi phone"
       }
     }
   }
   ```
   - 使用 `name.keyword` 进行精确匹配查询
   - 验证动态映射是否创建了 `keyword` 子字段

### 动态映射的实际效果

执行上述操作后，Elasticsearch 会自动创建如下映射：

```json
{
  "product_mapping": {
    "mappings": {
      "properties": {
        "count": {"type": "long"},
        "date": {"type": "date"},
        "desc": {
          "type": "text",
          "fields": {"keyword": {"type": "keyword", "ignore_above": 256}}
        },
        "isdel": {"type": "boolean"},
        "name": {
          "type": "text",
          "fields": {"keyword": {"type": "keyword", "ignore_above": 256}}
        },
        "price": {"type": "float"},
        "tags": {
          "type": "text",
          "fields": {"keyword": {"type": "keyword", "ignore_above": 256}}
        }
      }
    }
  }
}
```

### 关键知识点解析

1. **为什么使用 `name.keyword`？**
   - 动态映射为字符串字段同时创建了：
     - `text` 类型：用于全文搜索（会被分词）
     - `keyword` 类型：用于精确匹配（不会被分词）
   - 查询 `"xiaomi phone"` 需要完全匹配，所以使用 `keyword` 类型

2. **`ignore_above: 256` 的含义**
   - 当字符串长度超过 256 字符时，`keyword` 字段将不被索引
   - 防止长文本占用过多存储空间
   - 可以通过显式映射修改这个值

3. **日期字段的智能识别**
   - `"2020-05-20"` 被正确识别为日期类型
   - Elasticsearch 支持多种日期格式的自动识别

### 动态映射的潜在问题

1. **数字字符串的误判**
   ```json
   PUT /product_mapping/_doc/2
   {
     "product_id": "10001"  // 会被识别为 long 类型！
   }
   ```
   - 解决方案：提前显式声明为 `keyword` 类型

2. **特殊类型无法自动识别**
   - 如果需要 `geo_point`、`ip` 等特殊类型，必须显式声明

3. **字段类型不一致**
   - 如果后续文档中同一字段出现不同类型数据：
     ```json
     // 第一个文档
     {"price": 199.9}      // → float
     
     // 第二个文档
     {"price": "199.9"}    // → text + keyword
     ```
   - 会导致映射冲突和索引失败

### 最佳实践建议

1. **生产环境使用显式映射**
   ```json
   PUT /product_mapping
   {
     "mappings": {
       "properties": {
         "product_id": {"type": "keyword"},
         "name": {
           "type": "text",
           "fields": {"raw": {"type": "keyword"}}
         },
         "price": {"type": "scaled_float", "scaling_factor": 100}
       }
     }
   }
   ```

2. **控制动态映射行为**
   ```json
   PUT /product_mapping
   {
     "mappings": {
       "dynamic": "strict",  // 禁止未定义的字段
       "properties": {...}
     }
   }
   ```

3. **重要字段显式声明**
   - 标识字段（ID、编码等）设为 `keyword`
   - 数值字段明确指定 `float`/`double`/`integer`
   - 日期字段指定格式 `"format": "yyyy-MM-dd"`

通过理解动态映射机制，你可以更好地利用 Elasticsearch 的灵活性，同时在生产环境中保持数据的一致性和可靠性！