#!/bin/bash

# PandaCoder iframe 功能测试脚本
# 用于快速诊断 iframe 内嵌问题

echo "🔍 PandaCoder iframe 功能测试"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试 URL
SITE_URL="https://www.poeticcoder.com"
TEST_ENDPOINT="${SITE_URL}/api/pandacoder-test"
PROXY_ENDPOINT="${SITE_URL}/api/pandacoder-proxy?type=frontend&path=/"
PAGE_URL="${SITE_URL}/tools/pandacoder-weekly/"

echo "📍 测试站点: ${SITE_URL}"
echo ""

# 测试 1: 检查测试端点
echo "测试 1: 检查服务配置状态"
echo "------------------------"
HTTP_CODE=$(curl -s -o /tmp/pandacoder-test.json -w "%{http_code}" "${TEST_ENDPOINT}")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ 测试端点可访问 (HTTP $HTTP_CODE)${NC}"
    
    # 解析 JSON 输出
    if command -v jq &> /dev/null; then
        echo ""
        echo "环境变量配置:"
        jq '.environment' /tmp/pandacoder-test.json
        echo ""
        echo "连接测试结果:"
        jq '.tests' /tmp/pandacoder-test.json
    else
        echo ""
        cat /tmp/pandacoder-test.json
    fi
else
    echo -e "${RED}❌ 测试端点不可访问 (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# 测试 2: 检查代理端点
echo "测试 2: 检查代理服务"
echo "------------------------"
HTTP_CODE=$(curl -s -o /tmp/pandacoder-proxy.html -w "%{http_code}" "${PROXY_ENDPOINT}")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ 代理端点可访问 (HTTP $HTTP_CODE)${NC}"
    
    # 检查响应头
    echo ""
    echo "关键响应头:"
    curl -s -I "${PROXY_ENDPOINT}" | grep -E "(X-Frame-Options|Content-Security-Policy|Access-Control-Allow-Origin|Content-Type)"
    
    # 检查 HTML 内容
    if grep -q "<html" /tmp/pandacoder-proxy.html; then
        echo -e "${GREEN}✅ 返回了 HTML 内容${NC}"
    else
        echo -e "${YELLOW}⚠️  返回的不是 HTML 内容${NC}"
    fi
elif [ "$HTTP_CODE" = "503" ]; then
    echo -e "${RED}❌ 服务未配置 (HTTP $HTTP_CODE)${NC}"
    echo "请在 Netlify 后台配置环境变量："
    echo "  - PANDACODER_FRONTEND_URL"
    echo "  - PANDACODER_BACKEND_URL"
elif [ "$HTTP_CODE" = "502" ]; then
    echo -e "${RED}❌ 无法连接到 PandaCoder 服务 (HTTP $HTTP_CODE)${NC}"
    echo "请检查："
    echo "  1. PandaCoder 服务是否正在运行"
    echo "  2. IP 地址和端口是否正确"
    echo "  3. 防火墙是否允许访问"
else
    echo -e "${RED}❌ 代理端点返回错误 (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# 测试 3: 检查页面可访问性
echo "测试 3: 检查周报页面"
echo "------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${PAGE_URL}")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ 周报页面可访问 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ 周报页面不可访问 (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# 测试 4: 检查 X-Frame-Options
echo "测试 4: 检查 iframe 嵌入限制"
echo "------------------------"
X_FRAME_OPTIONS=$(curl -s -I "${PROXY_ENDPOINT}" | grep -i "X-Frame-Options" | cut -d' ' -f2- | tr -d '\r')

if [ -z "$X_FRAME_OPTIONS" ]; then
    echo -e "${GREEN}✅ 未设置 X-Frame-Options (允许 iframe 嵌入)${NC}"
elif [ "$X_FRAME_OPTIONS" = "ALLOWALL" ]; then
    echo -e "${GREEN}✅ X-Frame-Options: ALLOWALL (允许 iframe 嵌入)${NC}"
elif [ "$X_FRAME_OPTIONS" = "DENY" ]; then
    echo -e "${RED}❌ X-Frame-Options: DENY (禁止 iframe 嵌入)${NC}"
elif [ "$X_FRAME_OPTIONS" = "SAMEORIGIN" ]; then
    echo -e "${YELLOW}⚠️  X-Frame-Options: SAMEORIGIN (仅允许同源 iframe)${NC}"
else
    echo -e "${YELLOW}⚠️  X-Frame-Options: $X_FRAME_OPTIONS${NC}"
fi
echo ""

# 总结
echo "================================"
echo "📊 测试总结"
echo "================================"
echo ""
echo "下一步操作："
echo "1. 如果所有测试都通过，访问 ${PAGE_URL} 查看效果"
echo "2. 如果有测试失败，参考 PANDACODER_IFRAME_TROUBLESHOOTING.md 文档"
echo "3. 打开浏览器 F12 控制台查看详细错误信息"
echo ""
echo "🔗 相关链接："
echo "  - 周报页面: ${PAGE_URL}"
echo "  - 测试端点: ${TEST_ENDPOINT}"
echo "  - 代理端点: ${PROXY_ENDPOINT}"
echo ""

# 清理临时文件
rm -f /tmp/pandacoder-test.json /tmp/pandacoder-proxy.html

echo "✅ 测试完成"

