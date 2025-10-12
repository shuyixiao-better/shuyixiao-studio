# Netlify 开源计划要求检查清单

本文档用于跟踪 Netlify 开源计划申请所需的所有要求。

## ✅ 完成情况

### 1. ✅ 网站部署到 Netlify
**状态**：待完成  
**要求**：必须将网站部署到 Netlify 才能预览  
**操作**：
- 访问 [Netlify](https://www.netlify.com)
- 连接 GitHub 仓库
- 配置构建设置：
  - Build command: `npm run docs:build` 或 `pnpm run docs:build`
  - Publish directory: `docs/.vitepress/dist`
- 部署完成后，将网站 URL 发送给 Netlify 支持团队

### 2. ✅ 开源许可证
**状态**：已完成  
**要求**：包括 OSI 批准的许可证或 Creative Commons 许可证  
**文件**：`LICENSE`（MIT License）  
**位置**：项目根目录

### 3. ✅ 行为准则
**状态**：已完成  
**要求**：在项目根目录或文档中显著位置展示行为准则  
**文件**：`CODE_OF_CONDUCT.md`  
**位置**：项目根目录

### 4. ✅ Netlify 服务链接
**状态**：已完成  
**要求**：在主页或所有内部页面添加指向 Netlify 的链接  
**实现方式**：在网站页脚添加 "This site is powered by Netlify" 链接  
**位置**：`docs/.vitepress/config.mts` - footer 配置

### 5. ✅ 非商业项目
**状态**：符合  
**要求**：不得是商业项目，不包含商业支持和托管服务  
**说明**：这是一个个人技术博客，用于分享技术文章和学习笔记，符合开源项目要求

## 📋 后续步骤

1. **部署到 Netlify**
   ```bash
   # 确保项目可以正常构建
   npm run docs:build  # 或 pnpm run docs:build
   
   # 在 Netlify 上配置并部署
   ```

2. **回复 Netlify 支持团队**
   - Case #437053
   - 提供已部署的网站 URL
   - 说明已完成所有要求

3. **验证所有要求**
   - ✅ LICENSE 文件在根目录
   - ✅ CODE_OF_CONDUCT.md 文件在根目录
   - ✅ 页脚显示 Netlify 链接
   - ⏳ 网站已部署到 Netlify

## 📞 联系方式

如有问题，请通过以下方式联系 Netlify 支持：
- Case Number: 437053
- 回复支持邮件

## 🔗 相关链接

- [Netlify Open Source Program](https://www.netlify.com/legal/open-source-policy/)
- [OSI Approved Licenses](https://opensource.org/licenses)
- [Contributor Covenant](https://www.contributor-covenant.org/)

---

**最后更新时间**：2025-10-12

