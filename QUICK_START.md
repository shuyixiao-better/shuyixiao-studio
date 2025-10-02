# 🚀 快速开始

## ✅ 问题已解决！

你的 Mermaid 图表渲染问题已经完全解决了！项目已升级到最新配置。

## 🎯 立即开始

### 1️⃣ 启动项目

```bash
# 确保使用 Node.js 22.16.0
nvm use 22.16.0

# 启动开发服务器
npm run docs:dev
```

### 2️⃣ 访问页面

在浏览器中打开：

- 📝 文章列表: http://localhost:5173/articles/
- 🔥 微服务通信文章: http://localhost:5173/articles/microservice-communication

### 3️⃣ 查看效果

你应该能看到漂亮的 Mermaid 流程图、时序图等可视化图表！

## 🔧 我们做了什么

### 升级内容

✅ **VitePress**: `2.0.0-alpha.12` → 最新稳定版  
✅ **Mermaid**: 添加官方插件 `vitepress-plugin-mermaid`  
✅ **配置**: 从复杂的手动配置改为简单的插件配置  
✅ **稳定性**: 从不稳定的 CDN 改为本地 npm 包  

### 配置变更

#### 旧配置（已移除）❌
- 使用 CDN 加载 Mermaid (不稳定)
- 100+ 行的手动初始化代码
- 轮询检查和手动渲染
- 容易出错

#### 新配置（已应用）✅
```javascript
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    mermaid: {
      theme: 'default'
      // 其他配置...
    }
  })
)
```

仅需几行代码，自动处理一切！

## 📝 如何使用 Mermaid

在任何 Markdown 文件中，直接使用 mermaid 代码块：

### 示例 1: 流程图

\`\`\`mermaid
graph TB
    A[开始] --> B[处理数据]
    B --> C{检查结果}
    C -->|成功| D[返回结果]
    C -->|失败| E[错误处理]
    
    style A fill:#e1f5fe
    style D fill:#e8f5e8
    style E fill:#ffebee
\`\`\`

### 示例 2: 时序图

\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库
    
    用户->>前端: 发起请求
    前端->>后端: API调用
    后端->>数据库: 查询数据
    数据库-->>后端: 返回数据
    后端-->>前端: 返回结果
    前端-->>用户: 显示数据
\`\`\`

### 示例 3: 类图

\`\`\`mermaid
classDiagram
    class User {
        +String username
        +String email
        +login()
        +logout()
    }
    
    class Order {
        +String orderId
        +Date createTime
        +pay()
        +cancel()
    }
    
    User "1" --> "N" Order : has
\`\`\`

## 🎨 自定义主题

可以在 `.vitepress/config.js` 中自定义 Mermaid 主题：

```javascript
mermaid: {
  theme: 'default', // 可选: default, dark, forest, neutral
  themeVariables: {
    primaryColor: '#646cff',
    primaryTextColor: '#fff',
    primaryBorderColor: '#646cff',
    lineColor: '#646cff'
  }
}
```

## 🐛 故障排查

### 问题：图表不显示

**解决方案**:
1. 硬刷新浏览器: `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)
2. 清除浏览器缓存
3. 重启开发服务器

### 问题：语法错误

**解决方案**:
- 访问 [Mermaid Live Editor](https://mermaid.live/) 验证你的 Mermaid 语法
- 查看浏览器控制台 (F12) 的错误信息

### 问题：Node 版本错误

**解决方案**:
```bash
# 检查版本
node --version  # 应该是 v22.16.0

# 切换版本
nvm use 22.16.0
```

## 📚 详细文档

- 📖 [Mermaid 使用说明](./MERMAID_USAGE.md) - 详细的使用指南
- 🔧 [问题排查指南](./TROUBLESHOOTING.md) - 深入的故障排查步骤

## 🌟 优势总结

### 新配置的优势

| 特性 | 旧配置 | 新配置 |
|------|--------|--------|
| 加载方式 | CDN (不稳定) | 本地 NPM 包 (稳定) |
| 初始化 | 手动 (100+ 行代码) | 自动 (插件处理) |
| 维护成本 | 高 (容易出错) | 低 (官方维护) |
| 渲染速度 | 中等 | 快速 |
| 开发体验 | 差 (经常需要刷新) | 好 (热更新) |
| 版本管理 | 混乱 (多个版本) | 统一 (package.json) |

## 🎉 现在可以愉快地写文档了！

你的 Mermaid 配置现在已经是**生产级别**的，稳定可靠：

- ✅ 自动渲染
- ✅ 热更新
- ✅ 性能优化
- ✅ 版本统一
- ✅ 易于维护

享受流畅的文档编写体验吧！🚀

---

**需要帮助？**
- 查看 [MERMAID_USAGE.md](./MERMAID_USAGE.md)
- 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 访问 [Mermaid 官方文档](https://mermaid.js.org/)

