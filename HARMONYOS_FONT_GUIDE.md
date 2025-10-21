# 鸿蒙字体全局适配指南

## 📋 概述

本项目已成功适配 **鸿蒙字体 (HarmonyOS Sans)** 作为全局字体，提升整体视觉体验和可读性。

## ✨ 特性

- ✅ 使用鸿蒙字体简体中文版本 (HarmonyOS Sans SC)
- ✅ 通过 jsDelivr CDN 加载，确保快速访问
- ✅ 支持多种字重：Light (300)、Regular (400)、Medium (500)、Bold (700)
- ✅ 采用 WOFF2 格式，优化加载性能
- ✅ 使用 `font-display: swap` 策略，优化首屏渲染
- ✅ 代码块使用 JetBrains Mono 等宽字体

## 🎯 字体配置详情

### 1. 字体来源

鸿蒙字体通过以下 CDN 加载：
- **CDN 提供商**: jsDelivr
- **GitHub 源**: iCloudWorkGroup/HarmonyOS-Sans
- **格式**: WOFF2 (主要) + WOFF (备用)

### 2. 已配置的字重

| 字重 | 使用场景 | 文件 |
|------|---------|------|
| Light (300) | 辅助文本、说明文字 | HarmonyOS_Sans_SC_Light |
| Regular (400) | 正文内容、默认文本 | HarmonyOS_Sans_SC_Regular |
| Medium (500) | 小标题、强调文本 | HarmonyOS_Sans_SC_Medium |
| Bold (700) | 大标题、重要信息 | HarmonyOS_Sans_SC_Bold |

### 3. 字体回退策略

```css
font-family: 'HarmonyOS Sans', 
             -apple-system, 
             BlinkMacSystemFont, 
             'Segoe UI', 
             Roboto, 
             Oxygen, 
             Ubuntu, 
             Cantarell, 
             'Fira Sans', 
             'Droid Sans', 
             'Helvetica Neue', 
             sans-serif;
```

如果鸿蒙字体加载失败，系统将自动使用以下备选字体：
1. 苹果系统字体 (-apple-system)
2. Windows 系统字体 (Segoe UI)
3. Android 系统字体 (Roboto)
4. 其他常见系统字体

## 📁 文件修改说明

### 修改的文件

1. **docs/.vitepress/theme/custom.css**
   - 添加了 4 个 `@font-face` 规则，定义不同字重的鸿蒙字体
   - 更新了 CSS 变量 `--vp-font-family-base`
   - 添加了全局字体应用规则

2. **docs/.vitepress/config.mts**
   - 添加了 CDN 预连接，优化字体加载速度
   - 保留了 JetBrains Mono 字体用于代码显示
   - 添加了 DNS 预解析配置

## 🚀 性能优化

### 已实施的优化措施

1. **CDN 预连接**
   ```html
   <link rel="preconnect" href="https://cdn.jsdelivr.net">
   <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
   ```
   提前建立与 CDN 的连接，减少字体加载延迟。

2. **Font Display Swap**
   ```css
   font-display: swap;
   ```
   确保在字体加载期间先显示系统字体，避免文本不可见 (FOIT)。

3. **WOFF2 格式优先**
   - WOFF2 比 WOFF 小约 30%
   - 现代浏览器优先加载 WOFF2
   - 提供 WOFF 作为兼容性备选

## 🔧 本地字体部署（可选）

如果需要使用本地字体文件而非 CDN：

### 步骤 1: 下载字体文件

