# 用户反馈功能 - 快速启动指南 🚀

## ✨ 功能演示

访客可以通过页面右下角的**悬浮按钮**给作者留言，反馈内容会通过邮件发送到你的邮箱。

## 🎯 快速开始（3 步配置）

### 第 1 步：获取 163 邮箱授权密码

1. 登录 [163 邮箱](https://mail.163.com/)
2. **设置** → **POP3/SMTP/IMAP** → 开启 **IMAP/SMTP服务**
3. 按提示完成验证，获取**授权密码**（记住这个密码！）

### 第 2 步：配置 Netlify 环境变量

1. 登录 [Netlify](https://app.netlify.com/)
2. 选择站点 → **Site settings** → **Environment variables**
3. 添加以下 5 个变量：

```
SMTP_HOST = smtp.163.com
SMTP_PORT = 465
SMTP_USER = 你的163邮箱@163.com
SMTP_PASS = 第1步获取的授权密码
FEEDBACK_RECEIVER = 接收反馈的邮箱@163.com
```

### 第 3 步：重新部署

在 Netlify 后台点击 **Deploys** → **Trigger deploy** → **Deploy site**

## ✅ 完成！

访问你的网站，右下角会出现反馈按钮，点击即可测试。

## 📖 详细文档

完整配置说明请查看：[FEEDBACK_CONFIG.md](./FEEDBACK_CONFIG.md)

## 🔐 安全说明

- ✅ 所有敏感信息存储在环境变量中
- ✅ 代码可以安全推送到公开仓库
- ✅ `.env` 文件已在 `.gitignore` 中
- ✅ 授权密码不是登录密码，可以随时重置

## 🆘 遇到问题？

1. **没收到邮件** → 检查垃圾邮件箱
2. **认证失败** → 确认使用的是授权密码（不是登录密码）
3. **配置错误** → 检查所有 5 个环境变量是否都已设置
4. **其他问题** → 查看 [FEEDBACK_CONFIG.md](./FEEDBACK_CONFIG.md) 常见问题章节

## 📧 本地开发配置

在项目根目录创建 `.env` 文件：

```env
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_USER=your-email@163.com
SMTP_PASS=你的授权密码
FEEDBACK_RECEIVER=your-email@163.com
```

然后运行：
```bash
pnpm docs:dev
```

---

**提示**：配置完环境变量后，记得重新部署站点！

