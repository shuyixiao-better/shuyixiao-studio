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
  author: '境焕说AI',
  defaultTags: ['技术'], // 改为更通用的默认标签
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
  const lowerPath = filePath.toLowerCase();
  
  // 编程语言和框架
  if (lowerPath.includes('java')) tags.add('Java');
  if (lowerPath.includes('python')) tags.add('Python');
  if (lowerPath.includes('javascript') || lowerPath.includes('js/')) tags.add('JavaScript');
  if (lowerPath.includes('typescript') || lowerPath.includes('ts/')) tags.add('TypeScript');
  if (lowerPath.includes('rust')) tags.add('Rust');
  if (lowerPath.includes('go/') || lowerPath.includes('golang')) tags.add('Go');
  
  // 框架和技术栈
  if (lowerPath.includes('spring')) tags.add('Spring Boot');
  if (lowerPath.includes('react')) tags.add('React');
  if (lowerPath.includes('vue')) tags.add('Vue');
  if (lowerPath.includes('elasticsearch') || lowerPath.includes('/es/')) tags.add('Elasticsearch');
  
  // 算法相关
  if (lowerPath.includes('algorithm')) tags.add('算法');
  if (lowerPath.includes('leetcode')) tags.add('LeetCode');
  if (lowerPath.includes('backtracking')) tags.add('回溯算法');
  if (lowerPath.includes('dynamic-programming')) tags.add('动态规划');
  if (lowerPath.includes('greedy')) tags.add('贪心算法');
  if (lowerPath.includes('linked-list')) tags.add('链表');
  if (lowerPath.includes('tree')) tags.add('树');
  if (lowerPath.includes('graph')) tags.add('图');
  
  // 架构相关
  if (lowerPath.includes('architecture')) tags.add('系统架构');
  if (lowerPath.includes('microservice')) tags.add('微服务');
  if (lowerPath.includes('distributed')) tags.add('分布式');
  if (lowerPath.includes('high-concurrency')) tags.add('高并发');
  if (lowerPath.includes('design-pattern')) tags.add('设计模式');
  if (lowerPath.includes('ddd')) tags.add('领域驱动设计');
  
  // 安全和认证
  if (lowerPath.includes('security')) tags.add('安全');
  if (lowerPath.includes('auth')) tags.add('认证鉴权');
  if (lowerPath.includes('sso')) tags.add('单点登录');
  if (lowerPath.includes('oauth')) tags.add('OAuth');
  if (lowerPath.includes('jwt')) tags.add('JWT');
  if (lowerPath.includes('rbac')) tags.add('权限管理');
  if (lowerPath.includes('encryption')) tags.add('加密');
  
  // 性能和稳定性
  if (lowerPath.includes('performance')) tags.add('性能优化');
  if (lowerPath.includes('optimization')) tags.add('性能优化');
  if (lowerPath.includes('jvm')) tags.add('JVM调优');
  if (lowerPath.includes('monitoring')) tags.add('监控');
  if (lowerPath.includes('stability')) tags.add('系统稳定性');
  if (lowerPath.includes('rate-limit')) tags.add('限流降级');
  
  // 数据库和存储
  if (lowerPath.includes('database')) tags.add('数据库');
  if (lowerPath.includes('mysql')) tags.add('MySQL');
  if (lowerPath.includes('redis')) tags.add('Redis');
  if (lowerPath.includes('mongodb')) tags.add('MongoDB');
  if (lowerPath.includes('cache')) tags.add('缓存');
  
  // 消息队列和搜索
  if (lowerPath.includes('message-queue') || lowerPath.includes('mq')) tags.add('消息队列');
  if (lowerPath.includes('kafka')) tags.add('Kafka');
  if (lowerPath.includes('rabbitmq')) tags.add('RabbitMQ');
  if (lowerPath.includes('search-engine')) tags.add('搜索引擎');
  
  // 案例和实战
  if (lowerPath.includes('cases')) tags.add('项目实战');
  if (lowerPath.includes('ecommerce')) tags.add('电商系统');
  if (lowerPath.includes('payment')) tags.add('支付系统');
  if (lowerPath.includes('cms')) tags.add('内容管理');
  if (lowerPath.includes('social')) tags.add('社交平台');
  
  // 技术感悟和成长
  if (lowerPath.includes('insights')) tags.add('技术感悟');
  if (lowerPath.includes('career')) tags.add('职业发展');
  if (lowerPath.includes('growth')) tags.add('个人成长');
  if (lowerPath.includes('learning')) tags.add('学习方法');
  if (lowerPath.includes('entrepreneurship')) tags.add('创业思考');
  
  // 探索和实验
  if (lowerPath.includes('explorations')) tags.add('技术探索');
  if (lowerPath.includes('langgraph') || lowerPath.includes('agent')) tags.add('AI Agent');
  
  // 如果没有推断出任何标签，使用默认标签
  if (tags.size === 0) {
    return DEFAULT_CONFIG.defaultTags;
  }
  
  // 限制标签数量，最多5个
  const tagsArray = Array.from(tags);
  return tagsArray.slice(0, 5);
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

