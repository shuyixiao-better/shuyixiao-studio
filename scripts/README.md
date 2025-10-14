# 博客工具脚本

这个目录包含用于管理博客的各种实用脚本。

## 📝 add-frontmatter.mjs

自动为 Markdown 文件添加 frontmatter（前置元数据）。

### 功能特性

- ✨ 自动提取文章标题（从第一个 # 或 ## 标题）
- 📄 智能生成文章描述（从文章内容中提取）
- 🏷️ 根据文件路径自动推断标签
- 📅 自动添加当前日期
- 👤 添加作者信息
- 🔍 支持单文件处理、目录扫描、全局扫描

### 使用方法

#### 1. 处理单个文件

```bash
node scripts/add-frontmatter.mjs docs/tutorials/algorithm/array-string/二进制求和.md
```

#### 2. 扫描整个 docs 目录

```bash
node scripts/add-frontmatter.mjs --scan
```

这会自动扫描 `docs` 目录下所有的 Markdown 文件，并为没有 frontmatter 的文件添加。

#### 3. 处理指定目录

```bash
node scripts/add-frontmatter.mjs --dir docs/tutorials/algorithm
```

### Frontmatter 格式

脚本会生成如下格式的 frontmatter：

```yaml
---
layout: doc
title: 文章标题
description: 文章描述...
date: '2025-10-11'
tags:
  - 算法
  - Java
author: 舒一笑不秃头
---
```

### 智能标签推断

脚本会根据文件路径自动推断标签（支持 90+ 种路径关键词匹配）：

#### 编程语言和框架
| 路径关键词 | 推断标签 |
|-----------|---------|
| `java` | Java |
| `python` | Python |
| `rust` | Rust |
| `spring` | Spring Boot |
| `react` | React |
| `vue` | Vue |
| `elasticsearch` / `/es/` | Elasticsearch |

#### 算法相关
| 路径关键词 | 推断标签 |
|-----------|---------|
| `algorithm` | 算法 |
| `dynamic-programming` | 动态规划 |
| `backtracking` | 回溯算法 |
| `linked-list` | 链表 |
| `tree` | 树 |

#### 架构相关
| 路径关键词 | 推断标签 |
|-----------|---------|
| `architecture` | 系统架构 |
| `microservice` | 微服务 |
| `distributed` | 分布式 |
| `design-pattern` | 设计模式 |
| `ddd` | 领域驱动设计 |

#### 安全和认证
| 路径关键词 | 推断标签 |
|-----------|---------|
| `security` | 安全 |
| `auth` | 认证鉴权 |
| `sso` | 单点登录 |
| `oauth` | OAuth |
| `jwt` | JWT |
| `rbac` | 权限管理 |

#### 性能和稳定性
| 路径关键词 | 推断标签 |
|-----------|---------|
| `performance` / `optimization` | 性能优化 |
| `jvm` | JVM调优 |
| `monitoring` | 监控 |
| `rate-limit` | 限流降级 |

#### 数据库和存储
| 路径关键词 | 推断标签 |
|-----------|---------|
| `database` | 数据库 |
| `cache` | 缓存 |
| `redis` | Redis |
| `mysql` | MySQL |

#### 其他
| 路径关键词 | 推断标签 |
|-----------|---------|
| `message-queue` | 消息队列 |
| `insights` | 技术感悟 |
| `explorations` | 技术探索 |
| `agent` / `langgraph` | AI Agent |

> 📝 **智能特性**：
> - 自动限制标签数量为 5 个，避免标签过多
> - 如果无法推断出任何标签，使用默认标签：`['技术']`
> - 支持路径不区分大小写匹配

### 注意事项

⚠️ **重要提示**：
- 脚本只会处理**没有** frontmatter 的文件
- 如果文件已有 frontmatter，会自动跳过
- 建议在处理前先备份重要文件
- 生成的描述会自动截取文章前 200 字符

### 自定义配置

如果需要修改默认配置，可以编辑脚本中的 `DEFAULT_CONFIG` 对象：

```javascript
const DEFAULT_CONFIG = {
  layout: 'doc',              // 布局类型
  author: '舒一笑不秃头',      // 默认作者
  defaultTags: ['算法', 'Java'], // 默认标签
};
```

### 示例输出

```
✅ 成功添加 frontmatter: docs/tutorials/algorithm/array-string/二进制求和.md
   标题: 二进制字符串相加
   标签: 算法, Java
   描述: 我们需要将两个二进制字符串相加，并以二进制字符串的形式返回结果。二进制加法的规则类似于十进制加法...

📊 处理完成！
   ✅ 成功处理: 1 个文件
   ⏭️  跳过: 0 个文件
```

## 添加新脚本

欢迎添加更多实用脚本！确保：
- 使用 ES Module 语法（.mjs 扩展名）
- 添加清晰的注释和使用说明
- 在本 README 中添加文档

