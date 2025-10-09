---
layout: doc
title: 手把手教你开发一个Spring Boot Starter
description: Spring Boot Starter机制详解，从零开始开发自己的Starter组件
date: 2025-09-27
tags: ['Spring Boot', 'Java', '组件开发']
author: 舒一笑不秃头
---

# 手把手教你开发一个Spring Boot Starter

![Spring Boot Starter](../public/Spring+Boot+Starter.png)

## 前言

Spring Boot的自动配置机制是其核心特性之一，而Starter则是这一机制的具体实现。通过开发自定义Starter，我们可以将特定功能模块封装成可复用的组件，大大简化应用开发流程。本文将详细介绍如何从零开始开发一个Spring Boot Starter组件。

## Starter是什么？

Spring Boot Starter是一种特殊的依赖描述符，它提供了一组依赖项的集合，使得应用开发者能够方便地引入和使用特定的功能模块。

一个标准的Starter通常包含以下部分：

1. **自动配置类**：根据条件自动创建和配置Bean
2. **属性配置类**：定义可配置的属性
3. **核心服务类**：提供实际功能的实现
4. **spring.factories文件**：指定自动配置类的位置

## 开发步骤

接下来，我们将开发一个简单的`hello-spring-boot-starter`，实现自动提供Hello服务的功能。

### 步骤1：创建项目

首先创建一个Maven项目，添加必要的依赖：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.shuyixiao</groupId>
    <artifactId>hello-spring-boot-starter</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>1.8</java.version>
        <spring-boot.version>2.7.0</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

### 步骤2：创建属性配置类

创建一个属性类，用于接收用户的配置：

```java
package com.shuyixiao.hello.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "shuyixiao.hello")
public class HelloProperties {

    /**
     * 是否启用hello功能
     */
    private boolean enabled = true;

    /**
     * 问候语
     */
    private String greeting = "Hello, World!";

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }
}
```

### 步骤3：创建服务类

实现核心服务类，提供实际的功能：

```java
package com.shuyixiao.hello.service;

public class HelloService {

    private String greeting;

    public HelloService(String greeting) {
        this.greeting = greeting;
    }

    /**
     * 返回问候语
     * @param name 姓名
     * @return 完整问候语
     */
    public String sayHello(String name) {
        return greeting + ", " + name + "!";
    }

    /**
     * 返回默认问候语
     * @return 默认问候语
     */
    public String sayHello() {
        return greeting;
    }
}
```

### 步骤4：创建自动配置类

创建自动配置类，根据条件自动创建Bean：

```java
package com.shuyixiao.hello.autoconfigure;

import com.shuyixiao.hello.properties.HelloProperties;
import com.shuyixiao.hello.service.HelloService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnClass(HelloService.class)
@EnableConfigurationProperties(HelloProperties.class)
public class HelloAutoConfiguration {

    private final HelloProperties properties;

    public HelloAutoConfiguration(HelloProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "shuyixiao.hello", value = "enabled", havingValue = "true", matchIfMissing = true)
    public HelloService helloService() {
        return new HelloService(properties.getGreeting());
    }
}
```

### 步骤5：创建spring.factories文件

在`resources/META-INF`目录下创建`spring.factories`文件：

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.shuyixiao.hello.autoconfigure.HelloAutoConfiguration
```

## 测试Starter

### 打包并安装

执行Maven命令进行打包并安装到本地仓库：

```bash
mvn clean install
```

### 创建测试项目

创建一个简单的Spring Boot项目，引入我们开发的Starter：

```xml
<dependency>
    <groupId>com.shuyixiao</groupId>
    <artifactId>hello-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 配置属性

在`application.properties`中配置属性：

```properties
shuyixiao.hello.greeting=你好
```

### 使用服务

创建一个控制器来使用我们的服务：

```java
package com.example.demo.controller;

import com.shuyixiao.hello.service.HelloService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    private final HelloService helloService;

    public HelloController(HelloService helloService) {
        this.helloService = helloService;
    }

    @GetMapping("/hello")
    public String hello() {
        return helloService.sayHello();
    }

    @GetMapping("/hello/{name}")
    public String hello(@PathVariable String name) {
        return helloService.sayHello(name);
    }
}
```

启动应用后，访问`http://localhost:8080/hello`即可看到效果。

## 进阶技巧

### 条件注解的使用

Spring Boot提供了多种条件注解，常用的包括：

- `@ConditionalOnClass`：当类路径下有指定类时才启用配置
- `@ConditionalOnMissingBean`：当容器中没有指定Bean时才创建
- `@ConditionalOnProperty`：当配置属性满足条件时才启用配置
- `@ConditionalOnWebApplication`：当应用是Web应用时才启用配置

### Starter命名规范

Spring Boot官方Starter命名为`spring-boot-starter-xxx`，而非官方Starter应命名为`xxx-spring-boot-starter`，以避免命名冲突。

## 总结

通过本文，我们学习了如何从零开始开发一个Spring Boot Starter。核心步骤包括：

1. 创建属性配置类
2. 实现核心服务
3. 编写自动配置类
4. 配置spring.factories文件

通过开发自定义Starter，我们可以将常用功能模块化，提高代码复用率，简化应用开发流程。在实际工作中，针对团队内经常使用的功能，开发对应的Starter是一种很好的实践。

希望本文对你有所帮助，如有问题或建议，欢迎在评论区留言讨论！

## 参考资料

1. [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
2. [Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-auto-configuration)
3. [Spring Boot Starters](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)

---

<div class="article-footer">
  <div class="article-tags">
    <span class="tag">Spring Boot</span>
    <span class="tag">Java</span>
    <span class="tag">组件开发</span>
  </div>
  <div class="article-share">
    分享到：
    <a href="#" class="share-link">微信</a>
    <a href="#" class="share-link">微博</a>
  </div>
</div>

<style>
.article-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 2px dashed var(--vp-c-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-dimm), rgba(62, 175, 124, 0.1));
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

.article-share {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  background: var(--vp-c-brand-dimm);
  font-weight: 500;
}

.share-link:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(62, 175, 124, 0.3);
}

/* 移动端文章底部优化 */
@media (max-width: 640px) {
  .article-footer {
    margin-top: 2rem;
    padding-top: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .article-tags {
    width: 100%;
    gap: 0.4rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.3rem 0.7rem;
  }

  .article-share {
    width: 100%;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }

  .share-link {
    font-size: 0.85rem;
    padding: 0.35rem 0.75rem;
  }
}

/* 平板端文章底部 */
@media (min-width: 641px) and (max-width: 768px) {
  .article-footer {
    margin-top: 2.5rem;
    padding-top: 1.3rem;
  }

  .tag {
    font-size: 0.78rem;
    padding: 0.32rem 0.8rem;
  }

  .share-link {
    font-size: 0.88rem;
    padding: 0.32rem 0.8rem;
  }
}

/* 暗色模式优化 */
.dark .article-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.dark .tag {
  background: linear-gradient(135deg, rgba(66, 211, 146, 0.15), rgba(66, 211, 146, 0.1));
  border-color: var(--vp-c-brand-1);
}

.dark .tag:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: white;
}

.dark .share-link {
  background: rgba(66, 211, 146, 0.15);
}

.dark .share-link:hover {
  background: var(--vp-c-brand-1);
  color: white;
}
</style>
