#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globby } from 'globby';

/**
 * 自动为 Markdown 文件添加 frontmatter
 * 使用方法：
 * 1. node scripts/add-frontmatter.mjs <文件路径>              - 处理单个文件
 * 2. node scripts/add-frontmatter.mjs --scan                 - 扫描所有缺少 frontmatter 的文件
 * 3. node scripts/add-frontmatter.mjs --dir <目录路径>       - 处理指定目录下的所有文件
 */

// 默认配置
const DEFAULT_CONFIG = {
  layout: 'doc',
  author: '舒一笑不秃头',
  defaultTags: ['算法', 'Java'],
};

/**
 * 从 Markdown 内容中提取标题
 */
function extractTitle(content) {
  // 尝试提取第一个 # 标题
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 如果没有找到，尝试提取第二级标题
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }
  
  return '未命名文档';
}

/**
 * 从 Markdown 内容中提取描述
 */
function extractDescription(content) {
  // 移除所有标题
  let cleanContent = content.replace(/^#+\s+.+$/gm, '');
  
  // 移除代码块
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '');
  
  // 移除行内代码
  cleanContent = cleanContent.replace(/`[^`]+`/g, '');
  
  // 移除图片和链接
  cleanContent = cleanContent.replace(/!\[.*?\]\(.*?\)/g, '');
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // 移除多余的空行和空格
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();
  
  // 提取第一段有意义的文本
  const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 0);
  
  if (paragraphs.length > 0) {
    let description = paragraphs[0].replace(/\n/g, ' ').trim();
    
    // 限制描述长度在 200 字符左右
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    
    return description;
  }
  
  return '暂无描述';
}

/**
 * 根据文件路径推断标签
 */
function inferTags(filePath) {
  const tags = new Set();
  
  // 根据路径推断标签
  if (filePath.includes('algorithm')) {
    tags.add('算法');
  }
  if (filePath.includes('java')) {
    tags.add('Java');
  }
  if (filePath.includes('spring')) {
    tags.add('Spring');
  }
  if (filePath.includes('es') || filePath.includes('elasticsearch')) {
    tags.add('Elasticsearch');
  }
  if (filePath.includes('microservice')) {
    tags.add('微服务');
  }
  if (filePath.includes('design-pattern')) {
    tags.add('设计模式');
  }
  if (filePath.includes('insights')) {
    tags.add('技术感悟');
  }
  if (filePath.includes('explorations')) {
    tags.add('探索');
  }
  
  // 如果没有推断出任何标签，使用默认标签
  if (tags.size === 0) {
    return DEFAULT_CONFIG.defaultTags;
  }
  
  return Array.from(tags);
}

/**
 * 生成 frontmatter
 */
function generateFrontmatter(content, filePath) {
  const title = extractTitle(content);
  const description = extractDescription(content);
  const tags = inferTags(filePath);
  const date = new Date().toISOString().split('T')[0];
  
  return {
    layout: DEFAULT_CONFIG.layout,
    title,
    description,
    date,
    tags,
    author: DEFAULT_CONFIG.author,
  };
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ 文件不存在: ${filePath}`);
      return false;
    }
    
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(fileContent);
    
    // 检查是否已有 frontmatter
    if (parsed.data && Object.keys(parsed.data).length > 0) {
      console.log(`ℹ️  文件已有 frontmatter，跳过: ${filePath}`);
      return false;
    }
    
    // 生成 frontmatter
    const frontmatter = generateFrontmatter(parsed.content, filePath);
    
    // 组合新内容
    const newContent = matter.stringify(parsed.content, frontmatter);
    
    // 写回文件
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    
    console.log(`✅ 成功添加 frontmatter: ${filePath}`);
    console.log(`   标题: ${frontmatter.title}`);
    console.log(`   标签: ${frontmatter.tags.join(', ')}`);
    console.log(`   描述: ${frontmatter.description.substring(0, 50)}...`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error(`❌ 处理文件失败: ${filePath}`);
    console.error(`   错误: ${error.message}`);
    return false;
  }
}

/**
 * 扫描目录中的所有 Markdown 文件
 */
async function scanDirectory(directory) {
  try {
    const pattern = path.join(directory, '**/*.md').replace(/\\/g, '/');
    const files = await globby(pattern, {
      ignore: ['**/node_modules/**'],
    });
    
    console.log(`📂 找到 ${files.length} 个 Markdown 文件\n`);
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const file of files) {
      const result = processFile(file);
      if (result) {
        processedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log('='.repeat(50));
    console.log(`📊 处理完成！`);
    console.log(`   ✅ 成功处理: ${processedCount} 个文件`);
    console.log(`   ⏭️  跳过: ${skippedCount} 个文件`);
  } catch (error) {
    console.error(`❌ 扫描目录失败: ${error.message}`);
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('使用方法：');
    console.log('  node scripts/add-frontmatter.mjs <文件路径>              - 处理单个文件');
    console.log('  node scripts/add-frontmatter.mjs --scan                 - 扫描 docs 目录下所有文件');
    console.log('  node scripts/add-frontmatter.mjs --dir <目录路径>       - 处理指定目录');
    console.log('');
    console.log('示例：');
    console.log('  node scripts/add-frontmatter.mjs docs/tutorials/algorithm/array-string/二进制求和.md');
    console.log('  node scripts/add-frontmatter.mjs --scan');
    console.log('  node scripts/add-frontmatter.mjs --dir docs/tutorials/algorithm');
    return;
  }
  
  const command = args[0];
  
  if (command === '--scan') {
    // 扫描整个 docs 目录
    await scanDirectory('docs');
  } else if (command === '--dir') {
    // 扫描指定目录
    if (args.length < 2) {
      console.error('❌ 请指定目录路径');
      return;
    }
    await scanDirectory(args[1]);
  } else {
    // 处理单个文件
    processFile(command);
  }
}

main();

