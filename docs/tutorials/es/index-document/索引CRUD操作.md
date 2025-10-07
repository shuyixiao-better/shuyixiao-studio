# 索引CRUD操作

# **索引文档**

**将 JSON 文档添加到指定的数据流或索引并使其可被检索。如果目标是索引并且文档已经存在，则请求更新文档并增加其版本号。**

**基本语法** ★

```
PUT /<target>/_doc/<_id>

PUT /<target>/_create/<_id>

POST /<target>/_create/<_id>
```

**案例**

**索引一条 _id 为 1 的文档，并为其添加 test_field 和 test_title 两个字段**

```
PUT test_index/_doc/1?op_type=index
{
  "name":"赵四",
  "age":18
}
```

# 查询文档

### 基本语法

```
GET <index>/_doc/<_id>
```

### 案例

```
GET product/_doc/1
```

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251007210500788.png)

### _source API

**使用 _source API 可以打开或者关闭源数据字段，true 为打开，false 为关闭，默认为 true。**

```
GET <index>/_doc/<_id>?_source=false
```

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251007210545471.png)

**当然也可以只查看 _source 字段，而不查看任何 mata data。**

```
GET <index>/_source/<_id>
```

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251007210612075.png)

# 删除文档

**删除索引中指定 id 的文档**

```
DELETE /<index>/_doc/<_id>
```

**比如：**

```
DELETE product/_doc/1
```

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251007210645516.png)

# 更新文档

```
POST /<index>/_update/<_id>
{
  "doc": {
    "<field_name>": "<field_value>"
  }
}
```

**注意** **：7.x 及之前版本的语法** `<span class="ne-text">POST test/_doc/1/_update</span>`已不再支持

> 提示其实是在说 Elasticsearch 的语法规则在新版本里发生了变化，就像你平时用的手机软件更新后操作界面变了一样。

**用个简单的比喻来解释：**

想象一下你以前寄信（更新数据）的方式：

1. **旧方法 (7.x 及之前版本)：** 就像你写一封很详细的信，告诉邮局（Elasticsearch）： **动作：** `POST`(我要投递一封信) **收件人地址：** `test/_doc/1`(信要送到哪个“邮箱”：索引叫 `test`，里面的文档类型是 `_doc`，文档 ID 是 `1`) **信件类型：** `/_update`(这不是一封新信，是一封修改信，告诉邮局修改之前那封信的内容) **信的内容：** 写在信封里（请求体里），告诉邮局具体怎么修改。 所以整个“信封地址”看起来像：`POST test/_doc/1/_update`
2. **新方法 (8.x 及之后版本)：** 邮局升级了系统，简化了规则。现在寄修改信只需要： **动作：** `POST`(我要投递一封信) **收件人地址：** `test/_update/1`(信要送到哪个“邮箱”：索引叫 `test`，**明确这是一封修改信 (`_update`)**，要修改的文档 ID 是 `1`) **信的内容：** 写在信封里（请求体里），告诉邮局具体怎么修改。 所以整个“信封地址”现在变成了：`POST test/_update/1`

**关键变化在哪里？**

- **文档类型 (`_doc`) 被移除了：** 新版本里，`_doc`这个类型概念基本不用了（就像邮局不再区分“平信”和“挂号信”的投递口了，统一一个口）。
- **动作 (`_update`) 的位置变了：** `_update`这个操作标识**提前了**，直接放在了索引名 (`test`) 后面和文档 ID (`1`) 前面。这更清晰地表明：“我要对索引 `test`里的文档 `1`执行一个更新操作”。

**提示里 `<span class="ne-text">POST test/_doc/1/_update</span>`是什么意思？**

- 这只是一个**代码示例**，展示的是 **旧的、不再被支持的语法**。
- `<span class="ne-text">...</span>`是网页显示代码的格式（就像代码高亮），实际代码就是 `POST test/_doc/1/_update`。
- 提示的意思是：**在新版 Elasticsearch (8.x 及以上) 里，你再使用 `POST test/_doc/1/_update`这种写法，系统就不认识了，会报错！**

**总结一下：**

- **旧语法 (7.x)：** `POST /<索引名>/<类型>/<文档ID>/_update`(例如 `POST test/_doc/1/_update`)
- **新语法 (8.x+)：** `POST /<索引名>/_update/<文档ID>`(例如 `POST test/_update/1`)

**所以，如果你在用新版本的 Elasticsearch，想更新一个文档，应该这样写：**

```
POST your_index_name/_update/your_document_id
{
  "doc": {
    "field1": "new value1",
    "field2": "new value2"
  }
}
```

记住：**找邮局 (`your_index_name`) -> 说我要修改 (`_update`) -> 改哪封信 (`your_document_id`)**。这就是新版本的写法。