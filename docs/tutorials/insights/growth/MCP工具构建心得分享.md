---
layout: doc
title: MCP 工具构建心得分享
description: >-
  本文介绍 MCP（Model Context Protocol）协议的基本概念，以及 MCP Inspector v0.19.0 调试工具的功能和使用方法。通过可视化界面测试 MCP 服务器的资源、工具和提示模板，帮助开发者快速理解和调试 MCP 服务。
date: '2026-01-28'
tags:
  - MCP
  - AI
  - 开发工具
  - 调试
  - 大模型
author: 舒一笑不秃头
---

##  MCP 是啥

MCP（Model Context Protocol，模型上下文协议）是一套“接口规范”，让大模型/AI Agent 可以用统一方式去调用外部能力，比如：

- 读一个“资源”（resource）：文件、网页、数据库记录……
- 调一个“工具”（tool）：搜索、计算、发起某个 API 请求……
- 用“提示模板”（prompt template）：把参数填进去，生成标准化提示

**MCP Server** 就是把这些能力包装成统一协议对外提供服务。 

## MCP调试工具介绍---MCP Inspector v0.19.0

> **MCP Inspector v0.19.0** 简单说：它是一个**用来“可视化测试/调试 MCP 服务器”的开发者工具**。你可以把它理解成——当你写了一个 MCP Server（给大模型提供工具、资源、提示模板的那个服务）之后，用 Inspector 来**连上它、点点按钮、发请求、看返回、看日志**，确认它到底能不能正常工作。

------

## MCP Inspector 是干什么的？

官方定义就是：**交互式开发者工具，用来测试和调试 MCP servers**。

它通常提供一个 Web 界面，你可以在里面做这些事（不写代码也能点）：

1. **连接服务器**：选择连接方式（transport），比如本地进程/HTTP/SSE 等
2. **看资源 Resource**：列出 server 暴露的资源、点开查看内容/元数据、测试订阅
3. **看提示 Prompt**：看到有哪些提示模板、参数是什么、直接试跑
4. **看工具 Tool**：列出有哪些工具、schema（输入格式）是什么、填参数运行、看结果
5. **看日志/通知**：server 发出来的日志、事件都会在面板里显示出来
   这些功能点在官方文档中文版也有比较完整的说明。 ([MCP 官方文档](https://mcp-docs.apifox.cn/6175082m0?utm_source=chatgpt.com))

------

## v0.19.0 代表什么？

这是 Inspector 这个工具的**版本号**（0.19.0）。你看到的 “MCP Inspector v0.19.0” 基本就是“你现在运行/安装的 Inspector 版本”。（不同版本可能会有 UI、功能、bug 修复差异。）
它对应的 npm 包一般是 `@modelcontextprotocol/inspector`。 ([npm](https://www.npmjs.com/package/@modelcontextprotocol/inspector?utm_source=chatgpt.com))

------

## 小白怎么用（最常见的方式）

如果你装了 Node.js，一般直接一条命令就能跑起来（不需要先安装）：

- **快速启动 UI**：`npx @modelcontextprotocol/inspector`
- 然后浏览器打开它给的本地地址（例如 `http://localhost:6274`）
  官方 GitHub 的 Quick Start 就是这么写的。 ([GitHub](https://github.com/modelcontextprotocol/inspector?utm_source=chatgpt.com))

> 你不用先理解协议细节：先把 Inspector 跑起来 → 连接你的 MCP Server → 看它暴露了哪些工具/资源 → 点一下试试，就能快速理解“它到底给大模型提供了什么能力”。

------

## 你什么时候会需要它？

- 你在写/改一个 MCP Server，想验证：**工具能不能调用成功？输入输出对不对？**
- 你拿到别人写的 MCP Server（npm/pypi 包），想先“试用”一下它提供什么
- 你在排查问题：连接不上、返回报错、参数不对、CORS/SSE 问题等（Inspector 的日志很有用） ([掘金](https://juejin.cn/post/7512720970312171572?utm_source=chatgpt.com))

------

## 一句话总结

**MCP Inspector = MCP 世界里的“Postman + 调试控制台 + 可视化面板”**：用来连 MCP Server，查看它的资源/工具/提示模板，手动测试并排错。 ([Model Context Protocol](https://modelcontextprotocol.io/docs/tools/inspector?utm_source=chatgpt.com))