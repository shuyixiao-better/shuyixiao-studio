---
layout: doc
title: 技术圈爆火新词：Harness 工程，OpenAI 和 Anthropic 都在卷这个！
description: >-
  从 OpenAI 与 Anthropic 的最新实践出发，解析 Harness Engineering 的核心：如何通过任务边界、上下文供给、工具权限与反馈闭环，把模型能力转化为稳定可控的企业生产力。
date: '2026-04-12'
tags:
  - Harness Engineering
  - AI Agent
  - OpenAI
  - Anthropic
  - AI 工程化
author: 舒一笑不秃头
---

**技术圈爆火新词：Harness 工程，OpenAI 和 Anthropic 都在卷这个！**

这两个月，AI 圈子里“Harness Engineering（Harness 工程）”突然刷屏。  
很多人第一反应是：这是 Harness 那家 DevOps 公司的新概念？还是 Prompt Engineering 的升级版？或者给 Agent 接几个工具就完事了？  

都不是。  

OpenAI 在 2026 年 2 月的官方工程文章里，直接把这个主题命名为 **Harness engineering**；Anthropic 也在 2025 年底和 2026 年 3 月的文章中反复强调 **harness design** 对长时 Agent 的决定性作用。

一句话讲透：  
**Harness 工程 = 把“大模型的能力”驯化成“稳定生产力”的工程体系。**  
**Agent = Model + Harness**  
模型负责“会不会”，Harness 负责“能不能稳定、安全、可控地上生产”。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20260412132612049.png)


---

### 为什么它突然火了？

因为大家发现了一个残酷事实：**同一个模型，在不同工程环境里表现天差地别。**

OpenAI 内部实验：3-7 人团队用 Codex Agent，从空仓库起步，**零人工写代码**，5 个月生成 100 万行生产代码、1500 个 PR，日均 3.5 PR/人。  
他们没卷模型，而是卷：  
- 仓库怎么组织才能让 Agent 看懂  
- 为什么要把 repo 当“系统记录”  
- 为什么写 AGENTS.md + 结构化 docs/  
- 如何把浏览器调试、观测性工具直接塞进 Agent runtime  
- Agent 如何自己复现 bug、验证修复、再提 PR  

模型已经不是瓶颈，**系统设计才是**。  
以前卷“模型够不够聪明”，现在卷“你能不能让模型在真实工程里持续产出价值”。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20260412132658612.png)


---

### Harness 工程 ≠ Prompt Engineering 升级版

**Prompt Engineering** 优化的是“单轮回答质量”。  
**Harness Engineering** 优化的是“长流程任务完成率 + 系统可靠性”。

前者关心提示词怎么写；  
后者关心：Agent 在真实业务里能看到什么上下文？能调用什么工具？失败怎么回滚？什么时候必须人工审批？行为怎么审计？

一个是“聊天优化”，一个是“生产底座”——完全不是一个量级。

---

### Harness 工程到底在搭什么“AI 工作底座”？

它本质上是给 Agent 建一套**完整的管理体系**：

1. **清晰任务边界**：不能只说“去修 bug”，要告诉它“只能改 services/order 目录、不许动 schema、必须过单测 + lint、不能直 merge 主分支”。没边界 = 事故制造机。

2. **正确上下文供给**：上下文是稀缺资源，不是越多越好。OpenAI 强调要把知识变成结构化、版本化的 repo 文档（AGENTS.md + docs/ 目录），而不是散落在 Slack/Google Doc 里。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20260412132658612.png)


3. **受控工具接入**：不是无限放权，而是“刚刚好 + 严格审计”。kubectl 只给 get/list/logs？secrets 能不能查？生产环境要不要短期 token？——这才是 Harness。

4. **闭环反馈回路**：OpenAI 把 Chrome DevTools、DOM 快照、截图、日志查询直接接入 Agent，让它能“复现问题 → 验证修复 → 录制结果 → 提 PR”，不再盲飞。

5. **安全护栏 + 人机切换**：模型是发动机，Harness 就是方向盘、刹车、安全气囊。高危操作必须人工拍板，多方案取舍交给人。

**核心不是连接能力，而是控制能力。**

---

### 和 Agent Engineering、平台工程、DevOps 的区别

- **Agent Engineering**：偏“怎么做一个智能体产品”（planning、memory、tool calling）。  
- **Harness Engineering**：偏“让智能体在真实系统里稳定跑”（权限、上下文、验证、审计、人机切换）。  

- **平台工程**：服务人类开发者。  
- **Harness Engineering**：服务人类 + Agent，扩展了研发底座的服务对象。

- **DevOps**：让开发和运维更快更稳交付。  
- **Harness Engineering** = DevOps + 平台工程 + AI Agent 运行控制。

---

**Anthropic 的真实案例**：用三 Agent harness（Planner + Generator + Evaluator），同一个任务，solo Agent 做出的游戏“界面丑、功能烂”；加了 harness 后，UI 干净、操作流畅、AI 生成功能直接可用。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20260412132832214.png)


---

### 为什么说它是未来 2 年最值钱的工程能力？

因为**AI 时代真正的护城河，不是谁先调用模型 API，而是谁先把模型真正接进组织生产系统，并让它稳定产出**。

OpenAI 和 Anthropic 都在公开说：**Agent 的上限，越来越取决于 Harness**。

你们团队现在是：  
**把 AI 当聊天工具**，还是已经开始建设 **AI 的工作底座** 了？
