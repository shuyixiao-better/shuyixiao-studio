# Mermaid 图表渲染问题排查指南

## 🎉 问题已解决（2025年1月更新）

项目已升级使用官方 `vitepress-plugin-mermaid` 插件，之前的渲染问题已全部解决！

## 新版本配置

### 已完成的升级

✅ VitePress 升级到最新稳定版  
✅ 使用官方 `vitepress-plugin-mermaid` 插件  
✅ Mermaid 版本升级到 11.12.0  
✅ 移除了复杂的手动初始化代码  
✅ 使用本地包而不是 CDN  

### 当前配置文件

1. **package.json** - 依赖配置
2. **.vitepress/config.js** - VitePress 和 Mermaid 配置
3. **.vitepress/theme/index.js** - 简化的主题配置
4. **.vitepress/theme/mermaid.css** - 样式文件

## 快速启动

```bash
# 1. 确保使用正确的 Node 版本
nvm use 22.16.0

# 2. 安装依赖（如果是首次使用）
npm install

# 3. 启动开发服务器
npm run docs:dev
```

访问: http://localhost:5173/articles/microservice-communication

## 浏览器调试步骤

如果图表仍然无法显示，请按以下步骤排查：

### 1. 打开开发者工具

- Windows/Linux: `F12` 或 `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### 2. 检查 Console 标签

**正常情况**应该看到：
- VitePress 相关的启动信息
- 没有红色错误信息

**如果有错误**：
```javascript
// 常见错误及解决方案

// 错误: "Cannot find module 'vitepress-plugin-mermaid'"
// 解决: npm install

// 错误: "withMermaid is not a function"
// 解决: 检查 .vitepress/config.js 的导入语句

// 错误: "Mermaid syntax error"
// 解决: 在 https://mermaid.live/ 验证 Mermaid 语法
```

### 3. 检查 Elements 标签

查看页面 HTML 结构：

```html
<!-- 正确的渲染结果 -->
<div class="mermaid-wrapper">
  <svg>
    <!-- Mermaid 生成的 SVG 内容 -->
  </svg>
</div>

<!-- 如果看到这个，说明没有渲染 -->
<pre><code class="language-mermaid">
  graph TB
  ...
</code></pre>
```

### 4. 检查 Network 标签

确认资源加载：
- 所有 JavaScript 文件应该返回 200 状态码
- 不应该有 404 或 500 错误

## 常见问题解决

### 问题 1: 图表显示为代码块

**现象**: Mermaid 代码显示为普通代码，没有渲染成图表

**原因**: 
- VitePress 配置不正确
- 插件未正确导入

**解决方案**:

1. 检查 `.vitepress/config.js` 是否正确配置：

```javascript
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    // ... 配置
  })
)
```

2. 确保依赖已安装：
```bash
npm install -D vitepress-plugin-mermaid mermaid
```

3. 重启开发服务器

### 问题 2: 页面加载后图表不显示

**现象**: 页面正常加载，但 Mermaid 图表位置是空白

**解决方案**:

1. 硬刷新浏览器: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (Mac)
2. 清除浏览器缓存
3. 检查浏览器控制台是否有 JavaScript 错误
4. 尝试不同的浏览器（Chrome、Firefox、Safari）

### 问题 3: 部分图表渲染失败

**现象**: 某些 Mermaid 图表正常，某些显示错误

**原因**: Mermaid 语法错误

**解决方案**:

1. 在 [Mermaid Live Editor](https://mermaid.live/) 中验证语法
2. 检查中文字符是否正确
3. 确保没有特殊字符干扰
4. 查看浏览器控制台的详细错误信息

### 问题 4: Node 版本错误

**现象**: 启动时报错或构建失败

**解决方案**:

```bash
# 检查当前 Node 版本
node --version

# 应该显示: v22.16.0 或更高

# 如果不是，切换版本
nvm use 22.16.0

# 如果没有这个版本，安装它
nvm install 22.16.0
```

### 问题 5: 端口被占用

**现象**: 
```
Port 5173 is already in use
```

**解决方案**:

```bash
# 方案 1: 结束占用端口的进程
# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <进程ID> /F

# 方案 2: 使用不同端口
npm run docs:dev -- --port 5174
```

## 性能优化建议

### 1. 减少图表复杂度

如果图表渲染很慢：
- 简化节点数量
- 减少连接线数量
- 避免过度嵌套

### 2. 使用 CDN（生产环境）

构建生产版本时，Mermaid 会自动优化。

```bash
npm run docs:build
```

## 对比：新旧配置

### 旧配置（已废弃）❌

- 使用 CDN 加载 Mermaid
- 手动编写初始化代码
- 轮询检查 Mermaid 是否加载
- 手动渲染每个图表
- 配置复杂，易出错

### 新配置（推荐）✅

- 使用官方插件
- 自动初始化
- 本地包管理
- 自动渲染
- 配置简单，稳定可靠

## 手动测试

在浏览器 Console 中测试 Mermaid 是否可用：

```javascript
// 检查 Mermaid 版本
console.log('Mermaid version:', window.mermaid?.version)

// 手动渲染测试（仅用于调试）
if (window.mermaid) {
  const code = `graph TD
    A[测试] --> B[成功]`
  
  window.mermaid.render('test-id', code).then(result => {
    console.log('✅ Mermaid 渲染成功！')
    console.log(result.svg.substring(0, 100))
  }).catch(error => {
    console.error('❌ Mermaid 渲染失败:', error)
  })
} else {
  console.error('❌ Mermaid 未加载')
}
```

## 获取帮助

如果以上方法都无法解决问题，请提供以下信息：

1. **环境信息**:
   ```bash
   node --version
   npm --version
   ```

2. **浏览器信息**: 
   - 浏览器名称和版本
   - 操作系统

3. **错误信息**:
   - 完整的控制台错误日志
   - 截图

4. **Mermaid 代码**:
   - 无法渲染的 Mermaid 代码示例

5. **配置文件**:
   - `.vitepress/config.js` 内容
   - `package.json` 依赖列表

## 参考资源

- [VitePress 官方文档](https://vitepress.dev/)
- [VitePress Plugin Mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid)
- [Mermaid 官方文档](https://mermaid.js.org/)
- [Mermaid 在线编辑器](https://mermaid.live/)

---

**最后更新**: 2025年1月  
**配置状态**: ✅ 已优化完成
