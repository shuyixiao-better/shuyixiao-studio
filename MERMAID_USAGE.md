# Mermaid 图表使用说明

## ✅ 最新配置（2025年1月）

项目已升级到最新版本并使用官方 Mermaid 插件，配置简单且稳定！

### 环境要求

- **Node.js 版本**: 22.16.0 或更高
- 使用 `nvm use 22.16.0` 切换到正确版本

### 已安装依赖

```json
{
  "devDependencies": {
    "vitepress": "^1.5.0",
    "vitepress-plugin-mermaid": "^2.0.0",
    "mermaid": "^11.12.0"
  }
}
```

## 启动项目

```bash
# 1. 切换到正确的 Node 版本
nvm use 22.16.0

# 2. 启动开发服务器
npm run docs:dev
```

服务器启动后访问：http://localhost:5173

## 在 Markdown 中使用 Mermaid

在 Markdown 文件中，直接使用 mermaid 代码块即可，**无需任何特殊配置**！

### 流程图示例

\`\`\`mermaid
graph TB
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[结果1]
    C -->|否| E[结果2]
    
    style A fill:#e1f5fe
    style D fill:#e8f5e8
    style E fill:#fff3e0
\`\`\`

### 时序图示例

\`\`\`mermaid
sequenceDiagram
    participant 客户端
    participant 服务器
    客户端->>服务器: 请求数据
    服务器-->>客户端: 返回数据
\`\`\`

### 类图示例

\`\`\`mermaid
classDiagram
    class 用户 {
        +String name
        +String email
        +login()
        +logout()
    }
\`\`\`

### 状态图示例

\`\`\`mermaid
stateDiagram-v2
    [*] --> 空闲
    空闲 --> 处理中: 开始处理
    处理中 --> 成功: 处理完成
    处理中 --> 失败: 出现错误
    成功 --> [*]
    失败 --> [*]
\`\`\`

## 自定义样式

可以在 Mermaid 代码中添加样式：

\`\`\`mermaid
graph TB
    A[节点A]
    B[节点B]
    C[节点C]
    A --> B
    B --> C
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
\`\`\`

## 配置说明

### VitePress 配置（.vitepress/config.js）

使用官方插件 `vitepress-plugin-mermaid`：

```javascript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    // ... 其他配置
    
    mermaid: {
      theme: 'default',
      themeVariables: {
        primaryColor: '#646cff',
        // ... 更多主题变量
      }
    }
  })
)
```

### 主题配置（.vitepress/theme/index.js）

使用插件后，主题配置非常简单：

```javascript
import DefaultTheme from 'vitepress/theme'
import './mermaid.css'

export default {
  extends: DefaultTheme
}
```

## 常见问题

### 1. 图表不显示

**解决方案**:
- 确保 Node 版本为 22.16.0: `node --version`
- 重启开发服务器: `Ctrl+C` 然后 `npm run docs:dev`
- 硬刷新浏览器: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (Mac)

### 2. 图表显示为代码

**原因**: Mermaid 插件未正确加载

**解决方案**:
- 检查是否正确安装了依赖: `npm install`
- 确保 `.vitepress/config.js` 中正确导入了 `withMermaid`
- 查看浏览器控制台是否有错误信息

### 3. 样式不生效

**解决方案**:
- 样式定义要放在 Mermaid 代码块的最后
- 使用正确的 CSS 颜色格式（如 `#e1f5fe`）
- 确保节点 ID 正确

## 相比旧版本的优势

✅ **自动渲染**: 不需要手动初始化  
✅ **稳定可靠**: 使用官方维护的插件  
✅ **本地加载**: 不依赖 CDN，避免网络问题  
✅ **配置简单**: 只需几行配置代码  
✅ **版本一致**: 使用最新版本的 Mermaid  
✅ **开发体验好**: 支持热更新，修改后自动刷新  

## 更多资源

- [Mermaid 官方文档](https://mermaid.js.org/)
- [Mermaid 在线编辑器](https://mermaid.live/)
- [VitePress Plugin Mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid)
- [VitePress 官方文档](https://vitepress.dev/)

## 技术支持

如果遇到问题，请提供：
1. Node.js 版本: `node --version`
2. 浏览器版本
3. 浏览器控制台的错误信息
4. Mermaid 代码示例
