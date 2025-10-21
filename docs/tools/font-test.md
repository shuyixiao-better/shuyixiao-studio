---
title: 鸿蒙字体测试页面
description: 测试鸿蒙字体在不同场景下的显示效果
---

# 鸿蒙字体测试页面

本页面用于测试鸿蒙字体 (HarmonyOS Sans) 在各种场景下的显示效果。

## 字体展示

### 不同字重测试

<div style="font-weight: 300; font-size: 18px; margin: 16px 0;">
Light (300): 轻盈的鸿蒙字体，适合辅助说明文字 - The quick brown fox jumps over the lazy dog
</div>

<div style="font-weight: 400; font-size: 18px; margin: 16px 0;">
Regular (400): 标准鸿蒙字体，用于正文内容 - The quick brown fox jumps over the lazy dog
</div>

<div style="font-weight: 500; font-size: 18px; margin: 16px 0;">
Medium (500): 中等粗细的鸿蒙字体，用于小标题 - The quick brown fox jumps over the lazy dog
</div>

<div style="font-weight: 700; font-size: 18px; margin: 16px 0;">
Bold (700): 加粗的鸿蒙字体，用于标题和强调 - The quick brown fox jumps over the lazy dog
</div>

---

### 不同字号测试

<div style="font-size: 12px; margin: 8px 0;">
12px: 鸿蒙字体小字号测试 - HarmonyOS Sans Font Test
</div>

<div style="font-size: 14px; margin: 8px 0;">
14px: 鸿蒙字体常规字号测试 - HarmonyOS Sans Font Test
</div>

<div style="font-size: 16px; margin: 8px 0;">
16px: 鸿蒙字体默认字号测试 - HarmonyOS Sans Font Test
</div>

<div style="font-size: 18px; margin: 8px 0;">
18px: 鸿蒙字体中等字号测试 - HarmonyOS Sans Font Test
</div>

<div style="font-size: 24px; margin: 8px 0;">
24px: 鸿蒙字体大字号测试 - HarmonyOS Sans Font Test
</div>

<div style="font-size: 32px; margin: 8px 0;">
32px: 鸿蒙字体超大字号测试 - HarmonyOS Sans Font Test
</div>

---

## 中文内容测试

### 段落文本

这是一段使用鸿蒙字体显示的中文段落。鸿蒙字体（HarmonyOS Sans）是华为公司专门为鸿蒙操作系统设计的一款无衬线字体。这款字体不仅支持简体中文、繁体中文，还支持拉丁文、西里尔文、希腊文等多种文字系统，覆盖105种语言。

字体设计上追求简洁、现代、优雅的风格，特别注重在不同设备和不同分辨率下的显示效果。无论是在手机、平板还是电脑屏幕上，都能呈现出清晰、易读的文字效果。

### 常用标点符号

中文标点：，。！？；：""''《》「」【】（）……——

英文标点：,.!?;:""''<>[]()...-

特殊符号：@#¥%&*+-=×÷

---

## 英文内容测试

### Paragraph Text

This is a paragraph displayed using the HarmonyOS Sans font. HarmonyOS Sans is a sans-serif typeface specially designed by Huawei for the HarmonyOS operating system. This font not only supports Simplified Chinese and Traditional Chinese, but also supports Latin, Cyrillic, Greek and other writing systems, covering 105 languages.

The font design pursues a simple, modern and elegant style, with special attention to the display effect on different devices and different resolutions. Whether on mobile phones, tablets or computer screens, it can present clear and easy-to-read text effects.

### Typography Features

- **Bold Text**: This text uses bold weight (700)
- *Italic Text*: This is regular weight with italic style
- ***Bold Italic***: Combining bold and italic
- ~~Strikethrough~~: Text with strikethrough effect
- `Inline Code`: Using JetBrains Mono font

---

## 列表测试

### 无序列表

- 鸿蒙字体设计理念
  - 简洁明了
  - 现代优雅
  - 易读清晰
