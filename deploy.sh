#!/bin/bash

# 文章统计功能 - Netlify部署脚本

echo "🚀 开始部署文章统计功能..."
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "📝 检测到未提交的更改，准备提交..."
  
  # 显示更改的文件
  echo ""
  echo "更改的文件："
  git status --short
  echo ""
  
  # 添加所有更改
  git add .
  
  # 提交更改
  echo "💾 提交更改..."
  git commit -m "fix: 使用Netlify Blobs修复统计功能持久化问题

- 替换文件系统存储为Netlify Blobs
- 添加@netlify/blobs依赖
- 更新所有Functions以支持云端持久化存储
- 清理不再需要的本地JSON文件
"
  
  echo "✅ 提交完成"
  echo ""
else
  echo "ℹ️  没有检测到未提交的更改"
  echo ""
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 推送成功！"
  echo ""
  echo "🎉 Netlify将自动开始部署..."
  echo ""
  echo "📋 接下来："
  echo "1. 访问 Netlify 控制台查看部署状态"
  echo "2. 部署完成后访问你的网站测试统计功能"
  echo "3. 访问 /admin/stats 查看管理面板"
  echo ""
  echo "💡 提示：部署通常需要1-3分钟"
else
  echo ""
  echo "❌ 推送失败，请检查错误信息"
  exit 1
fi

