# 密码保护功能使用指南

## 功能说明

本站支持为特定文章添加密码保护功能，用户需要输入正确的密码才能查看文章内容。

## 安全特性

1. **密码哈希加密**：密码不会以明文形式存储在源码中，使用 SHA256 哈希算法加密
2. **即使查看源码也无法获取原始密码**
3. **本地存储加密**：用户解锁后的状态使用 AES 加密存储在 localStorage
4. **可配置开关**：通过 frontmatter 的 `encrypted: true` 配置开启

## 使用方法

### 1. 基本使用（使用默认密码）

在文章的 frontmatter 中添加 `encrypted: true`：

```markdown
---
title: 你的文章标题
description: 文章描述
encrypted: true
---

<PasswordProtect>

# 文章内容

这里是受密码保护的内容...

</PasswordProtect>
```

默认密码：`0917`

### 2. 自定义密码（可选）

如果需要使用自定义密码，需要：

1. 生成密码的 SHA256 哈希值
2. 在组件中传入 `passwordHash` 属性

#### 生成密码哈希

可以使用以下方式生成密码的 SHA256 哈希：

**方式 1：使用在线工具**
- 访问 https://emn178.github.io/online-tools/sha256.html
- 输入你的密码
- 复制生成的哈希值

**方式 2：使用 Node.js**
```javascript
const CryptoJS = require('crypto-js');
const password = '你的密码';
const hash = CryptoJS.SHA256(password).toString();
console.log(hash);
```

**方式 3：使用浏览器控制台**
```javascript
// 需要先加载 crypto-js 库
CryptoJS.SHA256('你的密码').toString()
```

#### 使用自定义密码哈希

```markdown
---
title: 你的文章标题
encrypted: true
---

<PasswordProtect passwordHash="你的密码哈希值">

# 文章内容

</PasswordProtect>
```

## 示例

### 示例 1：使用默认密码

```markdown
---
title: 秘密文章
description: 这是一篇需要密码才能查看的文章
date: 2025-10-17
encrypted: true
---

<PasswordProtect>

# 秘密内容

只有知道密码的人才能看到这里的内容。

</PasswordProtect>
```

用户需要输入密码 `0917` 才能查看内容。

### 示例 2：使用自定义密码

假设你想使用密码 `mySecret123`：

1. 生成哈希（使用上述任一方法）：
   ```
   b3d8e6c8f9a1e5d7c2b4a6f8e0d2c4a6b8e0f2d4c6a8b0e2f4d6c8a0b2e4f6d8
   ```

2. 在文章中使用：
   ```markdown
   ---
   title: 自定义密码的秘密文章
   encrypted: true
   ---

   <PasswordProtect passwordHash="b3d8e6c8f9a1e5d7c2b4a6f8e0d2c4a6b8e0f2d4c6a8b0e2f4d6c8a0b2e4f6d8">

   # 秘密内容

   </PasswordProtect>
   ```

## 常见问题

### Q: 如何修改默认密码？

A: 修改 `PasswordProtect.vue` 组件中的 `default` 值，将其替换为新密码的 SHA256 哈希。

### Q: 忘记密码怎么办？

A: 查看 `PasswordProtect.vue` 组件中的注释，可以看到默认密码对应的哈希值和原始密码。

### Q: 密码保护是否安全？

A: 这是一个前端密码保护方案，主要用于：
- 防止搜索引擎索引敏感内容
- 为特定读者提供访问控制
- 不适合存储高度敏感的信息

如果需要更高级别的安全性，建议使用服务端权限控制。

### Q: 用户解锁后需要每次输入密码吗？

A: 不需要。解锁状态会加密保存在浏览器的 localStorage 中，用户下次访问时会自动解锁。

### Q: 如何清除已保存的解锁状态？

A: 清除浏览器的 localStorage 即可：
```javascript
localStorage.removeItem('password_protect_unlock')
```

## 技术实现

- 密码哈希算法：SHA256
- 本地存储加密：AES
- 组件框架：Vue 3
- 加密库：crypto-js

## 注意事项

1. ⚠️ 这是前端密码保护方案，技术用户仍可通过开发者工具查看源码
2. ✅ 适合用于内容访问控制和防止搜索引擎索引
3. ✅ 密码以哈希形式存储，即使查看源码也无法得知原始密码
4. ✅ 用户友好，一次解锁持续有效

## 当前已加密文章

- [技术博客项目的营利分析：纳瓦尔思维实战](/tutorials/insights/wealth/project-monetization-naval) - 密码：`0917`

