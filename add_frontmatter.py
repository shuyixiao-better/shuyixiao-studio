#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量为 Markdown 文件添加 frontmatter
"""

import os
import re
from pathlib import Path

# 需要处理的文件及其 frontmatter 配置
FILES_CONFIG = [
    # projects 目录
    {
        'path': 'docs/projects/torchv-unstructured-optimization.md',
        'frontmatter': {
            'layout': 'doc',
            'title': 'TorchV Unstructured 优化建议',
            'description': '基于深入分析的 TorchV Unstructured 项目改进建议',
            'date': '2025-01-27',
            'tags': ['Java', '文档解析', 'RAG', '优化建议'],
            'author': '舒一笑不秃头'
        }
    },
    {
        'path': 'docs/projects/TorchV解析word.md',
        'frontmatter': {
            'layout': 'doc',
            'title': 'TorchV 解析 Word 文档',
            'description': 'TorchV 框架解析 Word 文档的实践指南',
            'date': '2025-01-27',
            'tags': ['Java', '文档解析', 'Word', 'TorchV'],
            'author': '舒一笑不秃头'
        }
    },
    # tools 目录
    {
        'path': 'docs/tools/font-test.md',
        'frontmatter': {
            'layout': 'doc',
            'title': '字体测试',
            'description': '网站字体显示效果测试页面'
        }
    },
    {
        'path': 'docs/tools/pandacoder-test.md',
        'frontmatter': {
            'layout': 'doc',
            'title': 'PandaCoder 测试',
            'description': 'PandaCoder 功能测试页面'
        }
    },
]

def has_frontmatter(content):
    """检查文件是否已有 frontmatter"""
    return content.strip().startswith('---')

def generate_frontmatter(config):
    """生成 frontmatter 字符串"""
    lines = ['---']
    
    # 必需字段
    lines.append(f"layout: {config.get('layout', 'doc')}")
    lines.append(f"title: {config['title']}")
    lines.append(f"description: {config['description']}")
    
    # 可选字段
    if 'date' in config:
        lines.append(f"date: '{config['date']}'")
    
    if 'tags' in config and config['tags']:
        lines.append('tags:')
        for tag in config['tags']:
            lines.append(f"  - {tag}")
    
    if 'author' in config:
        lines.append(f"author: {config['author']}")
    
    lines.append('---')
    lines.append('')  # 空行
    
    return '\n'.join(lines)

def process_file(file_config):
    """处理单个文件"""
    file_path = file_config['path']
    
    if not os.path.exists(file_path):
        print(f"⚠️  文件不存在: {file_path}")
        return False
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有 frontmatter
    if has_frontmatter(content):
        print(f"⏭️  已有 frontmatter，跳过: {file_path}")
        return False
    
    # 生成并添加 frontmatter
    frontmatter = generate_frontmatter(file_config['frontmatter'])
    new_content = frontmatter + content
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 已添加 frontmatter: {file_path}")
    return True

def main():
    """主函数"""
    print("=" * 60)
    print("开始批量添加 frontmatter...")
    print("=" * 60)
    print()
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for file_config in FILES_CONFIG:
        try:
            if process_file(file_config):
                success_count += 1
            else:
                skip_count += 1
        except Exception as e:
            print(f"❌ 处理失败: {file_config['path']}")
            print(f"   错误: {str(e)}")
            error_count += 1
    
    print()
    print("=" * 60)
    print(f"处理完成！")
    print(f"  ✅ 成功: {success_count} 个文件")
    print(f"  ⏭️  跳过: {skip_count} 个文件")
    print(f"  ❌ 失败: {error_count} 个文件")
    print("=" * 60)

if __name__ == '__main__':
    main()
