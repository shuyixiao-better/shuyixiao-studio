---
layout: doc
title: 代码雨
description: 黑客帝国风格的代码雨动画效果
---

<script setup>
import CodeRain from './CodeRain.vue'
</script>

# 💚 代码雨

体验黑客帝国般的代码雨效果，让屏幕充满数字与字符的流动之美！

<CodeRain />

## ✨ 功能特点

- **多种主题**：提供经典绿色、蓝色科技、红色警戒、紫色梦幻、黄金时代、彩虹模式等6种炫酷主题
- **速度调节**：自由控制代码下落速度，从优雅缓慢到急速流动
- **密度控制**：调整代码密度，打造不同的视觉效果
- **全屏模式**：支持全屏沉浸式体验，完美解压
- **流畅动画**：基于Canvas的高性能渲染，丝滑流畅
- **多语言字符**：包含英文、数字、特殊符号和日文片假名

## 🎨 主题介绍

### 💚 经典绿色
致敬《黑客帝国》的经典绿色代码雨，最纯正的Matrix风格。

### 💙 蓝色科技
蓝色霓虹，科技感十足，适合展示未来感。

### ❤️ 红色警戒
红色警告风格，营造紧张刺激的氛围。

### 💜 紫色梦幻
紫色魅力，神秘而迷人的视觉体验。

### 💛 黄金时代
金色光芒，温暖而华丽的代码流。

### 🌈 彩虹模式
七彩变幻，色彩斑斓的视觉盛宴。

## 🎯 使用场景

- **休息放松**：工作间隙看看代码雨，放松眼睛和大脑
- **装逼利器**：全屏模式让你瞬间变身黑客高手
- **会议背景**：技术分享时的酷炫背景
- **屏保效果**：当作屏幕保护程序使用
- **氛围营造**：营造赛博朋克、科技感氛围

## 💡 使用提示

1. 选择你喜欢的主题颜色
2. 调整速度和密度到合适的参数
3. 点击"开始"按钮启动代码雨
4. 点击"全屏模式"获得沉浸式体验
5. 按 ESC 键或点击屏幕退出全屏

## 🎮 快捷操作

- **空格键**：暂停/继续（全屏模式下）
- **ESC键**：退出全屏
- **点击屏幕**：退出全屏

## 🔧 技术实现

使用 Vue 3 + Canvas API 实现，采用了以下技术特性：

- **高性能渲染**：使用 requestAnimationFrame 实现流畅动画
- **粒子系统**：每列代码独立控制，形成自然的雨滴效果
- **发光特效**：使用 shadowBlur 实现霓虹发光效果
- **拖尾效果**：通过半透明叠加实现代码拖尾
- **彩虹模式**：使用 HSL 色彩空间实现彩虹渐变

---

<div class="tool-footer">
  <p>💚 让代码雨带你进入 Matrix 的世界</p>
  <p class="quote">"Wake up, Neo... The Matrix has you..."</p>
</div>

<style scoped>
.tool-footer {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #000000, #001a00);
  border-radius: 12px;
  border: 1px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
}

.tool-footer p {
  margin: 0.5rem 0;
  color: #00ff00;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
}

.tool-footer .quote {
  font-style: italic;
  opacity: 0.8;
  font-size: 0.85rem;
  margin-top: 1rem;
}
</style>

