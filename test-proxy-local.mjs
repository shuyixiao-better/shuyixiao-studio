#!/usr/bin/env node

/**
 * 本地测试代理功能
 */

const PANDACODER_FRONTEND_URL = 'http://81.69.17.52';
const PANDACODER_BACKEND_URL = 'http://81.69.17.52:8080';

console.log('🧪 测试代理功能\n');

// 测试获取前端页面
console.log('📥 获取前端页面...');
try {
  const response = await fetch(PANDACODER_FRONTEND_URL);
  const html = await response.text();
  
  console.log(`✅ 状态: ${response.status}`);
  console.log(`📄 HTML 长度: ${html.length} 字符`);
  console.log(`📋 前 200 字符:\n${html.substring(0, 200)}\n`);
  
  // 检查是否包含 script 标签
  const scriptMatches = html.match(/<script[^>]*>/gi);
  console.log(`🔍 找到 ${scriptMatches ? scriptMatches.length : 0} 个 script 标签`);
  
} catch (error) {
  console.log(`❌ 错误: ${error.message}`);
}

console.log('\n✅ 测试完成');

