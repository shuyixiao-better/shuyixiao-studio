---
layout: doc
title: MCP Inspector（v0.19.0）能力标签页解读
description: >-
  详细解读 MCP Inspector v0.19.0 的十大能力标签页，包括 Resources、Prompts、
  Tools、Tasks 等核心功能的概念解析与对比。提供快速记忆法，帮助开发者
  快速理解 MCP 协议的各项能力。
date: '2026-01-30'
tags:
  - AI
  - MCP
  - Claude
  - 开发工具
author: 舒一笑不秃头
---

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20260130174210858.png)

## 启动命令

npx @modelcontextprotocol/inspector

## 1) Resources（资源）

**它是什么：**
"服务器暴露出来的一批可读取/可订阅的内容"，有点像 **只读或弱交互的'数据源'**（文件、文档、数据库视图、网页内容、知识库条目等），用 `uri` 标识。

**你在这里通常做什么：**

- `List Resources`：列出服务器当前可用的资源清单
- `Read`（通常会在资源条目里出现）：读取某个资源内容
- `Subscribe/Unsubscribe`（如果支持）：订阅资源更新（资源变更推送）

**和 Tools 最大区别：**

- Resources 侧重 **"给我内容/数据"**（数据访问）
- Tools 侧重 **"帮我执行动作/计算"**（能力调用）

------

## 2) Prompts（提示词模板）

**它是什么：**
服务器提供的 **Prompt 模板/提示词组件**，用于帮客户端（或上层应用）构造对话提示词。

**你在这里通常做什么：**

- 列出 prompts
- 选一个 prompt，填参数（variables），生成最终 prompt 文本/结构

**和 Resources 的区别：**

- Prompts 返回的是 **"用于喂给模型的提示词结构"**
- Resources 返回的是 **"外部数据内容"**

------

## 3) Tools（工具调用）

**它是什么：**
服务器提供的 **可执行函数**（有输入参数 schema，有输出结果），例如：搜索、计算、调用内部系统、下单、发起工作流等。

**你在这里通常做什么：**

- `List Tools`
- 选 tool → 填 JSON 参数 → `Call` → 看返回

**和 Resources 的区别（再强调一次）：**

- Tools 是 **动作/过程**（可能有副作用）
- Resources 是 **内容/状态**（更像查询/读取）

------

## 4) Tasks（任务）

**它是什么：**
与"长耗时/异步/多阶段"的工作相关的能力入口（不同 MCP Server 实现差异较大）。常见含义是：

- 服务器返回一个任务句柄（task id）
- 客户端可查询进度、获取阶段性结果、取消任务等

**一句话：**
Tools 更像"一次调用立刻给结果"；Tasks 更像"启动一个活儿，稍后取结果/看进度"。

------

## 5) Ping（连通性探测）

**它是什么：**
最简单的健康检查/延迟测试。

**你在这里通常做什么：**

- 点一下发 ping，看 server 是否在线、响应是否正常

**它不做业务，只做"活着没"。**

------

## 6) Sampling（采样）

**它是什么：**
MCP 里"**服务器请求客户端去调用模型采样**"的通道。注意方向经常让人误会：

- **不是**"客户端调用 server 的 LLM"
- 而是 **server 让 client 帮它向 LLM 采样**（因为模型通常在客户端/宿主应用这一侧）

**典型用途：**

- server 做一个 agent workflow 时，需要模型补全文本/做推理 → 它向 client 发 sampling 请求
- client 决定用哪个模型、温度、max tokens 等，然后把采样结果回给 server

------

## 7) Elicitations（追问/征询用户输入）

**它是什么：**
"**服务器请求客户端向用户要信息**"的能力。比如 server 在执行某个流程时缺参数：

- 需要你选择一个选项
- 需要你确认/输入某个字段
- 需要你补充一段文本

**一句话：**
Sampling 是"向模型要输出"；Elicitation 是"向用户要输入"。

------

## 8) Roots（根目录/根上下文）

**它是什么：**
客户端提供给服务器的"可访问范围/根上下文"。最常见是文件系统类场景：

- 客户端告诉 server：我这里有哪几个 root（比如工作区目录、项目目录）
- server 后续对资源/文件操作会限定在这些 roots 内

**你可以把它理解成：**

- 给 server 的"沙盒范围"或"workspace 列表"

------

## 9) Auth（认证）

**它是什么：**
与认证/授权相关（例如 token、OAuth 流程、认证头等），用于让 MCP Client 和 MCP Server 建立"可被允许的访问"。

**常见你会看到：**

- 当前是否需要登录/授权
- auth 配置、token 注入等（具体取决于 Inspector/Server 实现）

------

## 10) Metadata（元数据）

**它是什么：**
服务器自身的描述信息/能力声明，比如：

- server 名称、版本
- 支持哪些能力（resources/tools/prompts/…）
- 协议版本、feature flags 等

**用途：**排查兼容性、确认 server 暴露了什么能力。

------

# 你当前这个 Resources 页里：左侧 Resources vs 右侧 Resource Templates 有啥区别？

在你截图里，Resources 页分两块：

## 左：Resources（资源实例）

- 这是 **"已经存在的具体资源"** 列表
- 每条资源通常有明确 `uri`，你可以直接读/订阅

## 右：Resource Templates（资源模板）

- 这是 **"带参数的资源模式"**（像路由模板）
- 例如：`db://table/{name}`、`file://{path}` 这种
- 你需要填 `{name}` 或 `{path}` 才能生成一个具体资源 `uri`，再去读取

**一句话：**

- Resources = "现货清单"
- Templates = "按需生成的资源入口（需要你填参数）"

------

## 最快记忆法（超实用）

- **Resources**：拿数据/内容
- **Tools**：做事情/执行动作
- **Prompts**：拿提示词模板
- **Tasks**：长流程/异步
- **Sampling**：向模型要输出（server → client → LLM）
- **Elicitations**：向用户要输入（server → client → user）
- **Roots**：告诉 server 可访问范围
- **Auth**：授权通行证
- **Metadata**：服务器说明书
- **Ping**：测活
