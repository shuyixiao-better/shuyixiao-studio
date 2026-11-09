#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量为 Markdown 文件添加 frontmatter
根据文件内容自动生成合适的 frontmatter
"""

import os
import re

def has_frontmatter(content):
    """检查文件是否已有 frontmatter"""
    return content.strip().startswith('---')

def extract_first_heading(content):
    """提取第一个标题作为 title"""
    # 匹配 # 标题
    match = re.search(r'^#+ (.+)$', content, re.MULTILINE)
    if match:
        title = match.group(1).strip()
        # 移除 markdown 格式符号
        title = re.sub(r'\*\*(.+?)\*\*', r'\1', title)  # 移除加粗
        title = re.sub(r'\*(.+?)\*', r'\1', title)      # 移除斜体
        title = re.sub(r'`(.+?)`', r'\1', title)        # 移除代码
        return title
    return None

def extract_description(content):
    """提取描述信息"""
    # 移除 frontmatter（如果有）
    content_without_fm = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # 移除第一个标题
    content_without_title = re.sub(r'^#+ .+\n+', '', content_without_fm, count=1, flags=re.MULTILINE)
    
    # 查找第一段文字（非空行）
    lines = content_without_title.split('\n')
    for line in lines:
        line = line.strip()
        # 跳过空行、图片、代码块标记等
        if line and not line.startswith('![') and not line.startswith('```') and not line.startswith('>') and not line.startswith('<'):
            # 清理 markdown 格式
            desc = re.sub(r'\*\*(.+?)\*\*', r'\1', line)
            desc = re.sub(r'\*(.+?)\*', r'\1', desc)
            desc = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', desc)
            desc = re.sub(r'`(.+?)`', r'\1', desc)
            # 限制长度
            if len(desc) > 100:
                desc = desc[:97] + '...'
            return desc
    return None

def generate_frontmatter(title, description, tags=None, author='境焕说AI', date=None):
    """生成 frontmatter"""
    lines = ['---']
    lines.append('layout: doc')
    lines.append(f'title: {title}')
    if description:
        lines.append(f'description: {description}')
    if date:
        lines.append(f"date: '{date}'")
    if tags:
        lines.append('tags:')
        for tag in tags:
            lines.append(f'  - {tag}')
    if author:
        lines.append(f'author: {author}')
    lines.append('---')
    lines.append('')
    return '\n'.join(lines)

def infer_tags_from_content(content, file_path):
    """根据内容和文件路径推断标签"""
    tags = []
    content_lower = content.lower()
    
    # 根据关键词推断
    if 'java' in content_lower or 'spring' in content_lower:
        tags.append('Java')
    if 'python' in content_lower:
        tags.append('Python')
    if 'rag' in content_lower or '检索增强' in content:
        tags.append('RAG')
    if 'ai' in content_lower or '人工智能' in content or 'agent' in content_lower:
        tags.append('AI')
    if 'idea' in content_lower or '插件' in content:
        tags.append('IDEA插件')
    if 'elasticsearch' in content_lower or 'es' in content_lower:
        tags.append('Elasticsearch')
    if 'mybatis' in content_lower:
        tags.append('MyBatis')
    if 'git' in content_lower:
        tags.append('Git')
    if '架构' in content or 'architecture' in content_lower:
        tags.append('架构设计')
    if '微服务' in content or 'microservice' in content_lower:
        tags.append('微服务')
    
    # 根据文件路径推断
    if 'tools' in file_path:
        if '开发工具' not in tags:
            tags.append('开发工具')
    if 'tutorials' in file_path:
        if '教程' not in tags:
            tags.append('教程')
    if 'projects' in file_path:
        if '实战项目' not in tags:
            tags.append('实战项目')
    
    return tags[:5]  # 最多5个标签

def process_file(file_path):
    """处理单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已有 frontmatter
        if has_frontmatter(content):
            print(f"⏭️  已有 frontmatter: {file_path}")
            return False
        
        # 提取信息
        title = extract_first_heading(content)
        if not title:
            print(f"⚠️  无法提取标题: {file_path}")
            return False
        
        description = extract_description(content)
        if not description:
            description = title
        
        tags = infer_tags_from_content(content, file_path)
        
        # 生成 frontmatter
        frontmatter = generate_frontmatter(title, description, tags)
        new_content = frontmatter + content
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ 已添加: {file_path}")
        print(f"   标题: {title}")
        print(f"   标签: {', '.join(tags) if tags else '无'}")
        return True
        
    except Exception as e:
        print(f"❌ 处理失败: {file_path}")
        print(f"   错误: {str(e)}")
        return False

def find_md_files(directory):
    """查找所有 markdown 文件"""
    md_files = []
    for root, dirs, files in os.walk(directory):
        # 跳过 node_modules 等目录
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.vitepress']]
        
        for file in files:
            if file.endswith('.md') and file not in ['README.md', 'CHANGELOG.md']:
                md_files.append(os.path.join(root, file))
    return md_files

def main():
    """主函数"""
    print("=" * 70)
    print("批量添加 Markdown Frontmatter")
    print("=" * 70)
    print()
    
    # 查找所有 markdown 文件
    docs_dir = 'docs'
    if not os.path.exists(docs_dir):
        print(f"❌ 目录不存在: {docs_dir}")
        return
    
    md_files = find_md_files(docs_dir)
    print(f"📁 找到 {len(md_files)} 个 Markdown 文件\n")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for file_path in md_files:
        result = process_file(file_path)
        if result is True:
            success_count += 1
        elif result is False:
            skip_count += 1
        else:
            error_count += 1
        print()
    
    print("=" * 70)
    print(f"处理完成！")
    print(f"  ✅ 成功添加: {success_count} 个文件")
    print(f"  ⏭️  已有跳过: {skip_count} 个文件")
    print(f"  ❌ 处理失败: {error_count} 个文件")
    print("=" * 70)

if __name__ == '__main__':
    main()
