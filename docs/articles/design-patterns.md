---
title: 设计模式实战：策略模式在业务中的应用
description: 通过实际业务场景，深入理解策略模式的应用与实现
---

# 设计模式实战：策略模式在业务中的应用

> 本文将通过实际业务场景，深入理解策略模式的应用与实现

## 什么是策略模式？

策略模式是一种行为设计模式，它定义了算法家族，分别封装起来，让它们之间可以互相替换。策略模式让算法的变化独立于使用算法的客户端。

## 业务场景举例

假设我们正在开发一个电商系统的支付模块，需要支持多种支付方式（支付宝、微信支付、银联等）。每种支付方式的处理逻辑不同，但支付的流程是一致的。

## 传统实现方式

```java
public class PaymentService {
    public void pay(String payType, BigDecimal amount, String orderId) {
        if ("alipay".equals(payType)) {
            // 支付宝支付逻辑
            System.out.println("使用支付宝支付：" + amount);
            // 调用支付宝API
        } else if ("wechat".equals(payType)) {
            // 微信支付逻辑
            System.out.println("使用微信支付：" + amount);
            // 调用微信支付API
        } else if ("unionpay".equals(payType)) {
            // 银联支付逻辑
            System.out.println("使用银联支付：" + amount);
            // 调用银联API
        } else {
            throw new IllegalArgumentException("不支持的支付方式：" + payType);
        }
    }
}
```

这种实现方式存在什么问题？

1. 违反了开闭原则，每次添加新的支付方式都需要修改现有代码
2. 代码臃肿，难以维护
3. 业务逻辑复杂时，if-else结构会变得更加复杂

## 使用策略模式重构

首先，定义支付策略接口：

```java
public interface PaymentStrategy {
    void pay(BigDecimal amount, String orderId);
}
```

然后，实现具体的支付策略：

```java
// 支付宝支付策略
public class AlipayStrategy implements PaymentStrategy {
    @Override
    public void pay(BigDecimal amount, String orderId) {
        System.out.println("使用支付宝支付：" + amount);
        // 调用支付宝API
    }
}

// 微信支付策略
public class WechatPayStrategy implements PaymentStrategy {
    @Override
    public void pay(BigDecimal amount, String orderId) {
        System.out.println("使用微信支付：" + amount);
        // 调用微信支付API
    }
}

// 银联支付策略
public class UnionPayStrategy implements PaymentStrategy {
    @Override
    public void pay(BigDecimal amount, String orderId) {
        System.out.println("使用银联支付：" + amount);
        // 调用银联API
    }
}
```

接着，创建支付上下文类：

```java
public class PaymentContext {
    private PaymentStrategy paymentStrategy;

    public PaymentContext(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void executePayment(BigDecimal amount, String orderId) {
        paymentStrategy.pay(amount, orderId);
    }
}
```

最后，重构支付服务：

```java
public class PaymentService {
    private Map<String, PaymentStrategy> strategyMap = new HashMap<>();

    public PaymentService() {
        strategyMap.put("alipay", new AlipayStrategy());
        strategyMap.put("wechat", new WechatPayStrategy());
        strategyMap.put("unionpay", new UnionPayStrategy());
    }

    public void pay(String payType, BigDecimal amount, String orderId) {
        PaymentStrategy strategy = strategyMap.get(payType);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式：" + payType);
        }
        PaymentContext context = new PaymentContext(strategy);
        context.executePayment(amount, orderId);
    }

    // 可以动态添加新的支付方式
    public void addPaymentStrategy(String payType, PaymentStrategy strategy) {
        strategyMap.put(payType, strategy);
    }
}
```

## 策略模式的优势

1. **符合开闭原则**：添加新的支付方式不需要修改现有代码，只需创建新的策略类并注册
2. **代码结构清晰**：每个策略封装在自己的类中，职责单一
3. **消除条件判断**：避免了复杂的if-else结构
4. **运行时灵活切换**：可以在运行时动态切换不同的策略

## 策略模式的应用场景

1. **多种算法相似，仅实现不同**：如各种排序算法、压缩算法等
2. **算法需要自由切换**：如游戏中的不同角色AI策略
3. **避免使用多重条件判断**：当有大量条件分支且每个分支算法复杂时
4. **数据验证策略**：不同的数据类型有不同的验证规则

## 实际业务中的扩展

在实际业务中，我们可能需要进一步扩展策略模式：

1. **策略工厂**：用于管理和创建策略对象
2. **组合策略**：将多个策略组合使用
3. **参数化策略**：根据参数动态选择策略

## 总结

策略模式是一种非常实用的设计模式，尤其适合处理那些有多种算法或行为的场景。在实际业务开发中，合理应用策略模式可以提高代码的可维护性和扩展性，减少代码的耦合度。

通过本文的例子，我们看到了策略模式如何在支付系统中发挥作用，同样的思路也可以应用到其他类似场景，如订单处理、优惠计算、通知推送等业务功能中。

最后，记住设计模式是手段而非目的，选择合适的设计模式应当基于实际业务需求，避免过度设计。
