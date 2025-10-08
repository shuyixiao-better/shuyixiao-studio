# ES中index_options参数故事版

> ## index_options
>
> index_options 控制索引时哪些信息被存储到倒排索引中（用在 text 字段中），有四种取值
>
> | index_options | 备注                                              |
> | ------------- | ------------------------------------------------- |
> | docs          | 只存储文档编号，默认即此                          |
> | freqs         | 在 docs 基础上，存储词项频率                      |
> | positions     | 在 freqs 基础上，存储词项偏移位置                 |
> | offsets       | 在 positions 基础上，存储词项开始和结束的字符位置 |
>



# **index_options：数字村的「图书管理员笔记术」📚✍️**

想象数字村的图书馆里有个超级管理员，他负责记录每本书的关键词位置。`index_options`就是他的**笔记精细度等级**，决定了记录关键词时要写多详细：

---

## **故事：管理员的四种笔记术**

### **1. 基础笔记术（docs）→ 只记书名**
```json
"title": {
  "type": "text",
  "index_options": "docs"   // 最简记录
}
```
**管理员行为：**
- 📖 看到《哈利波特》出现"魔法"一词
- 📒 **只记书名**：`魔法 → [哈利波特]`
- ❌ **不记次数和位置**

**搜索效果：**
```json
// 能知道哪些书包含"魔法"
GET library/_search
{
  "query": {"term": {"title": "魔法"}}  // ✅ 返回《哈利波特》
}
// ❌ 但不知道出现几次、在什么位置
```

---

### **2. 计数笔记术（freqs）→ 书名+次数**
```json
"title": {
  "type": "text",
  "index_options": "freqs"   // 增加计数
}
```
**管理员行为：**
- 📖 发现《哈利波特》出现5次"魔法"
- 📒 **记录**：`魔法 → [哈利波特]（出现5次）`

**搜索效果：**
```json
// 知道"魔法"在《哈利波特》中出现5次
// 可用于相关性排序（出现越多越靠前）
```

---

### **3. 定位笔记术（positions）→ 书名+次数+页码**
```json
"content": {
  "type": "text",
  "index_options": "positions"  // 增加位置
}
```
**管理员行为：**
- 📖 发现"魔法"出现在：
  - P10第3行、P45第8行、P120第5行
- 📒 **记录**：`魔法 → [哈利波特]（位置：10.3, 45.8, 120.5）`

**搜索效果：**
```json
// 支持短语搜索（要求词按顺序出现）
GET library/_search
{
  "query": {
    "match_phrase": {
      "content": "魔法世界"  // ✅ 要求"魔法"后紧跟"世界"
    }
  }
}
```

---

### **4. 精确定位术（offsets）→ 书名+次数+页码+行号**
```json
"content": {
  "type": "text",
  "index_options": "offsets"  // 增加字符偏移
}
```
**管理员行为：**
- 📖 发现"魔法"出现在：
  - P10第3行：第15-17字符
  - P45第8行：第22-24字符
- 📒 **记录**：`魔法 → [哈利波特]（位置：10.3:15-17, 45.8:22-24）`

**搜索效果：**
```json
// 支持高亮显示（精确到字符位置）
GET library/_search
{
  "query": {"match": {"content": "魔法"}},
  "highlight": {
    "fields": {"content": {}}
  }
}
/* 返回：
  "highlight": {
    "content": ["...<em>魔法</em>世界..."]
  } */
```

---

## **四阶笔记术对比表**

| 等级 | 记录内容 | 比喻 | 存储开销 | 应用场景 |
|------|----------|------|----------|----------|
| **docs** | 只存书名 | 书单目录 | ⚡ 最小 | 简单匹配 |
| **freqs** | 书名+次数 | 借阅统计表 | ⚡⚡ 中低 | 相关性排序 |
| **positions** | +词位置 | 目录+页码 | ⚡⚡⚡ 中高 | 短语搜索 |
| **offsets** | +字符位 | 行号标注 | ⚡⚡⚡⚡ 最大 | 高亮显示 |

---

## **管理员的工作建议**

### **场景1：商品标题搜索**
```json
"product_name": {
  "type": "text",
  "index_options": "freqs"   // 知道出现次数即可
}
```
- ✅ 适合：按关键词频率排序
- ❌ 无需：短语搜索或高亮

### **场景2：法律条文检索**
```json
"law_text": {
  "type": "text",
  "index_options": "offsets"  // 需精确高亮
}
```
- ✅ 必要：显示"宪法第**五条**"的高亮
- 💾 代价：存储开销增加30%~50%

### **场景3：日志关键字监控**
```json
"error_log": {
  "type": "text",
  "index_options": "docs"    // 只需知道是否出现
}
```
- ✅ 高效：快速检测"ERROR"是否出现
- 💾 节省：比offsets减少60%存储

---

## **避坑指南**

### **坑1：滥用offsets**
```json
// 错误配置（百GB数据用offsets）
"big_content": {
  "type": "text",
  "index_options": "offsets"   // ❌ 存储爆炸！
}
```
**后果：** 索引大小翻倍，写入速度减半

### **坑2：需要phrase却用docs**
```json
// 错误配置
"description": {
  "type": "text",
  "index_options": "docs"   // ❌ 无法短语搜索
}

// 用户搜索失败
GET products/_search
{
  "query": {
    "match_phrase": {
      "description": "无线充电"  // ❌ 无位置信息
    }
  }
}
```

---

## **黄金配置法则**

```json
PUT optimal_index
{
  "mappings": {
    "properties": {
      // 标题类短文本
      "title": {
        "type": "text",
        "index_options": "freqs"  // 平衡性能与功能
      },
      
      // 内容类长文本
      "body": {
        "type": "text",
        "index_options": "positions" // 支持短语搜索
      },
      
      // 需高亮字段
      "quote": {
        "type": "text",
        "index_options": "offsets"   // 精确高亮
      },
      
      // 标签类字段
      "tags": {
        "type": "text",
        "index_options": "docs"      // 只需匹配存在性
      }
    }
  }
}
```

---

## **记忆口诀**

**图书管理员四阶笔记术：**
1. **docs → 只记书名**  
   `知道有，不知在哪`  
2. **freqs → 书名+次数**  
   `知热度，排序用`  
3. **positions → 书名+次数+页码**  
   `找短语，必须用`  
4. **offsets → 书名+次数+页码+行号**  
   `精定位，高亮用`  

**选择原则：**  
> 📌 功能够用就好 → 避免过度存储  
> 📌 高亮必须offsets → 其他场景慎用  
> 📌 短语搜索要positions → docs/freqs不支持  

记住这个图书管理员的比喻，轻松掌握搜索优化的精髓！ 🎯🔍