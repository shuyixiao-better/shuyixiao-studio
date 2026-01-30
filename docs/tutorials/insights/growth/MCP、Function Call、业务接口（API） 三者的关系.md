---
layout: doc
title: MCP、Function Call、业务接口（API） 三者的关系
description: >-
  本文深入解析业务接口、Function Call 和 MCP 三者的核心概念与关系。
  通过生活化例子和结构图，清晰阐述 AI 如何通过 Function Call 调用业务接口，
  以及 MCP 如何作为统一协议标准化工具接入。
date: '2026-01-30'
tags:
  - AI
  - MCP
  - API
  - Claude
  - Function Call
author: 舒一笑不秃头
---

# 1️⃣ 先从"业务接口"说起（最基础）

### 什么是业务接口？

你可以理解为：

> 业务服务对外提供的"能力入口"

比如一个电商系统会提供：

- 查询商品接口：`GET /product/123`
- 下单接口：`POST /order`
- 支付接口：`POST /pay`

这些就是典型的 **业务 API 接口**。

📌 本质：

> 接口就是系统能力的"按钮"，别人按一下，就能触发业务逻辑。

------

# 2️⃣ Function Call 是什么？

### Function Call 是 AI 调用接口的方式

以前 ChatGPT 只能"回答文字"，不能真正做事情。

后来有了 Function Call：

> AI 可以根据用户意图，自动调用某个函数或接口。

比如你问：

> "帮我查一下订单状态"

模型会生成：

```json
{
  "name": "getOrderStatus",
  "arguments": {
    "orderId": "123"
  }
}
```

然后系统去执行：

```python
getOrderStatus(orderId=123)
```

或者调用：

```http
GET /order/status?id=123
```

📌 Function Call 的核心：

> AI 不直接写死回答，而是"选择调用工具/接口"。

------

# 3️⃣ MCP 是什么？

### MCP（Model Context Protocol）是更大一层的标准协议

Function Call 只是 AI 调用一个函数。

而 MCP 是：

> AI 如何连接外部世界各种工具、服务、接口的"统一插口标准"。

你可以把 MCP 想象成：

> AI 的 USB 接口标准

不同工具都可以通过 MCP 插入：

- 数据库
- GitHub
- 内部业务系统
- CRM
- 搜索服务

MCP Server 会暴露工具：

```json
{
  "tools": [
    {
      "name": "queryCustomer",
      "description": "查询客户信息"
    }
  ]
}
```

AI 通过 MCP 自动发现、调用。

📌 MCP 的核心：

> 让 AI 能标准化接入各种服务，而不是每次单独开发。

------

# 4️⃣ 三者关系总结（最重要）

我们用一句话串起来：

> 业务接口是能力
> Function Call 是调用方式
> MCP 是调用生态标准

------

# 5️⃣ 用一个生活例子帮助理解

假设你要点外卖：

------

## 业务接口（API）

餐厅提供菜单：

- 宫保鸡丁
- 鱼香肉丝

这就是业务接口。

------

## Function Call

你对 AI 说：

> "帮我点一份鱼香肉丝"

AI 自动执行：

```json
{
  "name": "orderFood",
  "arguments": {
    "dish": "鱼香肉丝"
  }
}
```

这就是 Function Call。

------

## MCP

现在不是一家餐厅，而是：

- 美团
- 饿了么
- 京东到家

MCP 就是：

> 统一的点餐平台标准接口

AI 不用每次适配不同平台。

------

# 6️⃣ 最终结构图（清晰版）

```text
用户需求
   ↓
大模型理解意图
   ↓
Function Call（决定调用什么）
   ↓
MCP（标准化工具入口）
   ↓
业务接口 API（真正执行）
   ↓
返回结果
```

------

# 7️⃣ 一句话总结

| 概念          | 小白理解                | 作用               |
| ------------- | ----------------------- | ------------------ |
| 业务接口 API  | 系统能力按钮            | 提供业务能力       |
| Function Call | AI 按按钮的动作         | AI 能调用接口      |
| MCP           | AI 插各种按钮的标准插座 | 统一管理工具和服务 |
