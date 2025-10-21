# 🎨 鸿蒙字体本地加载配置指南

## 📋 概述

本项目已将鸿蒙字体配置从 CDN 加载改为**本地加载**，解决了 CDN 跨域 (CORS) 错误导致的字体加载失败问题。

## ✅ 完成的修改

### 1. 字体文件复制

创建了 `scripts/copy-fonts.mjs` 脚本，将鸿蒙字体文件从项目根目录复制到 VitePress 的 public 目录：

**源路径：**
```
HarmonyOS-font/HarmonyOS Sans 字体/HarmonyOS_SansSC/
```

**目标路径：**
```
docs/public/fonts/HarmonyOS_SansSC/
```

**复制的字体文件：**
- ✅ HarmonyOS_SansSC_Light.ttf (Light 300)
- ✅ HarmonyOS_SansSC_Regular.ttf (Regular 400)
- ✅ HarmonyOS_SansSC_Medium.ttf (Medium 500)
- ✅ HarmonyOS_SansSC_Bold.ttf (Bold 700)

### 2. CSS 配置更新

修改了 `docs/.vitepress/theme/custom.css` 文件，将字体引用从 CDN URL 改为本地路径：

**修改前（CDN加载 - 有CORS问题）：**
```css
@font-face {
  font-family: 'HarmonyOS Sans';
  src: url('https://cdn.jsdelivr.net/gh/iCloudWorkGroup/HarmonyOS-Sans@latest/packages/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_Regular.woff2') format('woff2');
  /* ... */
}
```

**修改后（本地加载 - 无CORS问题）：**
```css
@font-face {
  font-family: 'HarmonyOS Sans';
  src: url('/fonts/HarmonyOS_SansSC/HarmonyOS_SansSC_Regular.ttf') format('truetype');
  /* ... */
}
```

### 3. VitePress 配置清理

移除了 `docs/.vitepress/config.mts` 中不再需要的 CDN 预连接配置：

```typescript
// 已移除：
// ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }],
// ['link', { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }],
```

## 🚀 使用方法

### 首次配置或字体文件丢失时

如果 `docs/public/fonts/HarmonyOS_SansSC/` 目录下的字体文件丢失，运行以下命令重新复制：

```bash
node scripts/copy-fonts.mjs
```

### 开发环境启动

```bash
pnpm run docs:dev
```

### 生产环境构建

```bash
pnpm run docs:build
```

## 📁 文件结构

```
shuyixiao-studio/
├── HarmonyOS-font/                    # 原始字体文件（源）
│   └── HarmonyOS Sans 字体/
│       └── HarmonyOS_SansSC/
│           ├── HarmonyOS_SansSC_Light.ttf
│           ├── HarmonyOS_SansSC_Regular.ttf
│           ├── HarmonyOS_SansSC_Medium.ttf
│           └── HarmonyOS_SansSC_Bold.ttf
│
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts                 # ✅ 移除了 CDN 预连接
│   │   └── theme/
│   │       └── custom.css             # ✅ 更新为本地字体路径
│   └── public/
│       └── fonts/                     # 公共字体目录（目标）
│           └── HarmonyOS_SansSC/
│               ├── HarmonyOS_SansSC_Light.ttf
│               ├── HarmonyOS_SansSC_Regular.ttf
│               ├── HarmonyOS_SansSC_Medium.ttf
│               └── HarmonyOS_SansSC_Bold.ttf
│
└── scripts/
    └── copy-fonts.mjs                 # ✅ 字体复制脚本
```

## ✨ 优势

### 1. 解决 CORS 问题
- ❌ **之前**：CDN 加载可能遇到跨域限制
- ✅ **现在**：本地加载，无跨域问题

### 2. 加载速度更快
- ❌ **之前**：依赖外部 CDN，可能受网络影响
- ✅ **现在**：本地资源，加载更快更稳定

### 3. 离线可用
- ❌ **之前**：没有网络时字体无法加载
- ✅ **现在**：完全离线可用

### 4. 部署更可控
- ❌ **之前**：依赖第三方 CDN 服务
- ✅ **现在**：字体随项目一起部署，完全可控

## 🔧 故障排除

### 字体未显示

1. **检查字体文件是否存在：**
   ```bash
   ls docs/public/fonts/HarmonyOS_SansSC/
   ```

2. **重新复制字体文件：**
   ```bash
   node scripts/copy-fonts.mjs
   ```

3. **清除浏览器缓存并刷新页面**

### 开发环境字体不生效

1. **重启开发服务器：**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   pnpm run docs:dev
   ```

2. **检查浏览器控制台是否有错误**

## 📝 注意事项

1. **字体文件大小**：每个 TTF 字体文件约 5-10MB，4个文件总计约 20-40MB
2. **Git 跟踪**：字体文件已包含在仓库中（位于 `docs/public/fonts/`）
3. **部署配置**：Netlify 和 GitHub Pages 都会自动部署 `docs/public/` 目录下的所有文件

## 🎯 字体使用

字体会自动应用到全站，无需额外配置：

```css
/* 全局字体已在 custom.css 中配置 */
body {
  font-family: var(--vp-font-family-base);
  /* 即: 'HarmonyOS Sans', -apple-system, ... */
}
```

## 📅 更新记录

- **2025-10-21**: 将鸿蒙字体从 CDN 加载改为本地加载，解决 CORS 问题

---

**作者**: AI Assistant  
**项目**: 舒一笑不秃头的博客  
**状态**: ✅ 已完成并测试通过

