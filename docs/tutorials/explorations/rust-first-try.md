---
layout: doc
title: Rust First Try
description: >-
  作为一名长期使用 Java 和 Python 的开发者，我对 Rust 的好奇始于它在 Stack Overflow
  开发者调查中连续多年被评为"最受喜爱的编程语言"。
date: '2025-10-09'
tags:
  - 技术探索
  - Java
  - Rust
author: 舒一笑不秃头
---
# 初探 Rust：系统编程语言的诗与远方

> 记录时间：2024-03  
> 学习耗时：8 小时  
> 难度评级：⭐⭐⭐⭐☆

## 缘起

作为一名长期使用 Java 和 Python 的开发者，我对 Rust 的好奇始于它在 Stack Overflow 开发者调查中连续多年被评为"最受喜爱的编程语言"。

同时，看到越来越多的基础设施项目开始用 Rust 重写（如 ripgrep、exa 等），我意识到是时候亲自体验一下这门语言的魅力了。

## 第一印象

### 初见

打开 [Rust 官网](https://www.rust-lang.org/)，第一印象：
- 📚 **文档极其友好**："The Book" 堪称教科书级别的入门教材
- 🎯 **编译器很"啰嗦"**：但每一个错误提示都非常详细，甚至会告诉你如何修复
- 🦀 **吉祥物可爱**：一只小螃蟹，名叫 Ferris
- 💡 **理念清晰**：内存安全 + 零成本抽象 + 无畏并发

### 环境搭建

在 macOS 上安装非常简单：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装完成后，可以通过以下命令验证：

```bash
rustc --version  # 查看 Rust 编译器版本
cargo --version  # 查看包管理器版本
```

**小插曲**：首次使用 VS Code 编写 Rust 时，记得安装 `rust-analyzer` 插件，体验会好很多。

## 动手实践

### Hello World

创建第一个 Rust 项目：

```bash
cargo new hello_rust
cd hello_rust
cargo run
```

main.rs 的内容：

```rust
fn main() {
    println!("Hello, world!");
}
```

**第一感受**：`cargo` 工具真的很方便，类似 npm，但感觉更快、更现代。

### 核心概念

学习过程中，有几个概念让我印象深刻：

1. **所有权（Ownership）** - Rust 最独特的特性，一个值只能有一个所有者
2. **借用（Borrowing）** - 可以借用值的引用，但有严格的规则
3. **生命周期（Lifetime）** - 确保引用始终有效
4. **模式匹配** - 比其他语言的 switch 强大太多
5. **Result 和 Option** - 用类型系统处理错误，而不是异常

### 实战小项目

写了一个简单的命令行工具，读取文件并统计单词数：

```rust
use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() < 2 {
        println!("Usage: wordcount <filename>");
        return;
    }
    
    let filename = &args[1];
    let contents = fs::read_to_string(filename)
        .expect("Something went wrong reading the file");
    
    let word_count = contents.split_whitespace().count();
    println!("文件 {} 共有 {} 个单词", filename, word_count);
}
```

## 心得体会

### 优点

- ✅ **编译器是最好的老师**：错误提示非常详细，帮你理解问题所在
- ✅ **性能出色**：接近 C/C++ 的性能，但更安全
- ✅ **现代化的工具链**：cargo 真的太好用了
- ✅ **类型系统强大**：很多错误在编译期就能发现
- ✅ **社区友好**：文档、教程、讨论区都很活跃

### 槽点

- ⚠️ **学习曲线陡峭**：所有权、借用、生命周期等概念需要时间消化
- ⚠️ **编译速度慢**：相比 Go、Python 等语言，编译时间较长
- ⚠️ **与编译器"斗争"**：初期会经常遇到编译器报错，需要耐心
- ⚠️ **异步编程复杂**：虽然有 async/await，但生态还在完善中

### 适用场景

**适合：**
- 系统编程
- 命令行工具
- Web 服务器（如 actix-web）
- 嵌入式开发
- 性能敏感的应用

**不适合：**
- 快速原型开发
- 对编译速度要求高的场景
- 团队成员学习成本考量较大的项目

## 对比思考

与 Java 对比：

| 维度 | Java | Rust |
|------|------|------|
| 学习曲线 | 相对平缓 | 陡峭 |
| 内存管理 | GC 自动管理 | 所有权系统 |
| 性能 | 较好（JIT） | 优秀（AOT） |
| 生态成熟度 | 非常成熟 | 快速成长中 |
| 编译速度 | 快 | 慢 |
| 并发编程 | 多线程+锁 | 无畏并发 |

**设计理念对比：**
- Java 追求"一次编写，到处运行"，牺牲了一些性能
- Rust 追求"零成本抽象"，在不牺牲性能的前提下提供高级特性

## 踩坑记录

### 坑点一：字符串类型混乱

刚开始接触 Rust 时，被 `String` 和 `&str` 两种字符串类型搞晕了。

**原因分析：**
- `String` 是堆分配的可变字符串
- `&str` 是字符串切片，通常指向字符串字面量或 String 的一部分

**解决方案：**
- 记住口诀：当需要拥有字符串所有权时用 `String`，其他情况用 `&str`
- 可以用 `.to_string()` 或 `String::from()` 将 `&str` 转为 `String`

### 坑点二：可变引用规则

初学时总是遇到"cannot borrow as mutable"错误。

**原因分析：**
Rust 的借用规则：
- 要么有多个不可变引用
- 要么有一个可变引用
- 但不能同时存在

**解决方案：**
理解这个规则是为了防止数据竞争，接受这个约束，重新组织代码逻辑。

## 延伸阅读

- [The Rust Programming Language（官方教程）](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings（练习题）](https://github.com/rust-lang/rustlings)
- [Rust 语言圣经（中文）](https://course.rs/)

## 总结

Rust 是一门让人"又爱又恨"的语言。爱它的严谨、性能和现代化设计；恨它的学习曲线和与编译器的"较劲"。

但正如 Rust 社区说的：**"与编译器作斗争，最终你会赢。"** 当你理解了所有权系统后，会发现这是一种优雅而安全的内存管理方式。

虽然不会立刻在生产环境中使用 Rust，但它确实拓展了我对系统编程的理解，也让我重新思考内存安全和并发编程的本质。

值得一试！

---

::: tip 学习心得
学习 Rust 的过程，就像学习一门严谨的武术。一招一式都有章法，看似约束重重，实则是为了让你走得更稳、更远。
:::

