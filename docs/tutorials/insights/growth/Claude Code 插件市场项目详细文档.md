# Claude Code 插件市场项目详细文档

## 目录

1. [项目概述](#1-项目概述)
2. [核心架构设计](#2-核心架构设计)
3. [组件体系](#3-组件体系)
4. [实现机制](#4-实现机制)
5. [技术栈与生态](#5-技术栈与生态)
6. [工作流程编排](#6-工作流程编排)
7. [最佳实践](#7-最佳实践)
8. [扩展指南](#8-扩展指南)

---

## 1. 项目概述

### 1.1 项目定位

这是一个**面向 Claude Code 的生产级 AI 开发插件市场**，旨在将 Claude Code 转变为全栈 AI 开发平台。项目通过模块化插件体系，提供了覆盖软件开发全生命周期的专业化 AI 能力。

### 1.2 核心数据

| 维度             | 数量 | 说明                 |
| ---------------- | ---- | -------------------- |
| **插件总数**     | 72   | 单一职责的专注插件   |
| **专业代理**     | 108  | 各领域的 AI 专家代理 |
| **代理技能**     | 140+ | 模块化知识包         |
| **工作流编排器** | 15   | 多代理协调系统       |
| **开发工具**     | 72   | 自动化开发工具       |
| **分类目录**     | 23   | 便于发现和使用       |

### 1.3 设计哲学

项目遵循以下核心设计原则：

1. **单一职责原则 (SRP)**
    - 每个插件只做一件事并做到极致
    - 平均每个插件仅 3.4 个组件
    - 清晰的边界定义

2. **组合优于捆绑**
    - 插件可自由组合使用
    - 工作流编排器组合多个专注插件
    - 无强制功能捆绑

3. **渐进式披露**
    - 技能采用三层加载架构
    - 按需加载，最小化 Token 消耗

4. **上下文效率**
    - 更小的工具 = 更快的处理速度
    - 更好地适配 LLM 上下文窗口
    - 更精确、更聚焦的响应

---

## 2. 核心架构设计

### 2.1 仓库结构

```
claude-agents/
├── .claude-plugin/
│   └── marketplace.json          # 插件市场目录（72个插件）
├── plugins/                       # 隔离的插件目录
│   ├── python-development/        # Python 开发插件示例
│   │   ├── agents/                # 专业代理（3个）
│   │   │   ├── python-pro.md
│   │   │   ├── django-pro.md
│   │   │   └── fastapi-pro.md
│   │   ├── commands/              # Python 工具（1个）
│   │   │   └── python-scaffold.md
│   │   └── skills/                # Python 技能（15个）
│   │       ├── async-python-patterns/
│   │       ├── python-testing-patterns/
│   │       └── ...
│   ├── kubernetes-operations/     # Kubernetes 插件示例
│   │   ├── agents/
│   │   │   └── kubernetes-architect.md
│   │   ├── commands/
│   │   │   └── k8s-deploy.md
│   │   └── skills/                # K8s 技能（4个）
│   │       ├── k8s-manifest-generator/
│   │       ├── helm-chart-scaffolding/
│   │       ├── gitops-workflow/
│   │       └── k8s-security-policies/
│   └── ... (其他70个插件)
├── docs/                          # 文档目录
│   ├── plugins.md                 # 插件参考
│   ├── agents.md                  # 代理参考
│   ├── agent-skills.md            # 技能文档
│   ├── architecture.md            # 设计原则
│   └── usage.md                   # 使用指南
└── README.md                      # 快速入门
```

### 2.2 插件定义结构

每个插件在 `marketplace.json` 中定义如下：

```json
{
  "name": "python-development",
  "source": "./plugins/python-development",
  "description": "Modern Python development with Python 3.12+, Django, FastAPI, async patterns, and production best practices",
  "version": "1.2.1",
  "author": {
    "name": "Seth Hobson",
    "url": "https://github.com/wshobson"
  },
  "homepage": "https://github.com/wshobson/agents",
  "repository": "https://github.com/wshobson/agents",
  "license": "MIT",
  "keywords": ["python", "django", "fastapi", "async", "backend"],
  "category": "languages",
  "strict": false,
  "commands": ["./commands/python-scaffold.md"],
  "agents": [
    "./agents/python-pro.md",
    "./agents/django-pro.md",
    "./agents/fastapi-pro.md"
  ],
  "skills": [
    "./skills/async-python-patterns",
    "./skills/python-testing-patterns",
    // ... 更多技能
  ]
}
```

### 2.3 渐进式技能架构

技能采用三层架构实现渐进式披露：

```
┌─────────────────────────────────────────────────────────┐
│                      技能文件结构                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. 元数据层 (YAML Frontmatter)                  │   │
│  │    - 技能名称                                     │   │
│  │    - 激活条件（Use when ...）                     │   │
│  │    → 总是加载，用于匹配                            │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 2. 指令层 (Core Instructions)                   │   │
│  │    - 核心指导原则                                 │   │
│  │    - 最佳实践                                     │   │
│  │    → 激活时加载                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 3. 资源层 (Resources & Examples)                │   │
│  │    - 代码示例                                     │   │
│  │    - 模板                                         │   │
│  │    → 按需加载                                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**示例技能结构**：

```yaml
---
name: async-python-patterns
description: Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications. Use when building async APIs, concurrent systems, or I/O-bound applications requiring non-blocking operations.
---

# Async Python Patterns

## When to Use This Skill
- Building async web APIs (FastAPI, aiohttp, Sanic)
- Implementing concurrent I/O operations
...

## Core Concepts
### 1. Event Loop
### 2. Coroutines
...

## Code Examples
```python
import asyncio

async def main():
    ...
```

```
---

## 3. 组件体系

### 3.1 代理 (Agents)

代理是具有领域专业知识的 AI 专家，使用 Markdown 文件定义，包含 YAML frontmatter 和详细的系统提示词。

**代理文件结构**：

```markdown
---
name: python-pro
description: Master Python 3.12+ with modern features, async programming, performance optimization, and production-ready practices...
model: opus
---

You are a Python expert specializing in modern Python 3.12+ development...

## Purpose
Expert Python developer mastering Python 3.12+ features...

## Capabilities
### Modern Python Features
### Modern Tooling & Development Environment
...
```

**代理模型分配策略**：

| 模型           | 代理数量 | 用途                           |
| -------------- | -------- | ------------------------------ |
| **Opus 4.5**   | 42       | 关键架构、安全、代码评审       |
| **Inherit**    | 42       | 复杂任务 - 用户选择模型        |
| **Sonnet 4.5** | 51       | 支持性任务（文档、测试、调试） |
| **Haiku 4.5**  | 18       | 快速运维任务                   |

### 3.2 命令 (Commands)

命令是自动化工具和工作流，用于执行特定任务。

**命令文件结构**：

```markdown
# Python Project Scaffolding

You are a Python project architecture expert specializing in scaffolding...

## Context
The user needs automated Python project scaffolding...

## Requirements
$ARGUMENTS

## Instructions
### 1. Analyze Project Type
### 2. Initialize Project with uv
...
```

**命令调用方式**：

```bash
# 安装插件后
/plugin install python-development

# 使用命令
/python-development:python-scaffold fastapi-microservice
```

### 3.3 技能 (Skills)

技能是模块化的知识包，遵循 Anthropic 的 Agent Skills Specification。

**技能目录结构**：

```
skills/
└── async-python-patterns/
    └── SKILL.md
```

**技能激活机制**：

1. Claude 分析用户请求
2. 匹配技能的 `description` 中的 "Use when" 条件
3. 加载技能的指令层内容
4. 根据需要加载资源层内容

---

## 4. 实现机制

### 4.1 插件安装与加载

**安装流程**：

```
1. 添加市场
   /plugin marketplace add wshobson/agents
   ↓
2. 浏览可用插件
   /plugin
   ↓
3. 安装所需插件
   /plugin install python-development
   ↓
4. 仅加载该插件的代理、命令和技能
```

**Token 效率对比**：

| 方式         | Token 消耗       | 说明                   |
| ------------ | ---------------- | ---------------------- |
| 安装单个插件 | ~1000 tokens     | 仅加载 Python 相关组件 |
| 安装整个市场 | ~100,000+ tokens | 加载所有 72 个插件     |

### 4.2 插件隔离机制

每个插件是完全隔离的：

```
python-development/
├── agents/          # 仅 Python 代理
│   ├── python-pro.md
│   ├── django-pro.md
│   └── fastapi-pro.md
├── commands/        # 仅 Python 工具
│   └── python-scaffold.md
└── skills/          # 仅 Python 技能
    ├── async-python-patterns/
    └── python-testing-patterns/

kubernetes-operations/
├── agents/          # 仅 K8s 代理
│   └── kubernetes-architect.md
├── commands/        # 仅 K8s 工具
│   └── k8s-deploy.md
└── skills/          # 仅 K8s 技能
    ├── k8s-manifest-generator/
    └── helm-chart-scaffolding/
```

### 4.3 多模型编排

项目采用分层模型策略优化性能和成本：

```
┌─────────────────────────────────────────────────────────┐
│                    多模型编排示例                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  用户请求：构建用户认证 API                               │
│        ↓                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Opus 4.5 - backend-architect                    │   │
│  │ 设计 API 架构、安全策略、数据模型                 │   │
│  └─────────────────────────────────────────────────┘   │
│        ↓                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Sonnet 4.5 - python-pro / fastapi-pro          │   │
│  │ 实现 FastAPI 端点、Pydantic 模型、依赖注入        │   │
│  └─────────────────────────────────────────────────┘   │
│        ↓                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Haiku 4.5 - test-automator                     │   │
│  │ 生成 pytest 测试用例                             │   │
│  └─────────────────────────────────────────────────┘   │
│        ↓                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Sonnet 4.5 - security-auditor                  │   │
│  │ 代码安全审查、OWASP 合规检查                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 技术栈与生态

### 5.1 编程语言支持

| 语言                      | 插件                   | 代理 | 技能 |
| ------------------------- | ---------------------- | ---- | ---- |
| **Python**                | python-development     | 3    | 15   |
| **JavaScript/TypeScript** | javascript-typescript  | 2    | 4    |
| **Rust**                  | systems-programming    | 1    | 1    |
| **Go**                    | systems-programming    | 1    | 1    |
| **Java**                  | jvm-languages          | 1    | -    |
| **C#**                    | jvm-languages          | 1    | -    |
| **PHP**                   | web-scripting          | 1    | -    |
| **Ruby**                  | web-scripting          | 1    | -    |
| **Elixir**                | functional-programming | 1    | -    |
| **Julia**                 | julia-development      | 1    | -    |
| **Bash**                  | shell-scripting        | 2    | 3    |

### 5.2 框架与工具覆盖

**Web 框架**：

- FastAPI, Django, Flask (Python)
- Express, Fastify (Node.js)
- React, Next.js, Vue.js (前端)
- Phoenix (Elixir)

**基础设施**：

- Kubernetes, Docker
- Terraform, AWS/Azure/GCP
- GitHub Actions, GitLab CI
- Prometheus, Grafana

**AI/ML**：

- LangGraph, LangChain
- PyTorch, TensorFlow
- MLflow, scikit-learn

### 5.3 技能分类统计

| 分类           | 技能数量 | 示例                           |
| -------------- | -------- | ------------------------------ |
| **后端开发**   | 9        | API 设计、微服务、CQRS、Saga   |
| **Kubernetes** | 4        | 清单生成、Helm、GitOps、安全   |
| **LLM 应用**   | 8        | LangGraph、RAG、向量搜索、评估 |
| **开发者基础** | 11       | Git、SQL、调试、Monorepo       |
| **云基础设施** | 8        | Terraform、多云、服务网格      |
| **区块链**     | 4        | DeFi、NFT、Solidity 安全       |
| **CI/CD**      | 4        | 流水线设计、GitHub Actions     |
| **Python**     | 15       | Async、测试、打包、性能        |
| **安全**       | 5        | SAST、STRIDE、威胁建模         |

---

## 6. 工作流程编排

### 6.1 全栈功能开发

工作流：`full-stack-orchestration:full-stack-feature`

```
用户请求："实现用户 OAuth2 认证功能"
        ↓
┌─────────────────────────────────────────────────────────┐
│ 1. backend-architect (Opus)                             │
│    设计认证 API、OAuth2 流程、令牌管理                    │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. database-architect (Opus)                            │
│    设计用户表、会话存储、索引策略                         │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. frontend-developer (Sonnet)                          │
│    实现登录 UI、认证状态管理                             │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. test-automator (Haiku)                               │
│    生成端到端测试用例                                     │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. security-auditor (Sonnet)                            │
│    安全审查、OWASP 合规检查                               │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. deployment-engineer (Haiku)                          │
│    配置 CI/CD 流水线、部署策略                            │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 7. observability-engineer (Sonnet)                       │
│    设置监控、日志、告警                                   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 安全加固流程

工作流：`security-scanning:security-hardening`

```
用户请求："对代码库进行全面安全审计"
        ↓
┌─────────────────────────────────────────────────────────┐
│ 1. SAST 分析                                             │
│    - 静态代码安全扫描                                     │
│    - 检测常见漏洞模式                                     │
│    - 识别不安全的函数调用                                 │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 依赖扫描                                              │
│    - 检查已知漏洞的依赖项                                 │
│    - 生成升级建议                                        │
│    - 评估传递性依赖风险                                   │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 代码审查                                              │
│    - 安全最佳实践审查                                     │
│    - 权限和认证检查                                       │
│    - 输入验证审查                                        │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 威胁建模                                              │
│    - STRIDE 分析                                         │
│    - 攻击面评估                                          │
│    - 缓解措施建议                                        │
└─────────────────────────────────────────────────────────┘
```

### 6.3 多插件组合示例

```
功能开发工作流：
├── backend-development:feature-development    # 后端 API 开发
├── security-scanning:security-hardening       # 安全加固
├── unit-testing:test-generate                # 测试生成
├── code-review-ai:ai-review                   # AI 代码审查
├── cicd-automation:workflow-automate          # CI/CD 自动化
└── observability-monitoring:monitor-setup      # 监控设置
```

---

## 7. 最佳实践

### 7.1 插件设计原则

**单一职责**：

- ✅ 好的：`python-development` - 专注于 Python 开发
- ❌ 坏的：`web-development` - 包含前后端、数据库、部署等

**清晰边界**：

- 每个插件平均 3.4 个组件
- 避免功能重叠
- 明确的依赖关系

### 7.2 技能编写规范

**YAML Frontmatter**：

```yaml
---
name: skill-name              # 必需：kebab-case
description: What the skill does. Use when [trigger].  # 必需：< 1024 字符
---
```

**激活条件**：

- 使用 "Use when" 明确触发条件
- 避免模糊的描述
- 包含具体场景示例

### 7.3 代理配置指南

**模型选择**：

- `opus` - 关键决策、架构设计、安全审查
- `sonnet` - 复杂开发任务、代码审查
- `haiku` - 快速执行、文档生成
- `inherit` - 让用户根据成本/需求选择

**描述编写**：

```yaml
---
description: [领域专家] + [核心能力] + [使用场景]. Use PROACTIVELY for [具体触发条件].
---
```

---

## 8. 扩展指南

### 8.1 添加新插件

1. **创建插件目录**：

   ```bash
   mkdir plugins/new-plugin
   ```

2. **添加代理和/或命令**：

   ```
   plugins/new-plugin/
   ├── agents/
   │   └── expert-agent.md
   └── commands/
       └── tool.md
   ```

3. **可选：添加技能**：

   ```
   plugins/new-plugin/
   └── skills/
       └── new-skill/
           └── SKILL.md
   ```

4. **更新 marketplace.json**：

   ```json
   {
     "name": "new-plugin",
     "source": "./plugins/new-plugin",
     "description": "Clear, focused description",
     "category": "appropriate-category",
     "agents": ["./agents/expert-agent.md"],
     "commands": ["./commands/tool.md"],
     "skills": ["./skills/new-skill"]
   }
   ```

### 8.2 添加新代理

1. **创建代理文件**：

   ```bash
   touch plugins/new-plugin/agents/expert-agent.md
   ```

2. **编写代理定义**：

   ```markdown
   ---
   name: expert-agent
   description: Expertise description. Use when [trigger].
   model: opus
   ---
   
   You are an expert in [domain]...
   
   ## Purpose
   [What this agent does]
   
   ## Capabilities
   ### Core Area 1
   ### Core Area 2
   ...
   ```

3. **更新插件配置**：
   在 `marketplace.json` 中添加代理引用。

### 8.3 添加新技能

1. **创建技能目录和文件**：

   ```bash
   mkdir -p plugins/new-plugin/skills/new-skill
   touch plugins/new-plugin/skills/new-skill/SKILL.md
   ```

2. **编写技能内容**：

   ```yaml
   ---
   name: new-skill
   description: What the skill does. Use when [specific trigger].
   ---
   
   # Skill Name
   
   ## When to Use This Skill
   - [Specific scenario 1]
   - [Specific scenario 2]
   
   ## Core Concepts
   ### Concept 1
   ### Concept 2
   
   ## Code Examples
   ```python
   # Example code
   ```

   ```
   
   ```

3. **添加到插件配置**：
   在 `marketplace.json` 中添加技能引用。

---

## 附录

### A. 插件分类目录

| 分类         | 插件数量 | 代表插件                                                     |
| ------------ | -------- | ------------------------------------------------------------ |
| **开发**     | 5        | debugging-toolkit, backend-development, frontend-mobile-development, multi-platform-apps, developer-essentials |
| **文档**     | 3        | code-documentation, documentation-generation, c4-architecture |
| **工作流**   | 4        | git-pr-workflows, full-stack-orchestration, tdd-workflows, conductor |
| **测试**     | 2        | unit-testing, tdd-workflows                                  |
| **质量**     | 3        | code-review-ai, comprehensive-review, performance-testing-review |
| **AI/ML**    | 4        | llm-application-dev, agent-orchestration, context-management, machine-learning-ops |
| **数据**     | 3        | data-engineering, data-validation-suite, business-analytics  |
| **数据库**   | 2        | database-design, database-migrations                         |
| **运维**     | 4        | incident-response, error-diagnostics, distributed-debugging, observability-monitoring |
| **性能**     | 2        | application-performance, database-cloud-optimization         |
| **基础设施** | 5        | deployment-strategies, deployment-validation, kubernetes-operations, cloud-infrastructure, cicd-automation |
| **安全**     | 5        | security-scanning, security-compliance, backend-api-security, frontend-mobile-security, reverse-engineering |
| **语言**     | 10       | python-development, javascript-typescript, systems-programming, jvm-languages, web-scripting, functional-programming, julia-development, arm-cortex-microcontrollers, shell-scripting |
| **API**      | 2        | api-scaffolding, api-testing-observability                   |
| **区块链**   | 1        | blockchain-web3                                              |
| **金融**     | 1        | quantitative-trading                                         |
| **支付**     | 1        | payment-processing                                           |
| **游戏**     | 1        | game-development                                             |
| **无障碍**   | 1        | accessibility-compliance                                     |
| **营销**     | 3        | seo-content-creation, seo-technical-optimization, seo-analysis-monitoring, content-marketing |
| **业务**     | 4        | business-analytics, startup-business-analyst, hr-legal-compliance, customer-sales-automation |
| **现代化**   | 2        | framework-migration, codebase-cleanup                        |
| **UI 设计**  | 1        | ui-design                                                    |

### B. 相关资源

- [Claude Code 官方文档](https://docs.claude.com/en/docs/claude-code/overview)
- [插件指南](https://docs.claude.com/en/docs/claude-code/plugins)
- [子代理指南](https://docs.claude.com/en/docs/claude-code/sub-agents)
- [代理技能规范](https://github.com/anthropics/skills/blob/main/agent_skills_spec.md)
- [项目仓库](https://github.com/wshobson/agents)

---

**文档版本**：1.0
**最后更新**：2026-02-03
**作者**：Claude Code Analysis