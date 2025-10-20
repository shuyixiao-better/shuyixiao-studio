# B站视频组件 - 使用示例集

本文档提供了 `<BilibiliVideo>` 组件的各种实际使用示例。

## 示例 1：在文章中嵌入演示视频

```markdown
# 我的项目介绍

这是一个很棒的项目，下面是功能演示视频：

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="项目功能完整演示"
/>

## 主要特性

- 特性 1
- 特性 2
```

---

## 示例 2：教程系列 - 多P视频

```markdown
# 完整教程系列

## 第一课：基础入门

<BilibiliVideo 
  url="BV1234567890"
  title="第一课：基础知识"
  :page="1"
/>

## 第二课：进阶技巧

<BilibiliVideo 
  url="BV1234567890"
  title="第二课：进阶应用"
  :page="2"
/>

## 第三课：实战项目

<BilibiliVideo 
  url="BV1234567890"
  title="第三课：项目实战"
  :page="3"
/>
```

---

## 示例 3：工具使用说明

```markdown
# 在线工具使用指南

## 快速上手

观看以下 2 分钟快速入门视频：

<BilibiliVideo 
  url="BV18VKhziE59"
  title="2分钟快速入门"
/>

## 详细操作步骤

1. 第一步：...
2. 第二步：...
3. 第三步：...

## 高级功能演示

<BilibiliVideo 
  url="BV18VKhziE59"
  title="高级功能完整演示"
/>
```

---

## 示例 4：版本更新日志

```markdown
# 版本更新日志

## v2.0.0 (2025-01-01)

### 新功能

- 功能 A
- 功能 B
- 功能 C

### 视频演示

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="v2.0.0 新功能演示"
/>

---

## v1.0.0 (2024-06-01)

### 首次发布

- 基础功能
- 核心特性

### 功能演示

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="v1.0.0 功能演示"
/>
```

---

## 示例 5：技术文章中的代码演示

```markdown
# Vue 3 组件开发实战

## 组件设计思路

在开始编码之前，我们先来看看最终效果：

<BilibiliVideo 
  url="BV18VKhziE59"
  title="组件最终效果演示"
/>

## 代码实现

\`\`\`vue
<template>
  <div>...</div>
</template>
\`\`\`

## 运行效果

上面的视频展示了组件的完整运行效果。
```

---

## 示例 6：FAQ 常见问题

```markdown
# 常见问题解答

## Q1: 如何安装插件？

**文字说明：**
1. 打开 IDE 的插件市场
2. 搜索插件名称
3. 点击安装

**视频演示：**

<BilibiliVideo 
  url="BV18VKhziE59"
  title="插件安装完整演示"
/>

## Q2: 如何配置 API Key？

**视频教程：**

<BilibiliVideo 
  url="BV18VKhziE59"
  title="API Key 配置教程"
/>
```

---

## 示例 7：课程目录页

```markdown
# Java 进阶课程

## 课程介绍

本课程涵盖 Java 高级特性...

<BilibiliVideo 
  url="BV18VKhziE59"
  title="课程介绍"
/>

## 课程大纲

### 第一章：多线程编程

<BilibiliVideo 
  url="BV11111111"
  title="第1章：多线程基础"
/>

### 第二章：JVM 原理

<BilibiliVideo 
  url="BV22222222"
  title="第2章：JVM 内存模型"
/>

### 第三章：性能优化

<BilibiliVideo 
  url="BV33333333"
  title="第3章：性能调优实战"
/>
```

---

## 示例 8：产品对比

```markdown
# 产品功能对比

## 我们的产品

**功能演示：**

<BilibiliVideo 
  url="BV18VKhziE59"
  title="我们的产品 - 完整功能演示"
/>

**核心优势：**
- 优势 1
- 优势 2
- 优势 3

## 竞品分析

详细对比视频：

<BilibiliVideo 
  url="BV44444444"
  title="产品功能对比分析"
/>
```

---

## 示例 9：活动宣传

```markdown
# 技术分享会

## 活动介绍

本次技术分享会将深入探讨...

## 往期回顾

### 第一期：微服务架构

<BilibiliVideo 
  url="BV55555555"
  title="第一期：微服务架构实践"
/>

### 第二期：容器化部署

<BilibiliVideo 
  url="BV66666666"
  title="第二期：Docker + K8s 实战"
/>

### 第三期：性能优化

<BilibiliVideo 
  url="BV77777777"
  title="第三期：高性能系统设计"
/>
```

---

## 示例 10：个人作品集

```markdown
# 我的作品集

## 项目一：电商系统

**技术栈：** Spring Boot + Vue 3 + MySQL

**项目演示：**

<BilibiliVideo 
  url="BV18VKhziE59"
  title="电商系统 - 功能演示"
/>

## 项目二：博客平台

**技术栈：** Next.js + PostgreSQL

**项目演示：**

<BilibiliVideo 
  url="BV88888888"
  title="博客平台 - 核心功能展示"
/>

## 项目三：智能助手

**技术栈：** Python + AI + FastAPI

**项目演示：**

<BilibiliVideo 
  url="BV99999999"
  title="AI 智能助手 - 完整演示"
/>
```

---

## 示例 11：自定义样式布局

```markdown
# 视频画廊

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin: 30px 0;">
  
  <div>
    <BilibiliVideo 
      url="BV11111111"
      title="视频 1"
    />
  </div>
  
  <div>
    <BilibiliVideo 
      url="BV22222222"
      title="视频 2"
    />
  </div>
  
  <div>
    <BilibiliVideo 
      url="BV33333333"
      title="视频 3"
    />
  </div>
  
</div>
```

---

## 示例 12：居中显示

```markdown
# 重点推荐视频

<div style="max-width: 800px; margin: 40px auto;">
  <BilibiliVideo 
    url="BV18VKhziE59"
    title="年度最佳技术分享"
  />
</div>

这个视频获得了超过 10 万的播放量，强烈推荐！
```

---

## 实用技巧

### 技巧 1：从 B站复制链接

1. 打开 B站视频页面
2. 点击分享按钮
3. 复制链接
4. 粘贴到组件的 `url` 参数

### 技巧 2：获取 BV 号

从链接 `https://www.bilibili.com/video/BV18VKhziE59/` 中，`BV18VKhziE59` 就是 BV 号。

### 技巧 3：多P视频

如果视频有多个分P，可以使用 `:page` 参数指定：

```markdown
<BilibiliVideo url="BV18VKhziE59" :page="2" />
```

### 技巧 4：自动播放（慎用）

```markdown
<BilibiliVideo url="BV18VKhziE59" :autoplay="true" />
```

注意：自动播放可能会影响用户体验，建议仅在必要时使用。

---

## 最佳实践

1. **添加标题**：总是为视频添加描述性标题
2. **位置合理**：在相关内容附近放置视频
3. **不要过多**：一个页面不要嵌入过多视频（建议 ≤ 3个）
4. **配合文字**：视频配合文字说明效果更好
5. **懒加载**：组件已自动使用懒加载，无需担心性能

---

## 更多示例

以上示例展示了组件的各种使用场景。你可以根据实际需求灵活组合使用。

**查看实际效果：** 访问 `/articles/panda-coder-intro` 页面查看组件在真实环境中的表现。

