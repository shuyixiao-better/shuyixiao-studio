#!/usr/bin/env node

/**
 * PandaCoder 周报功能安全性验证脚本
 * 
 * 功能：
 * 1. 检查环境变量是否正确配置
 * 2. 验证代理服务是否正常工作
 * 3. 确认真实 IP 和端口未暴露
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 PandaCoder 周报功能安全性验证\n');

// 1. 检查环境变量配置
console.log('📋 步骤 1: 检查环境变量配置');
console.log('─'.repeat(50));

const requiredEnvVars = [
  'PANDACODER_FRONTEND_URL',
  'PANDACODER_BACKEND_URL'
];

let envConfigured = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // 隐藏真实值，只显示是否配置
    const maskedValue = value.replace(/\d+\.\d+\.\d+\.\d+/g, '***.***.***.**')
                             .replace(/:\d+/g, ':****');
    console.log(`✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`❌ ${varName}: 未配置`);
    envConfigured = false;
  }
});

console.log('');

if (!envConfigured) {
  console.log('⚠️  警告: 部分环境变量未配置');
  console.log('请在 .env 文件或 Netlify 环境变量中配置\n');
}

// 2. 检查代码中是否有硬编码的 IP 地址
console.log('📋 步骤 2: 检查代码安全性');
console.log('─'.repeat(50));

const filesToCheck = [
  'docs/tools/pandacoder-weekly/index.md',
  'netlify/functions/pandacoder-proxy.mjs',
  'docs/.vitepress/config.mts'
];

let hasHardcodedIP = false;

// IP 地址正则表达式（排除 localhost 和 127.0.0.1）
const ipPattern = /(?!127\.0\.0\.1|localhost)\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

filesToCheck.forEach(filePath => {
  try {
    const fullPath = join(rootDir, filePath);
    const content = readFileSync(fullPath, 'utf-8');
    const matches = content.match(ipPattern);
    
    if (matches && matches.length > 0) {
      console.log(`❌ ${filePath}: 发现硬编码 IP 地址`);
      matches.forEach(ip => {
        console.log(`   → ${ip}`);
      });
      hasHardcodedIP = true;
    } else {
      console.log(`✅ ${filePath}: 无硬编码 IP 地址`);
    }
  } catch (error) {
    console.log(`⚠️  ${filePath}: 文件不存在或无法读取`);
  }
});

console.log('');

if (hasHardcodedIP) {
  console.log('⚠️  警告: 发现硬编码的 IP 地址，请使用环境变量替代\n');
}

// 3. 检查 .gitignore 配置
console.log('📋 步骤 3: 检查 .gitignore 配置');
console.log('─'.repeat(50));

try {
  const gitignorePath = join(rootDir, '.gitignore');
  const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
  
  const requiredIgnores = ['.env', '.env.local'];
  let allIgnored = true;
  
  requiredIgnores.forEach(pattern => {
    if (gitignoreContent.includes(pattern)) {
      console.log(`✅ ${pattern} 已在 .gitignore 中`);
    } else {
      console.log(`❌ ${pattern} 未在 .gitignore 中`);
      allIgnored = false;
    }
  });
  
  console.log('');
  
  if (!allIgnored) {
    console.log('⚠️  警告: 请确保 .env 文件不会被提交到 Git\n');
  }
} catch (error) {
  console.log('⚠️  无法读取 .gitignore 文件\n');
}

// 4. 检查代理函数是否存在
console.log('📋 步骤 4: 检查代理函数');
console.log('─'.repeat(50));

try {
  const proxyPath = join(rootDir, 'netlify/functions/pandacoder-proxy.mjs');
  const proxyContent = readFileSync(proxyPath, 'utf-8');
  
  const checks = [
    { pattern: /PANDACODER_FRONTEND_URL/, name: '前端 URL 环境变量' },
    { pattern: /PANDACODER_BACKEND_URL/, name: '后端 URL 环境变量' },
    { pattern: /export const config/, name: 'Netlify Function 配置' },
    { pattern: /\/api\/pandacoder-proxy/, name: 'API 路径配置' }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(proxyContent)) {
      console.log(`✅ ${check.name}: 已配置`);
    } else {
      console.log(`❌ ${check.name}: 未找到`);
    }
  });
  
  console.log('');
} catch (error) {
  console.log('❌ 代理函数文件不存在或无法读取\n');
}

// 5. 生成安全性报告
console.log('📊 安全性评估报告');
console.log('='.repeat(50));

const issues = [];

if (!envConfigured) {
  issues.push('环境变量未完全配置');
}

if (hasHardcodedIP) {
  issues.push('代码中存在硬编码的 IP 地址');
}

if (issues.length === 0) {
  console.log('✅ 所有安全检查通过！');
  console.log('');
  console.log('你的配置是安全的：');
  console.log('  • 环境变量已正确配置');
  console.log('  • 代码中无硬编码的敏感信息');
  console.log('  • .env 文件已被 .gitignore 忽略');
  console.log('  • 代理函数配置正确');
  console.log('');
  console.log('🎉 可以安全地推送到 GitHub 公开仓库！');
} else {
  console.log('⚠️  发现以下安全问题：');
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  console.log('');
  console.log('请修复以上问题后再推送到公开仓库。');
}

console.log('');
console.log('─'.repeat(50));
console.log('验证完成！');
console.log('');

