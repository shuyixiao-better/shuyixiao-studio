# ES中Coerce参数故事版

> ## coerce
>
> 是否允许强制类型转换  true “1”=> 1  false “1”=< 1
>
> ```java
> #coerce：是否允许强制类型转换
> PUT coerce
> {
>   "mappings": {
>     "properties": {
>       "number_one": {
>         "type": "integer"
>       },
>       "number_two": {
>         "type": "integer",
>         "coerce": false
>       }
>     }
>   }
> }
> PUT coerce/_doc/1
> {
>   "number_one": "10" 
> }
> #//拒绝，因为设置了false
> PUT coerce/_doc/2
> {
>   "number_two": "10" 
> }  
> ```
>



# **Coerce 参数：数字村的"门卫规则" 🚧**

想象数字村有两个仓库，它们存放物品的规则完全不同，这取决于仓库的"门卫"有多严格！

## **故事：数字村的仓库管理**

### **仓库1：灵活门卫（coerce: true）**
```json
"number_one": {
  "type": "integer",
  "coerce": true   // 默认值，可以省略
}
```
**门卫特点：**
- 看到村民拿着**写着数字的纸条**（字符串"10"）
- 会主动帮村民**把纸条换成真正的数字**（转换成整数10）
- 然后才允许存入仓库

**操作演示：**
```json
PUT coerce/_doc/1
{
  "number_one": "10"   // 字符串形式的数字
}
```
✅ **结果：成功存储！**
- 门卫把"10" → 10
- 仓库里存的是整数10

### **仓库2：严格门卫（coerce: false）**
```json
"number_two": {
  "type": "integer",
  "coerce": false   // 明确要求严格检查
}
```
**门卫特点：**
- 看到村民拿着**写着数字的纸条**（字符串"10"）
- 立即拒绝："仓库只收**真正的数字**！"
- 坚持原则：纸条不是数字！

**操作演示：**
```json
PUT coerce/_doc/2
{
  "number_two": "10"   // 字符串形式的数字
}
```
❌ **结果：存储失败！**
- 门卫直接拒绝："这不是整数！"
- 错误信息：`"reason": "integer value passed as string"`

---

## **为什么需要这个规则？**

### **场景1：数据清洗（需要coerce: true）**
```json
// 从CSV导入的数据
"age": "25",   // 字符串格式的数字
"price": "99.9" // 字符串格式的浮点数
```
✅ **灵活门卫处理：**
- 自动转换为数字类型
- 保证数据能正常存储

### **场景2：严格数据验证（需要coerce: false）**
```json
// 银行账户系统
"account_balance": {
  "type": "long",
  "coerce": false   // 必须确保是真实数字
}
```
❌ **拒绝以下输入：**
- `"1000"` → 字符串
- `"1,000"` → 含逗号
- `"1000元"` → 含单位

✅ **只接受：**
- `1000` → 纯数字

---

## **深入理解：coerce 的工作原理**

### **数据转换示例表**
| 输入值 | coerce: true 结果 | coerce: false 结果 |
|--------|-------------------|---------------------|
| `"10"` | → 10 (整数) | ❌ 拒绝 |
| `10` | → 10 (整数) | → 10 (整数) |
| `"10.5"` | → 10.5 (浮点数) | ❌ 拒绝 |
| `"abc"` | ❌ 转换失败 | ❌ 拒绝 |
| `"100,000"` | ❌ 转换失败 | ❌ 拒绝 |

### **特殊注意事项**
1. **浮点数转换**：
   ```json
   "price": {
     "type": "float",
     "coerce": true   // 允许 "99.9" → 99.9
   }
   ```

2. **布尔值转换**：
   ```json
   "is_active": {
     "type": "boolean",
     "coerce": true   // 允许 "true" → true
   }
   ```

3. **日期转换**：
   ```json
   "birthday": {
     "type": "date",
     "coerce": true   // 允许 "2020-01-01" → 日期对象
   }
   ```

---

## **实际应用建议**

### **推荐设置（根据场景）**
| 场景 | coerce设置 | 原因 |
|------|------------|------|
| **用户输入数据** | true | 自动清理格式问题 |
| **API接口数据** | true | 兼容不同客户端 |
| **金融交易系统** | false | 确保数据绝对准确 |
| **科学实验数据** | false | 防止数据污染 |
| **日志分析系统** | true | 兼容各种日志格式 |

### **生产环境配置示例**
```json
PUT production_data
{
  "mappings": {
    "properties": {
      // 用户数据（宽松）
      "user_age": {
        "type": "integer",
        "coerce": true
      },
      
      // 交易数据（严格）
      "transaction_amount": {
        "type": "scaled_float",
        "scaling_factor": 100,
        "coerce": false   // 必须确保是数字
      },
      
      // 产品标签（严格）
      "product_tags": {
        "type": "keyword",
        "coerce": false   // 禁止自动转换
      }
    }
  }
}
```

## **记忆口诀**

**Coerce就像门卫：**
- **True：灵活门卫** → 帮你转换格式（字符串变数字）
- **False：严格门卫** → 必须原样符合要求
- **默认是True** → 多数场景够用
- **关键数据用False** → 确保绝对准确

记住这个门卫的比喻，你就掌握了数据入库的"安检规则"！🔐