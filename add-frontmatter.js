const fs = require('fs');
const path = require('path');

// 需要添加 frontmatter 的文件列表
const filesToProcess = [
  {
    path: 'docs/adsense-usage.md',
    frontmatter: {
      layout: 'doc',
      title: 'Google AdSense 广告使用指南',
      description: '介绍如何在文章中使用 Google AdSense 广告组件'
    }
  },
  {
    path: 'docs/articles/index.md',
    frontmatter: {
      layout: 'doc',
      title: '技术文章',
      description: '技术探索路上的点滴思考和实践经验'
    }
  },
  {
    path: 'docs/articles/adsense-demo.md',
    frontmatter: {
      layout: 'doc',
      title: 'Google AdSense 广告展示示例',
      description: '演示如何在文章中使用 Google AdSense 广告的示例文章',
      tags: ['AdSense', '广告', '示例'],
      author: '舒一笑不秃头'
    }
  },
  {
    path: 'docs/articles/elasticsearch-log-info.md',
    frontmatter: {
      layout: 'doc',
      title: 'Elasticsearch Log：让 ES 查询变得透明可见',
      description: 'IDEA插件，让Elasticsearch查询变得透明可见，提升开发效率',
      date: '2025-10-15',
      tags: ['IDEA插件', 'Elasticsearch', '开发工具', '效率提升'],
      author: '舒一笑不秃头'
    }
  },
  {
    path: 'docs/articles/gitpulse-intro.md',
    frontmatter: {
      layout: 'doc',
      title: 'GitPulse：让代码的故事自己讲述',
      description: '周报催交时快速生成工作量证明，面试时用数据展示编码能力',
      date: '2025-11-27',
      tags: ['IDEA插件', 'Git', '开发工具', '效率提升'],
      author: '舒一笑不秃头'
    }
  },
  {
    path: 'docs/articles/MyBatis-Log-Panda.md',
    frontmatter: {
      layout: 'doc',
      title: 'MyBatis Log Panda：重构开发者的认知地图',
      description: 'MyBatis日志格式化工具，让SQL调试变得简单高效',
      date: '2025-11-25',
      tags: ['IDEA插件', 'MyBatis', 'SQL', '开发工具'],
      author: '舒一笑不秃头'
    }
  }
];

// 生成 frontmatter 字符串
function generateFrontmatter(data) {
  let result = '---\n';
  result += `layout: ${data.layout}\n`;
  result += `title: ${data.title}\n`;
  result += `description: ${data.description}\n`;
  
  if (data.date) {
    result += `date: '${data.date}'\n`;
  }
  
  if (data.tags && data.tags.length > 0) {
    result += 'tags:\n';
    data.tags.forEach(tag => {
      result += `  - ${tag}\n`;
    });
  }
  
  if (data.author) {
    result += `author: ${data.author}\n`;
  }
  
  result += '---\n\n';
  return result;
}

// 处理文件
function processFile(fileInfo) {
  const filePath = fileInfo.path;
  
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否已有 frontmatter
  if (content.startsWith('---')) {
    console.log(`文件已有 frontmatter，跳过: ${filePath}`);
    return;
  }
  
  const frontmatter = generateFrontmatter(fileInfo.frontmatter);
  const newContent = frontmatter + content;
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ 已添加 frontmatter: ${filePath}`);
}

// 批量处理
console.log('开始处理文件...\n');
filesToProcess.forEach(processFile);
console.log('\n处理完成！');
