# ES中ignore_above参数故事版

> ## ignore_above
>
> igbore_above 用于指定分词和索引的字符串最大长度，超过最大长度的话，该字段将不会被索引，这个字段只适用于 keyword 类型
>
> ```java
> PUT blog
> {
>   "mappings": {
>     "properties": {
>       "title":{
>         "type": "keyword",
>         "ignore_above": 10
>       }
>     }
>   }
> }
> 
> PUT blog/_doc/1
> {
>   "title":"javaboy"
> }
> 
> PUT blog/_doc/2
> {
>   "title":"javaboyjavaboyjavaboy"
> }
> 
> GET blog/_search
> {
>   "query": {
>     "term": {
>       "title": "javaboyjavaboyjavaboy"
>     }
>   }
> }
> ```
>



# **ignore_above：数字村的「名字长度限制令」📏🚫**

想象数字村的居民们都有一个**身份名牌（keyword字段）**，但村里规定：名牌超过一定长度就要被**打上特殊标记**，不再享受快速查询服务！

---

## **故事：身份名牌管理局**

### **1. 颁布长度限制令**
```json
PUT village_rules
{
  "mappings": {
    "properties": {
      "name_card": {             // 身份名牌
        "type": "keyword",       // 必须完整精确
        "ignore_above": 10       // 超过10字符的名牌不登记
      }
    }
  }
}
```

### **2. 村民申请名牌**
#### **村民1：正常名牌（7字符）**
```json
PUT villagers/_doc/1
{
  "name_card": "javaboy"   // ✅ 长度7 < 10
}
```
**管理局操作：**
- 登记到快速查询系统
- 名牌完整存储

#### **村民2：超长名牌（23字符）**
```json
PUT villagers/_doc/2
{
  "name_card": "javaboyjavaboyjavaboy"  // ❌ 长度23 > 10
}
```
**管理局操作：**
- 🚫 **不登记到查询系统**（无法通过名牌搜索）
- 📦 **仅存入档案库**（原始数据仍保存）

---

## **关键效果演示**

### **搜索正常名牌（成功）**
```json
GET villagers/_search
{
  "query": {
    "term": {
      "name_card": "javaboy"  // ✅ 精确匹配
    }
  }
}
```
**结果：** 找到村民1

### **搜索超长名牌（失败）**
```json
GET villagers/_search
{
  "query": {
    "term": {
      "name_card": "javaboyjavaboyjavaboy"  // ❌ 无法搜索
    }
  }
}
```
**结果：** 找不到村民2

### **但数据实际存在！**
```json
GET villagers/_doc/2
/* 返回：
{
  "name_card": "javaboyjavaboyjavaboy" 
} */
```
✅ 超长名牌仍在档案库中

---

## **为什么需要这个规则？**

### **1. 性能优化**
| 场景 | 无限制 | 限制后 |
|------|--------|--------|
| **索引大小** | 可能GB级 | 大幅减少 |
| **查询速度** | 可能变慢 | 保持高速 |
| **内存占用** | 可能溢出 | 安全可控 |

### **2. 业务场景**
```json
// 案例：电商标签系统
PUT products
{
  "mappings": {
    "properties": {
      "product_tag": {
        "type": "keyword",
        "ignore_above": 20   // 标签最长20字符
      }
    }
  }
}
```
- 有效标签："促销"、"新品"（短标签）
- 无效标签："限时买一赠一加抽奖活动特别版"（被忽略）

---

## **三大核心特点**

1. **精准长度控制**
   ```json
   "ignore_above": 10  // 按字符数计算
   ```
   - 中文："一二三四五六七八九十" → 10字符（可索引）
   - 中文："一二三四五六七八九十十一" → 11字符（忽略）

2. **仅限keyword类型**
   ```json
   // 对text类型无效！
   "description": {
     "type": "text",         // 文本字段
     "ignore_above": 100     // ❌ 设置无效
   }
   ```

3. **非截断是忽略**
   ```json
   // 不是把"javaboyjavaboy"截成"javaboyja"
   // 而是完全不索引！
   ```

---

## **实战配置建议**

### **推荐值参考表**
| 场景 | 建议值 | 原因 |
|------|--------|------|
| **用户名** | 64 | 兼容长邮箱(32)+姓名(32) |
| **商品标签** | 32 | 避免过长营销文案 |
| **错误码** | 16 | 通常很短 |
| **文件路径** | 256 | 兼容长路径 |
| **日志消息** | 0 (不设置) | 需完整存储 |

### **特殊场景：禁用限制**
```json
"critical_log": {
  "type": "keyword",
  "ignore_above": 0   // 0=无限制
}
```

---

## **避坑指南**

### **坑1：误用于text字段**
```json
// 错误配置（不生效）
"description": {
  "type": "text",
  "ignore_above": 100   // ❌ 对text无效
}

// 正确做法
"description_key": {
  "type": "keyword",     // ✅ 必须keyword类型
  "ignore_above": 100
}
```

### **坑2：与业务需求冲突**
```json
// 问题：身份证号固定18位
"id_card": {
  "type": "keyword",
  "ignore_above": 15   // ❌ 会忽略所有身份证
}

// 解决方案
"id_card": {
  "type": "keyword",
  "ignore_above": 18   // ✅ 按实际长度设置
}
```

### **坑3：忘记超长数据不可搜**
```json
// 插入数据
PUT system/_doc/1
{
  "license_key": "ABCDE-12345-FGHIJ-67890"  // 20字符
}

// 搜索失败（如果ignore_above=10）
GET system/_search
{
  "query": {"term": {"license_key": "ABCDE-12345-FGHIJ-67890"}}
}

// 解决方案：确保关键字段不设限制
```

---

## **记忆口诀**

**ignore_above三要点：**
1. **keyword专属** → 只管身份名牌  
2. **超长不索引** → 不登记到查询系统  
3. **数据仍保存** → 档案库里有备份  

**设置口诀：**  
> 📏 **短字段设小值**（标签/分类）  
> 📏 **长字段设大值**（路径/序列号）  
> 📏 **关键字段不设限**（身份证/许可证）  

记住这个「名牌管理局」的比喻，轻松掌握长度限制的精髓！🎯