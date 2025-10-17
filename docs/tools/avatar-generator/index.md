---
layout: doc
title: 头像生成器
description: 随机生成独特的个性头像，支持多种风格
---

<script setup>
import AvatarGenerator from './AvatarGenerator.vue'
</script>

# 🎨 头像生成器

轻松生成独特的个性头像，为你的社交账号增添色彩！

<AvatarGenerator />

## ✨ 功能特点

- **多种风格**：提供简约几何、彩色图形、像素艺术、渐变圆形等多种风格
- **随机生成**：一键生成独特的头像
- **自定义输入**：输入名字或ID生成专属头像
- **一键下载**：支持PNG/SVG格式下载
- **响应式设计**：完美适配各种设备

## 🎯 使用场景

- 社交媒体头像
- 论坛账号头像
- 游戏角色头像
- 临时测试头像
- 默认用户头像

## 💡 使用提示

1. 选择你喜欢的头像风格
2. 点击"随机生成"按钮或输入自定义文本
3. 预览生成的头像
4. 点击"下载头像"保存到本地

---

<div class="tool-footer">
  <p>✨ 所有生成的头像均为原创算法生成，可免费使用</p>
</div>

<style scoped>
.tool-footer {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.tool-footer p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}
</style>

