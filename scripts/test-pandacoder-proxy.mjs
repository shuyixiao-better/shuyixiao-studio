#!/usr/bin/env node

/**
 * 测试 PandaCoder 代理功能
 */

const FRONTEND_URL = process.env.PANDACODER_FRONTEND_URL || 'http://81.69.17.52';
const BACKEND_URL = process.env.PANDACODER_BACKEND_URL || 'http://81.69.17.52:8080';

console.log('🧪 测试 PandaCoder 代理配置\n');

console.log('📋 配置信息:');
console.log(`  前端地址: ${FRONTEND_URL}`);
console.log(`  后端地址: ${BACKEND_URL}`);
console.log('');

// 测试前端连接
console.log('🔍 测试前端连接...');
try {
  const response = await fetch(FRONTEND_URL, { 
    method: 'HEAD',
    signal: AbortSignal.timeout(5000)
  });
  console.log(`✅ 前端连接成功: ${response.status} ${response.statusText}`);
  console.log(`   Content-Type: ${response.headers.get('content-type')}`);
} catch (error) {
  console.log(`❌ 前端连接失败: ${error.message}`);
}

console.log('');

// 测试后端连接
console.log('🔍 测试后端连接...');
try {
  const response = await fetch(BACKEND_URL, { 
    method: 'HEAD',
    signal: AbortSignal.timeout(5000)
  });
  console.log(`✅ 后端连接成功: ${response.status} ${response.statusText}`);
  console.log(`   Content-Type: ${response.headers.get('content-type')}`);
} catch (error) {
  console.log(`❌ 后端连接失败: ${error.message}`);
}

console.log('');
console.log('📝 测试完成！');
console.log('');
console.log('💡 提示:');
console.log('  1. 确保前端和后端服务都在运行');
console.log('  2. 在 Netlify 中配置环境变量:');
console.log('     PANDACODER_FRONTEND_URL=' + FRONTEND_URL);
console.log('     PANDACODER_BACKEND_URL=' + BACKEND_URL);
console.log('  3. 访问 https://你的域名/tools/pandacoder-weekly/ 查看效果');