从以下任一来源下载鸿蒙字体：
- [华为官方](https://developer.harmonyos.com/cn/design/harmonyos-font)
- [GitHub 开源仓库](https://github.com/iCloudWorkGroup/HarmonyOS-Sans)

### 步骤 2: 放置字体文件

将字体文件放置到：
```
docs/public/fonts/
├── HarmonyOS_Sans_SC_Regular.woff2
├── HarmonyOS_Sans_SC_Regular.woff
├── HarmonyOS_Sans_SC_Bold.woff2
├── HarmonyOS_Sans_SC_Bold.woff
├── HarmonyOS_Sans_SC_Medium.woff2
├── HarmonyOS_Sans_SC_Medium.woff
├── HarmonyOS_Sans_SC_Light.woff2
└── HarmonyOS_Sans_SC_Light.woff
```

### 步骤 3: 修改 CSS

在 `docs/.vitepress/theme/custom.css` 中，将 CDN URL 替换为本地路径：

```css
@font-face {
  font-family: 'HarmonyOS Sans';
  src: url('/fonts/HarmonyOS_Sans_SC_Regular.woff2') format('woff2'),
       url('/fonts/HarmonyOS_Sans_SC_Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | WOFF2 支持 |
|--------|---------|-----------|
| Chrome | 36+ | ✅ |
| Firefox | 39+ | ✅ |
| Safari | 10+ | ✅ |
| Edge | 14+ | ✅ |
| IE | 9-11 | ❌ (使用 WOFF) |

## 🧪 测试验证

### 在本地测试

```bash
# 启动开发服务器
pnpm run docs:dev
```

然后在浏览器中：
1. 打开浏览器开发者工具 (F12)
2. 切换到 "Network" 标签
3. 过滤 "Font" 类型
4. 刷新页面
5. 确认看到 HarmonyOS Sans 字体文件加载成功

### 检查字体应用

在浏览器开发者工具中：
1. 选择任意文本元素
2. 查看 "Computed" 样式
3. 确认 `font-family` 包含 "HarmonyOS Sans"

## 📊 字体大小参考

字体文件大小（WOFF2 格式）：
- Regular: ~5-8 MB
- Bold: ~5-8 MB
- Medium: ~5-8 MB
- Light: ~5-8 MB

**总加载大小**: 约 20-32 MB（所有字重）

**实际加载**: 浏览器会根据使用的字重按需加载，而非一次性加载全部。

## 🎨 使用示例

### 在 Markdown 中

正常书写的中文和英文文本会自动使用鸿蒙字体：

```markdown
# 这是标题（Bold）
这是正文内容（Regular）
**这是加粗文本（Bold）**
```

### 在 Vue 组件中

```vue
<template>
  <div class="custom-text">
    使用鸿蒙字体显示
  </div>
</template>

<style scoped>
.custom-text {
  /* 默认继承全局字体配置 */
  font-weight: 500; /* Medium */
}
</style>
```

## 🔍 故障排除

### 问题 1: 字体未加载

**解决方案**:
1. 检查网络连接
2. 确认 CDN 可访问性
3. 查看浏览器控制台错误信息
4. 尝试使用本地字体文件

### 问题 2: 字体显示不正确

**解决方案**:
1. 清除浏览器缓存
2. 检查 CSS 变量是否正确设置
3. 验证 `font-family` 声明顺序

### 问题 3: 加载速度慢

**解决方案**:
1. 考虑使用本地字体文件
2. 优化字体文件大小（字体切片）
3. 使用不同的 CDN 服务

## 📝 注意事项

1. **版权**: 鸿蒙字体是华为开源字体，遵循相应开源协议
2. **更新**: CDN 使用 `@latest` 标签，会自动使用最新版本
3. **性能**: 首次加载时字体文件较大，后续访问会使用缓存
4. **定制**: 可根据需要调整字重或添加其他变体

## 🔗 相关资源

- [鸿蒙字体官方介绍](https://developer.harmonyos.com/cn/design/harmonyos-font)
- [GitHub 开源仓库](https://github.com/iCloudWorkGroup/HarmonyOS-Sans)
- [jsDelivr CDN](https://www.jsdelivr.com/)
- [VitePress 文档](https://vitepress.dev/)

## 🎉 效果展示

适配鸿蒙字体后，整个网站将呈现：
- ✨ 更加现代、简洁的视觉风格
- 📖 更好的中文阅读体验
- 🎯 统一的品牌视觉形象
- 💪 专业的技术博客形象

---

**最后更新**: 2025-10-21  
**维护者**: 舒一笑不秃头

