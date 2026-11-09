import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 检查文件是否已有 frontmatter
 */
function hasFrontmatter(content) {
  return content.trim().startsWith('---');
}

/**
 * 提取第一个标题
 */
function extractFirstHeading(content) {
  const match = content.match(/^#+\s+(.+)$/m);
  if (match) {
    let title = match[1].trim();
    // 移除 markdown 格式
    title = title.replace(/\*\*(.+?)\*\*/g, '$1'); // 移除加粗
    title = title.replace(/\*(.+?)\*/g, '$1');     // 移除斜体
    title = title.replace(/`(.+?)`/g, '$1');       // 移除代码
    return title;
  }
  return null;
}

/**
 * 提取描述信息
 */
function extractDescription(content) {
  // 移除 frontmatter
  let contentWithoutFm = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  // 移除第一个标题
  contentWithoutFm = contentWithoutFm.replace(/^#+\s+.+\n+/m, '');
  
  // 查找第一段文字
  const lines = contentWithoutFm.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 跳过空行、图片、代码块等
    if (trimmed && 
        !trimmed.startsWith('![') && 
        !trimmed.startsWith('```') && 
        !trimmed.startsWith('>') && 
        !trimmed.startsWith('<')) {
      // 清理 markdown 格式
      let desc = trimmed
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1');
      
      // 限制长度
      if (desc.length > 100) {
        desc = desc.substring(0, 97) + '...';
      }
      return desc;
    }
  }
  return null;
}

/**
 * 根据内容推断标签
 */
function inferTags(content, filePath) {
  const tags = [];
  const contentLower = content.toLowerCase();
  
  // 根据关键词推断
  if (contentLower.includes('java') || contentLower.includes('spring')) {
    tags.push('Java');
  }
  if (contentLower.includes('python')) {
    tags.push('Python');
  }
  if (contentLower.includes('rag') || content.includes('检索增强')) {
    tags.push('RAG');
  }
  if (contentLower.includes('ai') || content.includes('人工智能') || contentLower.includes('agent')) {
    tags.push('AI');
  }
  if (contentLower.includes('idea') || content.includes('插件')) {
    tags.push('IDEA插件');
  }
  if (contentLower.includes('elasticsearch') || contentLower.includes('es')) {
    tags.push('Elasticsearch');
  }
  if (contentLower.includes('mybatis')) {
    tags.push('MyBatis');
  }
  if (contentLower.includes('git')) {
    tags.push('Git');
  }
  if (content.includes('架构') || contentLower.includes('architecture')) {
    tags.push('架构设计');
  }
  if (content.includes('微服务') || contentLower.includes('microservice')) {
    tags.push('微服务');
  }
  
  // 根据文件路径推断
  if (filePath.includes('tools') && !tags.includes('开发工具')) {
    tags.push('开发工具');
  }
  if (filePath.includes('tutorials') && !tags.includes('教程')) {
    tags.push('教程');
  }
  if (filePath.includes('projects') && !tags.includes('实战项目')) {
    tags.push('实战项目');
  }
  
  // 去重并限制数量
  return [...new Set(tags)].slice(0, 5);
}

/**
 * 生成 frontmatter
 */
function generateFrontmatter(title, description, tags = [], author = '境焕说AI') {
  let lines = ['---'];
  lines.push('layout: doc');
  lines.push(`title: ${title}`);
  if (description) {
    lines.push(`description: ${description}`);
  }
  if (tags.length > 0) {
    lines.push('tags:');
    tags.forEach(tag => lines.push(`  - ${tag}`));
  }
  if (author) {
    lines.push(`author: ${author}`);
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否已有 frontmatter
    if (hasFrontmatter(content)) {
      console.log(`⏭️  已有 frontmatter: ${filePath}`);
      return 'skip';
    }
    
    // 提取信息
    const title = extractFirstHeading(content);
    if (!title) {
      console.log(`⚠️  无法提取标题: ${filePath}`);
      return 'error';
    }
    
    let description = extractDescription(content);
    if (!description) {
      description = title;
    }
    
    const tags = inferTags(content, filePath);
    
    // 生成 frontmatter
    const frontmatter = generateFrontmatter(title, description, tags);
    const newContent = frontmatter + content;
    
    // 写回文件
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    console.log(`✅ 已添加: ${filePath}`);
    console.log(`   标题: ${title}`);
    if (tags.length > 0) {
      console.log(`   标签: ${tags.join(', ')}`);
    }
    return 'success';
    
  } catch (error) {
    console.log(`❌ 处理失败: ${filePath}`);
    console.log(`   错误: ${error.message}`);
    return 'error';
  }
}

/**
 * 递归查找所有 markdown 文件
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳过特定目录
      if (!['node_modules', '.git', '.vitepress'].includes(file)) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') && !['README.md', 'CHANGELOG.md'].includes(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * 主函数
 */
function main() {
  console.log('='.repeat(70));
  console.log('批量添加 Markdown Frontmatter');
  console.log('='.repeat(70));
  console.log();
  
  const docsDir = 'docs';
  if (!fs.existsSync(docsDir)) {
    console.log(`❌ 目录不存在: ${docsDir}`);
    return;
  }
  
  const mdFiles = findMarkdownFiles(docsDir);
  console.log(`📁 找到 ${mdFiles.length} 个 Markdown 文件\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  mdFiles.forEach(filePath => {
    const result = processFile(filePath);
    if (result === 'success') successCount++;
    else if (result === 'skip') skipCount++;
    else errorCount++;
    console.log();
  });
  
  console.log('='.repeat(70));
  console.log('处理完成！');
  console.log(`  ✅ 成功添加: ${successCount} 个文件`);
  console.log(`  ⏭️  已有跳过: ${skipCount} 个文件`);
  console.log(`  ❌ 处理失败: ${errorCount} 个文件`);
  console.log('='.repeat(70));
}

// 运行主函数
main();
