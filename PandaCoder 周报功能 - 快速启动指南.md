# PandaCoder 周报功能 - 快速启动指南

## 🎯 5 分钟快速上手

### 前置条件

- ✅ PandaCoder-Vault 项目已克隆到本地
- ✅ MongoDB 已安装并运行
- ✅ Node.js 和 Java 环境已配置

---

## 📝 本地开发测试

### 步骤 1: 启动 PandaCoder-Vault 服务

**终端 1 - 启动后端**:
```bash
cd PandaCoder-Vault/backend
./start-backend.sh
```

等待看到：
```
✅ 后端服务启动成功: http://localhost:8080
```

**终端 2 - 启动前端**:
```bash
cd PandaCoder-Vault/frontend
npm install
npm run dev
```

等待看到：
```
✅ 前端服务启动成功: http://localhost:5174
```

### 步骤 2: 配置博客项目

**终端 3 - 配置环境变量**:
```bash
cd shuyixiao-studio

# 复制环境变量示例
cp .env.example .env

# 编辑 .env 文件（已经有默认配置，无需修改）
# PANDACODER_FRONTEND_URL=http://localhost:5174
# PANDACODER_BACKEND_URL=http://localhost:8080
```

### 步骤 3: 启动博客项目

**方式 A: 使用 Netlify Dev（推荐）**
```bash
# 安装 Netlify CLI（如果还没安装）
npm install -g netlify-cli

# 启动 Netlify Dev
netlify dev
```

访问: http://localhost:8888/tools/pandacoder-weekly/

**方式 B: 直接启动 VitePress**
```bash
# 设置环境变量
export PANDACODER_FRONTEND_URL=http://localhost:5174
export PANDACODER_BACKEND_URL=http://localhost:8080

# 启动开发服务器
pnpm docs:dev
```

访问: http://localhost:5173/tools/pandacoder-weekly/

### 步骤 4: 验证功能

1. 打开浏览器访问周报页面
2. 按 F12 打开开发者工具
3. 切换到 Network 标签
4. 刷新页面

**✅ 成功标志**:
- 页面正常显示 PandaCoder 周报内容
- Network 中只看到 `/api/pandacoder-proxy?...` 请求
- **看不到** `http://localhost:5174` 或 `http://localhost:8080`

---

## 🚀 生产环境部署

### Netlify 部署

#### 1. 配置环境变量

登录 [Netlify](https://app.netlify.com/)，进入你的站点：

1. **Site settings** → **Environment variables**
2. 点击 **Add a variable**
3. 添加以下变量：

```
PANDACODER_FRONTEND_URL = http://your-server-ip:5174
PANDACODER_BACKEND_URL = http://your-server-ip:8080
```

> 💡 **提示**: 将 `your-server-ip` 替换为你的实际服务器 IP 或域名

#### 2. 重新部署

1. **Deploys** → **Trigger deploy** → **Deploy site**
2. 等待部署完成
3. 访问: https://www.poeticcoder.com/tools/pandacoder-weekly/

---

### GitHub Pages 部署

#### 1. 配置 GitHub Secrets

进入 GitHub 仓库：

1. **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下 Secrets：

```
Name: PANDACODER_FRONTEND_URL
Secret: http://your-server-ip:5174

Name: PANDACODER_BACKEND_URL
Secret: http://your-server-ip:8080
```

#### 2. 推送代码触发部署

```bash
git add .
git commit -m "feat: 添加 PandaCoder 周报功能"
git push
```

#### 3. 访问页面

由于 GitHub Pages 不支持 Netlify Functions，访问时会自动显示跳转提示：

```
https://www.poeticcoder.cn/tools/pandacoder-weekly/
```

点击"访问 Netlify 版本"按钮跳转到 Netlify 部署。

---

## 🔍 故障排查

### 问题 1: 页面显示"服务未配置"

**原因**: 环境变量未正确配置

**解决**:
1. 检查 Netlify 环境变量是否已添加
2. 确认变量名拼写正确（区分大小写）
3. 重新部署站点

### 问题 2: 页面显示"服务暂时不可用"

**原因**: PandaCoder-Vault 服务未启动或无法访问

**解决**:
1. 检查 PandaCoder-Vault 前后端服务是否正常运行
2. 检查服务器防火墙是否开放端口
3. 检查 IP 地址和端口是否正确

### 问题 3: F12 能看到真实 IP

**原因**: 代理配置未生效

**解决**:
1. 确认使用的是 Netlify Dev 或 Netlify 部署
2. 检查 `pandacoder-proxy.mjs` 文件是否存在
3. 查看浏览器控制台是否有错误信息

### 问题 4: iframe 内容无法显示

**原因**: CORS 或 CSP 配置问题

**解决**:
1. 检查 PandaCoder-Vault 后端 CORS 配置
2. 检查浏览器控制台的错误信息
3. 确认 iframe sandbox 属性配置正确

---

## 📊 测试清单

部署完成后，按以下清单测试：

- [ ] 本地开发环境正常运行
- [ ] Netlify 环境变量已配置
- [ ] Netlify 部署成功
- [ ] 周报页面可以正常访问
- [ ] F12 看不到真实 IP 和端口
- [ ] GitHub Pages 显示跳转提示
- [ ] 周报数据正常加载
- [ ] 响应式设计在移动端正常

---

## 🎨 自定义配置

### 修改 iframe 高度

编辑 `docs/tools/pandacoder-weekly/index.md`:

```javascript
const iframeHeight = ref('1000px') // 修改默认高度
```

### 修改样式主题

编辑 `docs/tools/pandacoder-weekly/index.md` 的 `<style>` 部分，调整颜色和布局。

### 添加更多功能

在 `netlify/functions/pandacoder-proxy.mjs` 中添加自定义逻辑，如：
- 请求日志记录
- 访问频率限制
- 缓存优化

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [完整配置指南](./PANDACODER_WEEKLY_SETUP_GUIDE.md)
2. 查看 [可行性分析文档](./PANDACODER_WEEKLY_INTEGRATION_FEASIBILITY.md)
3. 检查浏览器控制台错误信息
4. 检查 Netlify 部署日志

---

**文档版本**: v1.0  
**最后更新**: 2025-11-10

