# PandaCoder 周报功能配置指南

## 📋 功能说明

通过安全的代理方式，在博客中内嵌 PandaCoder 周报浏览功能，完全隐藏真实的服务器 IP 和端口信息。

### 🔒 安全特性

- ✅ **IP/端口完全隐藏**: 前端无法通过 F12 查看真实服务地址
- ✅ **环境变量配置**: 敏感信息不暴露在代码中
- ✅ **代理转发**: 所有请求通过 Netlify Functions 代理
- ✅ **双部署支持**: Netlify 和 GitHub Pages 自动识别
- ✅ **开源安全**: 代码可安全推送到公开仓库

---

## 🚀 快速开始

### 第一步：部署 PandaCoder-Vault 服务

#### 1.1 启动后端服务

```bash
cd PandaCoder-Vault/backend
./start-backend.sh
```

后端服务将在 `http://your-ip:8080` 启动

#### 1.2 启动前端服务

```bash
cd PandaCoder-Vault/frontend
npm install
npm run dev
```

前端服务将在 `http://your-ip:5174` 启动（注意：端口不要与博客冲突）

---

### 第二步：配置 Netlify 环境变量

#### 2.1 登录 Netlify

访问 [Netlify](https://app.netlify.com/) 并登录

#### 2.2 进入站点设置

1. 选择你的站点（shuyixiao-studio）
2. 点击 **Site settings**
3. 点击左侧菜单 **Environment variables**

#### 2.3 添加环境变量

点击 **Add a variable** 添加以下两个环境变量：

**变量 1: PANDACODER_FRONTEND_URL**
```
Key: PANDACODER_FRONTEND_URL
Value: http://your-server-ip:5174
```

**变量 2: PANDACODER_BACKEND_URL**
```
Key: PANDACODER_BACKEND_URL
Value: http://your-server-ip:8080
```

> ⚠️ **重要**: 
> - 将 `your-server-ip` 替换为你的实际服务器 IP 地址
> - 如果使用域名，格式为 `http://your-domain.com:port`
> - 确保端口号正确

#### 2.4 保存并重新部署

1. 点击 **Save** 保存环境变量
2. 进入 **Deploys** 标签
3. 点击 **Trigger deploy** → **Deploy site**

---

### 第三步：配置 GitHub Actions（可选）

如果你的博客也部署在 GitHub Pages，需要配置 GitHub Secrets。

#### 3.1 进入 GitHub 仓库设置

1. 打开你的 GitHub 仓库
2. 点击 **Settings**
3. 点击左侧 **Secrets and variables** → **Actions**

#### 3.2 添加 Secrets

点击 **New repository secret** 添加以下变量：

**Secret 1: PANDACODER_FRONTEND_URL**
```
Name: PANDACODER_FRONTEND_URL
Secret: http://your-server-ip:5174
```

**Secret 2: PANDACODER_BACKEND_URL**
```
Name: PANDACODER_BACKEND_URL
Secret: http://your-server-ip:8080
```

#### 3.3 修改 GitHub Actions 工作流

编辑 `.github/workflows/deploy.yml`，在构建步骤中添加环境变量：

```yaml
- name: Build with VitePress
  run: pnpm run docs:build
  env:
    PANDACODER_FRONTEND_URL: ${{ secrets.PANDACODER_FRONTEND_URL }}
    PANDACODER_BACKEND_URL: ${{ secrets.PANDACODER_BACKEND_URL }}
```

---

## 🔧 本地开发配置

### 方式一：使用 Netlify Dev（推荐）

```bash
# 1. 创建本地环境变量文件
cp .env.example .env

# 2. 编辑 .env 文件
# PANDACODER_FRONTEND_URL=http://localhost:5174
# PANDACODER_BACKEND_URL=http://localhost:8080

# 3. 启动 Netlify Dev
netlify dev
```

### 方式二：直接启动 VitePress

```bash
# 1. 设置环境变量（临时）
export PANDACODER_FRONTEND_URL=http://localhost:5174
export PANDACODER_BACKEND_URL=http://localhost:8080

# 2. 启动开发服务器
pnpm docs:dev
```

---

## 📂 文件结构

```
shuyixiao-studio/
├── netlify/
│   └── functions/
│       └── pandacoder-proxy.mjs        # 代理函数（核心）
├── docs/
│   └── tools/
│       └── pandacoder-weekly/
│           └── index.md                # 周报页面
├── .env.example                        # 环境变量示例
├── .env                                # 本地环境变量（不提交）
└── PANDACODER_WEEKLY_SETUP_GUIDE.md   # 本文档
```

---

## 🔍 工作原理

### 请求流程

```
用户浏览器
    ↓
博客页面 (/tools/pandacoder-weekly/)
    ↓
iframe (src="/api/pandacoder-proxy?type=frontend&path=/")
    ↓
Netlify Function (pandacoder-proxy.mjs)
    ↓ (读取环境变量)
    ↓ PANDACODER_FRONTEND_URL
    ↓
PandaCoder 前端服务 (http://your-ip:5174)
    ↓ (前端发起 API 请求)
    ↓
再次通过代理 (/api/pandacoder-proxy?type=api&path=/api/xxx)
    ↓
Netlify Function
    ↓ (读取环境变量)
    ↓ PANDACODER_BACKEND_URL
    ↓
PandaCoder 后端服务 (http://your-ip:8080)
```

### 安全机制

1. **环境变量隔离**: IP 和端口存储在 Netlify/GitHub 环境变量中
2. **代理转发**: 所有请求通过 Netlify Functions 转发
3. **URL 重写**: HTML 中的链接自动重写为代理 URL
4. **无痕迹**: F12 控制台只能看到 `/api/pandacoder-proxy`，看不到真实地址

---

## ✅ 验证配置

### 1. 检查环境变量

访问 Netlify 后台，确认环境变量已正确配置。

### 2. 测试代理服务

部署后，在浏览器中访问：

```
https://www.poeticcoder.com/api/pandacoder-proxy?type=frontend&path=/
```

如果返回 HTML 内容或 JSON，说明代理配置成功。

### 3. 访问周报页面

```
https://www.poeticcoder.com/tools/pandacoder-weekly/
```

应该能看到内嵌的 PandaCoder 周报页面。

### 4. F12 检查（验证安全性）

1. 打开浏览器开发者工具（F12）
2. 切换到 **Network** 标签
3. 刷新页面
4. 查看请求列表

✅ **正确**: 所有请求都是 `/api/pandacoder-proxy?...`  
❌ **错误**: 如果看到 `http://your-ip:xxxx`，说明配置有问题

---

## 🎯 环境识别逻辑

代码会自动识别部署环境：

| 域名 | 环境 | 行为 |
|------|------|------|
| `poeticcoder.cn` | GitHub Pages | 显示跳转提示 |
| `github.io` | GitHub Pages | 显示跳转提示 |
| `poeticcoder.com` | Netlify | 正常使用 |
| `shuyixiao.cn` | Netlify | 正常使用 |
| `netlify.app` | Netlify | 正常使用 |
| 其他 | 未知 | 尝试检测 API |


