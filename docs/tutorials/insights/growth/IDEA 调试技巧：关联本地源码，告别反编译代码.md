---
layout: doc
title: IDEA 调试技巧：关联本地源码，告别反编译代码
description: >-
  当业务模块和依赖源码分离时，如何在IDEA中配置External Libraries关联本地源码，
  让断点调试直接跳转到.java文件而非反编译的.class文件。
date: '2026-02-24'
tags:
  - IDEA
  - Java
  - 调试
  - 开发工具
author: 舒一笑不秃头
---

# IDEA 调试技巧：关联本地源码，告别反编译代码

> 日常在IDEA中开发会遇到一个很难的问题，当业务模块和依赖源码分离的开发中，如何在IDEA中配置能实现，断点判断问题直接到本地源码的依赖位置，避免看反编译代码云里雾里

## 详细的步骤

1. 在业务项目中，通过左侧项目树找到 **External Libraries**（外部库）。
2. 找到对应的抽象层 JAR 包，右键点击该 JAR 包，选择 **Library Settings...**。
3. 在弹出的窗口中，点击左侧的 `+` 号（或底部的 Add 按钮）。
4. **选择你本地抽象层源码的根目录**（通常是含有 `src/main/java` 的目录）。
5. 点击 OK。现在当你点击业务代码中的抽象类或接口时，IDEA 会直接跳转到你本地的 `.java` 源码文件而非反编译的 `.class` 文件。

## 具体的步骤展示

具体如何配置

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20260224171246356.png)

点击+号设置对应源码的位置

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20260224171328851.png)