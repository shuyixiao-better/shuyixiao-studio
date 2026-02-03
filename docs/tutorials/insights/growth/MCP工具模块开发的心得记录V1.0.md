---
layout: doc
title: MCP 工具模块开发心得记录
description: >-
  记录在 Knife4j 项目基础上实现 MCP 工具的开发心得，包括配置详解、K8s 环境下 SSE 连接问题等实战经验。
date: '2026-02-03'
tags:
  - MCP
  - Knife4j
  - Spring Boot
  - SSE
  - Kubernetes
  - 开发实践
author: 舒一笑不秃头
---

> 仅以此篇记录一下开发项目MCP工具的心得体会，也因为如此加深了自己对于MCP的理解，关于MCP是什么我就不过多的阐述，因为没有什么意义，但是遇到的一些坑和趟过的水还是值得记录，不为一方面为了反思成长，一方面也为了照亮他人。虽然说在AI时代，不缺乏内容产出，但是有灵魂味的思考还是会在互联网的长河中留下属于我的一点微小尘埃

## 本次实现了什么

本次基于Knife4j项目基础上做了Knife4j MCP，**作为业务服务的一个 Spring Boot Starter** 注入进来的。
它不是独立服务，而是 **挂在你业务应用里** 的一组 HTTP/SSE 接口（/mcp、/sse、/messages）。

### 如何配置

```yml
knife4j:
  mcp:
    enabled: true
    path: /mcp
    server-name: "Knife4j MCP Server"
    server-version: "1.0.0-POC"
    exclude-paths:
      - "/.*actuator.*"
      - "/.*swagger.*"
      - "/.*doc.*"
    protocol-version: 2025-11-25
    require-protocol-header: false
    sse-enabled: true
    sse-heartbeat-seconds: 15
    session-enabled: false
    session-ttl-seconds: 3600
    allowed-origins: "*"
    enforce-origin-check: true
    base-url: https://xxxxxxx
    # 新增：开启 SSE-only
    legacy-sse-enabled: true
    legacy-sse-path: /sse
    legacy-sse-message-path: /messages
    # 可选：如果你有网关/外网地址，建议配
    legacy-sse-base-url: https://xxxxxxx
```

### 逐项解释

### 1) enabled: true

开启 MCP 功能。不写就是关闭。

### 2) path: /mcp

决定 MCP 的主入口：

- POST /mcp = JSON-RPC 请求（initialize、tools/list）
- GET /mcp = SSE 通道（标准 MCP）

如果不写，就默认 /mcp。

### 3) base-url

**非常关键。**

Knife4j MCP 会在很多地方生成 “外部访问地址”，比如 legacy SSE 会告诉客户端：

```
endpoint = base-url + /messages?sessionId=xxx 
```

如果不配，会自动用 **请求里带来的 host**，
但在 k8s / Ingress 环境下，服务端看到的 host 往往是内网地址，会导致返回 localhost 或 pod 内网地址。

所以你必须手动指定外部访问地址，比如：

```
https://xxxxx.dev.xxxxx.com 
```

### 4) legacy-sse-enabled: true

这开启的是 **旧版 SSE-only 传输方式**，路径是：

- GET /sse 建立通道
- POST /messages 发送 JSON-RPC，响应通过 SSE 回来

有些客户端更依赖这个模式，所以启用了它。

### 5) legacy-sse-path + legacy-sse-message-path

定义 legacy SSE 的实际路径（默认 /sse、/messages）。

**注意**：这些路径不是 /mcp 下的，所以必须在网关/Ingress 放行它们。

### 6) legacy-sse-base-url

这就是 legacy SSE 返回的 endpoint 的 host 部分。

### 7) sse-enabled: true

开启标准 MCP SSE（GET /mcp 建通道）。
如果关闭，GET /mcp 只会返回一个 JSON。

### 8) session-enabled: false

是否启用会话 ID。

- true 时，initialize 会返回 Mcp-Session-Id
  后续请求必须带这个头
- false 时不需要 session（更方便）

MCP Inspector 默认 **不会自动带 session**，禁用它是合理的。

### 9) exclude-paths

OpenAPI 会映射成 MCP tools。
你不想暴露的 API，就在这里排除。

### 10) allowed-origins + enforce-origin-check

浏览器访问时会带 Origin。
如果开启检查且不在白名单里，会直接拒绝（403）。

## 三、总结一句话

**MCP 其实就是业务服务对外暴露的 HTTP/SSE 接口，所以必须在业务模块里把路径、协议、访问地址、会话、SSE 这些关键信息配置清楚。**

否则：

- 客户端连不上（返回 localhost）
- SSE 地址生成错
- Ingress 路由不到
- 浏览器被跨域拦截

## 遇到的坑点

### 关于MCP工具继承在K8s运维体系出现SSE连接不稳定，最终Agent端选择采用Streamable HTTP传输类型

**Kubernetes Ingress 默认情况下并不保证 SSE 一定稳定工作**，主要问题出在 **代理层的缓冲、超时、连接保持** 上。因为SSE（Server-Sent Events）本质是：

- HTTP 长连接
- 服务端持续推送数据
- 客户端不断接收事件流

Ingress 本身转发 HTTP 没问题，但很多 Ingress Controller 默认行为会破坏 SSE。