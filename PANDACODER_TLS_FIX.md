# 🚨 PandaCoder TLS/SSL 连接错误修复指南

## 问题描述
在访问 `/tools/pandacoder-weekly/` 时，后端出现以下错误：
```
Error parsing HTTP request header
Invalid character found in method name [0x160x030x010x02...]
```

## 错误原因
这是一个典型的 TLS/SSL 握手错误。客户端尝试使用 HTTPS/TLS 连接，但服务器期望接收普通的 HTTP 请求，导致 TLS 握手数据被误认为 HTTP 请求。

## 解决方案

### 1. 在 Netlify 环境变量中添加 HTTPS 配置

1. 登录 [Netlify 后台](https://app.netlify.com/)
2. 选择你的站点 → Site settings → Environment variables
3. 添加以下环境变量：
   ```
   PANDACODER_FORCE_HTTPS = true
   ```
4. 点击保存并触发重新部署

### 2. 确认 PandaCoder 服务配置

检查你的 PandaCoder 服务是否支持 HTTPS：

1. **前端服务** (默认端口 5174)：
   - 确认前端服务是否配置了 SSL 证书
   - 如果配置了 SSL，确认是否监听 443 端口或指定的 HTTPS 端口

2. **后端服务** (默认端口 8080)：
   - 确认后端 Tomcat 是否配置了 SSL 连接器
   - 如果使用 Nginx 反向代理，确认 HTTPS 配置是否正确

### 3. 验证修复

部署完成后，访问以下端点测试：

1. **测试环境变量配置**：
   ```
   https://www.poeticcoder.com/api/pandacoder-test
   ```
   应该看到 `PANDACODER_FORCE_HTTPS` 已配置

2. **测试代理连接**：
   ```
   https://www.poeticcoder.com/api/pandacoder-proxy?type=frontend&path=/
   ```
   检查是否能正确返回前端 HTML

3. **访问周报页面**：
   ```
   https://www.poeticcoder.com/tools/pandacoder-weekly/
   ```
   确认页面内容正常加载

## 高级选项

如果默认 HTTP 端口不再可用，可以在 Netlify 环境变量中指定完整的 HTTPS URL：

```
PANDACODER_FRONTEND_URL = https://81.69.17.52:5173
PANDACODER_BACKEND_URL = https://81.69.17.52:8443
PANDACODER_FORCE_HTTPS = true
```

## 故障排除

### 问题 1：仍然出现 TLS 错误
- 检查 PandaCoder 服务是否真的支持 HTTPS
- 确认端口配置是否正确
- 检查防火墙是否允许 HTTPS 端口访问

### 问题 2：页面显示 502 Bad Gateway
- 确认 PandaCoder 服务正在运行
- 检查环境变量中的 URL 是否正确
- 使用 curl 测试服务是否可访问：
  ```bash
  curl -I https://81.69.17.52:5173
  curl -I https://81.69.17.52:8443
  ```

### 问题 3：访问速度很慢
- HTTPS 连接可能有额外的延迟
- 考虑使用 CDN 或优化服务器配置

## 相关文档

- [PandaCoder iframe 问题排查指南](./PANDACODER_IFRAME_TROUBLESHOOTING.md)
- [PandaCoder 周报功能快速启动指南](./PANDACODER_WEEKLY_QUICK_START.md)

---
更新时间：2025-11-18