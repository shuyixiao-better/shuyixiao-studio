# 自定义域名配置指南

## 📋 当前配置

- **自定义域名**：`www.shuyixiao.top`
- **GitHub Pages URL**：`https://shuyixiao-better.github.io/shuyixiao-studio/`
- **最终访问URL**：`https://www.shuyixiao.top/`

## 🎯 配置步骤

### 步骤 1：配置 DNS 记录（在域名提供商处）

登录你的域名服务商（如阿里云、腾讯云等），添加以下 DNS 记录：

#### 方案 A：使用 CNAME 记录（推荐）

```
类型：CNAME
主机记录：www
记录值：shuyixiao-better.github.io
TTL：600（或默认值）
```

#### 方案 B：使用 A 记录（备选）

如果要使用根域名（shuyixiao.top），需要添加以下 A 记录：

```
类型：A
主机记录：@
记录值：185.199.108.153
TTL：600

类型：A  
主机记录：@
记录值：185.199.109.153
TTL：600

类型：A
主机记录：@
记录值：185.199.110.153
TTL：600

类型：A
主机记录：@
记录值：185.199.111.153
TTL：600
```

同时添加 www 的 CNAME：

```
类型：CNAME
主机记录：www
记录值：shuyixiao-better.github.io
TTL：600
```

### 步骤 2：推送代码到 GitHub

```bash
git push origin main
```

这会部署包含 CNAME 文件的新版本。

### 步骤 3：在 GitHub Pages 配置自定义域名

1. 访问仓库设置页面：
   ```
   https://github.com/shuyixiao-better/shuyixiao-studio/settings/pages
   ```

2. 在 **"Custom domain"** 部分：
   - 输入：`www.shuyixiao.top`
   - 点击 **Save**

3. 等待 DNS 检查通过（可能需要几分钟到24小时）

4. 检查通过后，**勾选 "Enforce HTTPS"**
   - 这会自动申请并配置 SSL 证书
   - 让你的网站支持 HTTPS 访问

### 步骤 4：验证配置

#### 检查 DNS 解析

```bash
# 检查 CNAME 记录
dig www.shuyixiao.top CNAME

# 或使用 nslookup
nslookup www.shuyixiao.top
```

应该看到指向 `shuyixiao-better.github.io`

#### 检查网站访问

等待 DNS 传播后（通常几分钟到1小时），访问：

```
https://www.shuyixiao.top
```

检查：
- ✅ 页面正常显示（不混乱）
- ✅ 样式正确加载
- ✅ 图片正常显示
- ✅ Favicon 显示笑脸 😊
- ✅ URL 栏显示绿色锁（HTTPS）

## 🔍 常见问题

### 问题 1：DNS 检查失败

**错误信息**：`Domain's DNS record could not be retrieved`

**解决方案**：
1. 确认 DNS 记录已正确添加
2. 等待 DNS 传播（最多 24 小时）
3. 清除本地 DNS 缓存：
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   ```
4. 使用在线工具检查：https://dnschecker.org/

### 问题 2：样式仍然混乱

**原因**：浏览器缓存了旧版本

**解决方案**：
1. 硬刷新浏览器：
   - Windows/Linux: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`
2. 清除浏览器缓存
3. 使用隐私模式访问

### 问题 3：HTTPS 不可用

**解决方案**：
1. 确保在 GitHub Pages 设置中勾选了 "Enforce HTTPS"
2. 等待 SSL 证书自动申请（可能需要几分钟）
3. 如果长时间不可用，取消勾选再重新勾选

### 问题 4：访问仍然显示 GitHub 默认域名

**解决方案**：
1. 确认 `docs/public/CNAME` 文件内容正确
2. 确认 GitHub Pages 设置中的自定义域名正确
3. 重新部署：
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

## 📊 域名状态检查

### 检查 DNS 传播状态

访问以下网站检查全球 DNS 传播情况：
- https://www.whatsmydns.net/
- https://dnschecker.org/

在搜索框输入 `www.shuyixiao.top`，选择 CNAME 类型。

### 检查 HTTPS 证书

访问网站后，点击浏览器地址栏的锁图标，查看证书详情：
- 签发者：Let's Encrypt（GitHub Pages 使用的证书）
- 有效期：90天（自动续期）

## 🌐 多域名配置（可选）

如果你想同时支持多个域名：

### 主域名重定向

可以设置 `shuyixiao.top`（根域名）重定向到 `www.shuyixiao.top`：

1. 在 DNS 中添加根域名的 A 记录（见步骤1 方案B）
2. GitHub Pages 会自动将根域名重定向到 www

### Netlify 自定义域名

如果 Netlify 也要使用自定义域名（如 `preview.shuyixiao.top`）：

1. 在 Netlify 控制台配置自定义域名
2. 添加 DNS 记录：
   ```
   类型：CNAME
   主机记录：preview
   记录值：your-site.netlify.app
   ```

## 🎯 最终效果

配置完成后：

| 访问方式 | URL | 跳转/显示 |
|---------|-----|----------|
| 自定义域名 | `https://www.shuyixiao.top/` | ✅ 直接访问 |
| GitHub 默认域名 | `https://shuyixiao-better.github.io/shuyixiao-studio/` | ⚠️ 可能重定向到自定义域名 |
| HTTP | `http://www.shuyixiao.top/` | 🔀 自动跳转到 HTTPS |

## 📝 配置文件说明

### CNAME 文件

位置：`docs/public/CNAME`

内容：
```
www.shuyixiao.top
```

**重要**：
- ✅ 只能包含一个域名
- ✅ 不要添加 `http://` 或 `https://`
- ✅ 不要添加尾部斜杠 `/`
- ✅ 构建时会自动复制到 `dist/` 目录

### VitePress 配置

位置：`docs/.vitepress/config.mts`

```typescript
// 自定义域名部署时使用根路径
const base = '/'
```

**重要**：
- ✅ 自定义域名必须使用 `base = '/'`
- ❌ 不要设置为 `/shuyixiao-studio/`（会导致样式混乱）

## 🔄 切换回默认域名

如果将来不使用自定义域名，需要：

1. **删除 CNAME 文件**：
   ```bash
   git rm docs/public/CNAME
   git commit -m "Remove custom domain"
   ```

2. **修改 base 配置**：
   ```typescript
   const base = '/shuyixiao-studio/'
   ```

3. **推送更改**：
   ```bash
   git push origin main
   ```

4. **在 GitHub Pages 设置中移除自定义域名**

## 📞 技术支持

- GitHub Pages 文档：https://docs.github.com/pages
- 自定义域名配置：https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
- DNS 配置帮助：咨询你的域名服务商

---

**提示**：DNS 传播需要时间，请耐心等待。通常在几分钟到1小时内完成，最多可能需要24小时。