- 字体特性
  - 多语言支持
  - 多字重选择
  - 优秀的屏幕显示效果
- 应用场景
  - 网站界面
  - 移动应用
  - 桌面软件

### 有序列表

1. 下载鸿蒙字体文件
2. 添加 @font-face 声明
3. 配置全局字体样式
4. 测试字体加载效果
5. 优化字体性能

---

## 代码展示

### 行内代码

这是一段包含 `HarmonyOS Sans` 字体的文本，代码部分使用 `JetBrains Mono` 等宽字体。

### 代码块

```javascript
// 鸿蒙字体配置示例
const fontConfig = {
  fontFamily: 'HarmonyOS Sans',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  },
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto'
  ]
}

// 应用字体
document.body.style.fontFamily = fontConfig.fontFamily
```

```css
/* CSS 字体配置 */
@font-face {
  font-family: 'HarmonyOS Sans';
  src: url('/fonts/HarmonyOS_Sans_SC_Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'HarmonyOS Sans', -apple-system, sans-serif;
}
```

---

## 表格测试

| 字重 | 数值 | 使用场景 | 示例文字 |
|------|------|---------|---------|
| Light | 300 | 辅助说明 | 这是 Light 字重 |
| Regular | 400 | 正文内容 | 这是 Regular 字重 |
| Medium | 500 | 小标题 | 这是 Medium 字重 |
| Bold | 700 | 大标题 | 这是 Bold 字重 |

---

## 引用测试

> 鸿蒙字体是一款现代化的无衬线字体，专为数字时代的阅读体验而设计。
> 
> 它不仅美观，更注重实用性和可读性，是技术博客的理想选择。

> **注意**: 这是一段加粗的引用文字，用于强调重要信息。

---

## 混合内容测试

### 中英文混排

HarmonyOS Sans（鸿蒙字体）is a beautiful font 适合用于 modern websites and applications. 它支持 multiple languages 并且 display effect 非常出色。

在 2020 年，华为发布了 HarmonyOS 操作系统，同时推出了配套的 HarmonyOS Sans 字体家族。这标志着中国科技企业在 typography design 领域的重要突破。

### 数字和符号

电话：+86-138-0000-0000  
邮箱：contact@example.com  
网站：https://www.shuyixiao.top  
价格：¥199.00 / $29.99 / €25.99  
日期：2025-10-21 17:30:00  
版本：v1.0.0 → v2.0.0

---

## 特殊格式测试

### 上标和下标

H<sub>2</sub>O（水的化学式）  
E=mc<sup>2</sup>（爱因斯坦质能方程）

### 链接测试

- [鸿蒙字体官网](https://developer.harmonyos.com/cn/design/harmonyos-font)
- [GitHub 仓库](https://github.com/iCloudWorkGroup/HarmonyOS-Sans)
- [使用指南](./font-test)

### 强调测试

**这是加粗文字**  
*这是斜体文字*  
***这是加粗斜体***  
~~这是删除线~~

---

## 检查清单

使用浏览器开发者工具检查：

- [ ] 确认 `font-family` 包含 `HarmonyOS Sans`
- [ ] 验证字体文件已成功加载
- [ ] 检查不同字重是否正确应用
- [ ] 测试中英文混排效果
- [ ] 确认代码块使用等宽字体
- [ ] 验证字体回退机制

---

## 性能信息

打开浏览器开发者工具的 Network 面板，查看：

1. 字体文件加载时间
2. 字体文件大小
3. 是否使用了 WOFF2 格式
4. 字体加载策略 (font-display: swap)

---

<div style="text-align: center; margin: 40px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px;">
  <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700;">鸿蒙字体</h2>
  <p style="margin: 0; font-size: 16px; font-weight: 300;">HarmonyOS Sans - 为数字世界而生</p>
</div>

---

**测试完成提示**：如果你能清晰地看到上述所有文字，并且整体视觉效果舒适协调，说明鸿蒙字体已经成功应用到本站！

