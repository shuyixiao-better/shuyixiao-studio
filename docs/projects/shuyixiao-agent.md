# shuyixiao-agent：基于 LangGraph 的智能 Agent 项目

> 一个基于现代 AI Agent 框架 LangGraph 和码云 AI 的智能 Agent 项目，提供清晰的代码结构、详细的文档和丰富的示例。

## 📖 项目简介

**shuyixiao-agent** 是我开发的一个 AI Agent 项目，旨在帮助开发者快速理解和上手 LangGraph 框架。项目采用模块化设计，提供从简单对话到复杂工具调用的完整示例，特别适合 AI Agent 开发的学习和参考。

### 🔗 项目链接

- **GitHub**: [https://github.com/shuyixiao-better/shuyixiao-agent](https://github.com/shuyixiao-better/shuyixiao-agent)
- **Gitee**: [https://gitee.com/shuyixiao-only/shuyixiao-agent](https://gitee.com/shuyixiao-only/shuyixiao-agent)
- **许可证**: MIT License

## ✨ 核心特性

### 1. 🎨 优雅的 Web 界面

项目提供了一个功能完善的 Web 交互界面，具备以下特性：

- **流式输出**：AI 回复实时逐字显示，无需等待完整生成
- **Markdown 渲染**：完整支持代码高亮、表格、列表等 Markdown 语法
- **多 Agent 支持**：可切换简单对话和工具调用两种模式
- **对话历史**：自动保存对话记录，刷新页面不丢失
- **现代化 UI**：美观的聊天界面，良好的用户体验

### 2. 🛠️ 强大的工具系统

内置多种实用工具，支持自定义扩展：

- **时间工具**：获取当前时间
- **计算工具**：支持数学表达式计算
- **搜索工具**：模拟网络搜索（可扩展）
- **自定义工具**：简单易用的工具注册机制

### 3. 🏗️ 清晰的架构设计

基于 LangGraph 框架的现代化架构：

```
┌─────────────┐
│  Web 界面   │
└──────┬──────┘
       │
┌──────▼──────┐
│  FastAPI    │
│  服务层     │
└──────┬──────┘
       │
┌──────▼──────┐
│   Agent     │
│   管理器    │
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
┌───▼───┐ │
│简单   │ │
│Agent  │ │
└───────┘ │
          │
      ┌───▼───┐
      │工具   │
      │Agent  │
      └───────┘
```

### 4. 📚 完整的文档和示例

- **快速开始指南**：5 分钟快速上手
- **API 参考文档**：完整的 API 说明
- **架构设计文档**：深入理解 LangGraph
- **代码示例**：从简单到复杂的 4 个示例

## 🚀 快速开始

### 环境要求

- Python 3.9+
- 码云 AI API Key（免费申请）

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/shuyixiao-better/shuyixiao-agent.git
cd shuyixiao-agent

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 GITEE_AI_API_KEY

# 4. 启动 Web 服务
python run_web.py
```

访问 `http://localhost:8000` 即可开始使用！

### 命令行使用

```python
from src.shuyixiao_agent import SimpleAgent
from dotenv import load_dotenv

load_dotenv()

# 创建 Agent
agent = SimpleAgent()

# 开始对话
response = agent.chat("你好！请介绍一下 LangGraph。")
print(response)
```

## 📂 项目结构

```
shuyixiao-agent/
├── src/
│   └── shuyixiao_agent/          # 主要代码
│       ├── config.py              # 配置管理
│       ├── gitee_ai_client.py    # 码云 AI 客户端
│       ├── web_app.py             # Web 应用服务
│       ├── static/                # 前端静态文件
│       │   └── index.html        # Web 界面
│       ├── agents/                # Agent 实现
│       │   ├── simple_agent.py   # 简单对话 Agent
│       │   └── tool_agent.py     # 工具调用 Agent
│       └── tools/                 # 工具集合
│           └── basic_tools.py    # 基础工具
├── examples/                      # 示例代码
│   ├── 01_simple_chat.py
│   ├── 02_tool_agent.py
│   ├── 03_custom_tool.py
│   └── 04_api_client.py
├── docs/                          # 文档
├── run_web.py                     # Web 服务启动脚本
└── README.md
```

## 💡 核心功能详解

### 简单对话 Agent

最基础的对话功能，适合快速集成：

```python
from src.shuyixiao_agent import SimpleAgent

agent = SimpleAgent(
    system_message="你是一个友好的 AI 助手"
)

response = agent.chat("Python 有什么特点？")
print(response)
```

### 工具调用 Agent

支持函数调用的高级 Agent：

```python
from src.shuyixiao_agent.agents.tool_agent import ToolAgent
from src.shuyixiao_agent.tools import get_current_time

agent = ToolAgent()

# 注册工具
agent.register_tool(
    name="get_current_time",
    func=get_current_time,
    description="获取当前时间",
    parameters={"type": "object", "properties": {}}
)

# 使用工具
response = agent.run("现在几点了？")
print(response)
```

### 自定义工具

轻松扩展 Agent 能力：

```python
def get_weather(city: str) -> str:
    """查询城市天气"""
    return f"{city}的天气：晴天，25°C"

agent = ToolAgent()

# 注册自定义工具
agent.register_tool(
    name="get_weather",
    func=get_weather,
    description="查询城市天气",
    parameters={
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "城市名称"}
        },
        "required": ["city"]
    }
)

response = agent.run("北京今天天气怎么样？")
```

## 🌐 Web 界面使用指南

### 核心功能

#### 1. 流式输出

- AI 回复实时逐字显示，无需等待
- 显示打字指示器动画
- 大幅提升用户体验

#### 2. Markdown 渲染

支持完整的 Markdown 语法：

- **代码块**：深色主题，语法高亮
- **行内代码**：`代码` 样式
- **表格**：清晰的边框和表头
- **列表**：有序/无序列表
- **标题**：H1-H6 层级
- **引用**：左侧紫色边框
- **链接和图片**：完整支持

#### 3. Agent 类型切换

- **简单对话**：基础问答，适合日常交流
- **工具调用**：可调用时间、计算、搜索等工具

### 使用示例

**测试流式输出：**

```
问：用 Python 写一个快速排序算法
答：[实时逐字显示，带代码高亮]
```

**测试工具调用：**

```
切换到"工具调用"模式
问：现在几点了？
答：当前时间是 2025-10-10 10:30:00
```

**测试 Markdown：**

```
问：用表格对比 Python 和 Java 的特点
答：[显示格式化的表格]
```

### API 接口

Web 服务提供以下 RESTful API：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/chat/stream` | POST | 流式聊天接口 |
| `/api/chat` | POST | 普通聊天接口 |
| `/api/history/{session_id}` | GET | 获取历史记录 |
| `/api/history/{session_id}` | DELETE | 清除历史记录 |
| `/api/health` | GET | 健康检查 |

完整 API 文档：访问 `http://localhost:8000/docs`

## 🔧 配置选项

主要配置项（在 `.env` 文件中设置）：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `GITEE_AI_API_KEY` | 码云 AI API Key | 必填 |
| `GITEE_AI_MODEL` | 使用的模型 | Qwen/Qwen2.5-7B-Instruct |
| `AGENT_MAX_ITERATIONS` | Agent 最大迭代次数 | 10 |
| `ENABLE_FAILOVER` | 是否启用故障转移 | true |
| `REQUEST_TIMEOUT` | 请求超时时间（秒） | 60 |

## 🤖 可用模型

码云 AI 支持多种模型，包括：

- **Qwen/Qwen2.5-7B-Instruct** - 通用对话（推荐入门）
- **Qwen/Qwen2.5-14B-Instruct** - 更强性能
- **Qwen/Qwen2.5-72B-Instruct** - 最强性能

更多模型见 [码云 AI 模型广场](https://ai.gitee.com/)

## 📋 技术栈

- **核心框架**：LangGraph、LangChain
- **AI 服务**：码云 AI
- **Web 框架**：FastAPI
- **前端技术**：原生 JavaScript、Marked.js、DOMPurify
- **开发语言**：Python 3.9+

## 🎯 学习路径建议

### 初级阶段（1-2 天）

1. 运行 Web 界面，体验功能
2. 阅读示例代码 `01_simple_chat.py`
3. 理解 SimpleAgent 的实现原理
4. 尝试修改 system_message

### 中级阶段（3-5 天）

1. 学习 `02_tool_agent.py` 示例
2. 理解工具调用机制
3. 尝试添加自定义工具
4. 阅读 LangGraph 架构文档

### 高级阶段（1-2 周）

1. 深入研究 LangGraph 源码
2. 实现复杂的 Agent 流程
3. 优化性能和错误处理
4. 集成到实际项目中

## 🔍 常见问题

### Q1: 如何获取码云 AI API Key？

访问 [码云 AI 官网](https://ai.gitee.com/)，注册账号后在控制台获取 API Key。

### Q2: 支持其他 AI 模型吗？

目前主要支持码云 AI，但架构设计支持扩展其他模型（如 OpenAI、Claude 等）。

### Q3: Web 界面流式输出不工作怎么办？

1. 确保已重启服务
2. 清除浏览器缓存（Ctrl+F5）
3. 检查控制台错误（F12）

### Q4: 如何部署到生产环境？

建议使用 Docker 容器化部署，配合 Nginx 反向代理，具体步骤参考项目文档。

## 🚀 未来规划

- [x] Web 交互界面
- [x] 流式输出支持
- [x] Markdown 渲染
- [x] 对话历史管理
- [ ] 实现会话记忆功能
- [ ] 添加更多内置工具
- [ ] 支持多模态（图像、语音）
- [ ] 添加测试用例
- [ ] 性能优化
- [ ] 用户认证功能
- [ ] 代码复制功能
- [ ] 对话导出功能

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 [MIT License](https://github.com/shuyixiao-better/shuyixiao-agent/blob/main/LICENSE)，可自由使用、修改和分发。

## 🙏 致谢

- [LangGraph](https://github.com/langchain-ai/langgraph) - 优秀的 Agent 框架
- [LangChain](https://github.com/langchain-ai/langchain) - 强大的 LLM 工具库
- [码云 AI](https://ai.gitee.com/) - 提供模型 API 服务

## 📧 联系方式

- **作者**：舒一笑不秃头
- **邮箱**：yixiaoshu88@163.com
- **GitHub**：[@shuyixiao-better](https://github.com/shuyixiao-better)
- **Gitee**：[@shuyixiao-only](https://gitee.com/shuyixiao-only)

---

**如果这个项目对你有帮助，请给个 Star ⭐！**

开始你的 AI Agent 之旅吧！ 🚀

