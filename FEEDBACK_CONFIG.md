# 用户反馈功能配置指南

## 📋 功能说明

本网站集成了用户反馈功能，访客可以通过页面右下角的悬浮按钮给作者留言，反馈内容将通过邮件发送。

## 🔐 安全机制

所有敏感信息（邮箱账号、密码）通过**环境变量**存储，不会暴露在代码中，可以安全地推送到公开仓库。

## 📧 163 邮箱配置步骤

### 1. 开启 SMTP 服务

1. 登录 [163 邮箱](https://mail.163.com/)
2. 进入 **设置** → **POP3/SMTP/IMAP**
3. 开启 **IMAP/SMTP服务** 或 **POP3/SMTP服务**
4. 系统会要求你设置**授权密码**（注意：这不是你的登录密码！）
5. 按照提示完成手机验证，获取**授权密码**
6. **保存好这个授权密码**，配置时需要使用

### 2. SMTP 配置信息

```
SMTP 服务器: smtp.163.com
端口: 465 (SSL) 或 25 (非SSL，推荐使用 465)
加密方式: SSL/TLS
```

## ⚙️ 环境变量配置

### 本地开发环境

1. 在项目根目录创建 `.env` 文件（已在 `.gitignore` 中，不会提交到 Git）

```bash
# .env
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_USER=your-email@163.com
SMTP_PASS=你的授权密码（不是登录密码）
FEEDBACK_RECEIVER=your-email@163.com
```

2. 配置说明：
   - `SMTP_HOST`: SMTP 服务器地址
   - `SMTP_PORT`: SMTP 端口（465 使用 SSL）
   - `SMTP_USER`: 发件邮箱（你的 163 邮箱）
   - `SMTP_PASS`: 授权密码（在 163 邮箱设置中获取）
   - `FEEDBACK_RECEIVER`: 接收反馈的邮箱（可以是同一个邮箱）

### Netlify 部署环境

1. 登录 [Netlify](https://app.netlify.com/)
2. 选择你的站点
3. 进入 **Site settings** → **Environment variables**
4. 点击 **Add a variable** 添加以下环境变量：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `SMTP_HOST` | `smtp.163.com` | SMTP 服务器 |
| `SMTP_PORT` | `465` | SMTP 端口 |
| `SMTP_USER` | `your-email@163.com` | 你的 163 邮箱 |
| `SMTP_PASS` | `你的授权密码` | 在 163 设置中获取 |
| `FEEDBACK_RECEIVER` | `your-email@163.com` | 接收反馈的邮箱 |

5. 保存后，**重新部署站点**（Deploy → Trigger deploy）

### GitHub Actions 部署环境

如果你使用 GitHub Actions 部署到 GitHub Pages：

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret** 添加以下 Secrets：

| Secret 名称 | 值 |
|------------|-----|
| `SMTP_HOST` | `smtp.163.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `your-email@163.com` |
| `SMTP_PASS` | `你的授权密码` |
| `FEEDBACK_RECEIVER` | `your-email@163.com` |

4. 在 GitHub Actions 工作流文件中引用这些 secrets（如需要）

## 🧪 本地测试

1. 配置好 `.env` 文件
2. 启动开发服务器：
   ```bash
   pnpm docs:dev
   ```
3. 打开网站，点击右下角的反馈按钮
4. 填写反馈内容并提交
5. 检查你的邮箱是否收到反馈邮件

## 🚀 功能特性

- ✅ 悬浮按钮：页面右下角，自动隐藏/显示
- ✅ 精美弹窗：现代化 UI 设计
- ✅ 实时反馈：提交时显示加载动画
- ✅ 防刷机制：每个 IP 每分钟最多 3 次提交
- ✅ 输入验证：邮箱格式、内容长度等校验
- ✅ 安全防护：输入清理、XSS 防护
- ✅ 响应式设计：移动端友好
- ✅ 暗色模式：自动适配主题

## 🎨 自定义样式

如需调整悬浮按钮位置或样式，编辑：
```
docs/.vitepress/theme/components/FeedbackWidget.vue
```

关键样式类：
- `.feedback-button`: 悬浮按钮
- `.feedback-modal`: 弹窗主体
- `.feedback-form`: 表单样式

## ⚠️ 常见问题

### 1. 提交后没有收到邮件

**可能原因：**
- 环境变量配置错误
- SMTP 授权密码错误（注意不是登录密码）
- 163 邮箱未开启 SMTP 服务
- 邮件被放入垃圾箱

**解决方法：**
1. 检查 Netlify 环境变量是否正确
2. 确认使用的是**授权密码**，不是登录密码
3. 检查 163 邮箱 SMTP 服务是否开启
4. 查看垃圾邮件箱

### 2. 提示 "SMTP认证失败"

**原因：** SMTP_USER 或 SMTP_PASS 配置错误

**解决：**
1. 重新获取 163 邮箱授权密码
2. 更新 Netlify 环境变量
3. 重新部署站点

### 3. 提示 "配置错误"

**原因：** 环境变量未设置或部分缺失

**解决：**
1. 确保所有 5 个环境变量都已配置
2. 检查变量名是否拼写正确
3. Netlify 重新部署

### 4. 提交过于频繁

系统设置了防刷机制：每个 IP 每分钟最多 3 次提交。

如需调整，编辑：
```javascript
// netlify/functions/feedback.mjs
const RATE_LIMIT_WINDOW = 60000; // 时间窗口（毫秒）
const MAX_SUBMISSIONS = 3; // 最大提交次数
```

## 📊 查看反馈记录

所有反馈邮件会发送到 `FEEDBACK_RECEIVER` 指定的邮箱，包含以下信息：

- 用户姓名（选填）
- 邮箱地址（选填）
- 联系方式（选填）
- 反馈内容
- 文章标题
- 文章链接
- 提交时间
- IP 地址

## 🔒 安全建议

1. ✅ **定期更换授权密码**
2. ✅ **不要在代码中硬编码敏感信息**
3. ✅ **定期检查邮箱安全设置**
4. ✅ **监控异常访问和提交**
5. ✅ **备份重要反馈邮件**

## 📝 其他邮箱配置

除了 163 邮箱，也支持其他邮箱服务：

### QQ 邮箱
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your-email@qq.com
SMTP_PASS=QQ邮箱授权码
```

### Gmail
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=应用专用密码
```

### 企业邮箱
根据你的邮箱服务商提供的 SMTP 配置进行设置。

## 🆘 技术支持

如遇问题，请检查：

1. **浏览器控制台**：查看前端错误信息
2. **Netlify Functions 日志**：
   - 进入 Netlify 后台
   - Functions → feedback → Logs
3. **环境变量**：确认所有变量已正确配置

## 📚 相关文件

- **后端函数**: `netlify/functions/feedback.mjs`
- **前端组件**: `docs/.vitepress/theme/components/FeedbackWidget.vue`
- **主题集成**: `docs/.vitepress/theme/index.js`
- **本配置**: `FEEDBACK_CONFIG.md`

---

**注意**：环境变量配置完成后，记得**重新部署**站点才能生效！

