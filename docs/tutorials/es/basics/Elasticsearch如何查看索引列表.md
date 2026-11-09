---
layout: doc
title: Elasticsearch如何查看索引列表
description: '**最常用和推荐的方式：**'
date: '2025-10-09'
tags:
  - Elasticsearch
  - Java
author: 境焕说AI
---
# Elasticsearch如何查看索引列表

> 在 Elasticsearch 中，查看集群中存在的**索引列表**（即有哪些索引）的标准 DSL 命令是使用 `_cat/indices`API。这个命令会返回一个包含索引名称、状态、健康度、文档数、大小等信息的易读表格。

**最常用和推荐的方式：**

```
GET /_cat/indices?v
```

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251006135550209.png)

**解释：**

1. **`GET`**: HTTP 方法。
2. **`/_cat/indices`**: 这是 Elasticsearch 提供的用于查看索引信息的 Catalog API 端点。
3. **`?v`**: 查询参数，表示 `verbose`。加上这个参数会在返回结果中包含列标题（header），使输出更易读。不加 `?v`也能看到索引列表，但列的含义需要靠记忆或文档。

**执行此命令后的典型输出：**

```java
health status index                                                              uuid                   pri rep docs.count docs.deleted store.size pri.store.size dataset.size
green  open   .internal.alerts-transform.health.alerts-default-000001            3R-MxTG4T3apDhTxkebi_Q   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-observability.logs.alerts-default-000001          N8UKQbtDQ0umOyAGk9atHg   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-observability.uptime.alerts-default-000001        PSDuU6GWR5ewDrpfu1uTwg   1   0          0            0       249b           249b         249b
yellow open   my_index_0509                                                      V-8KOKdjQCC1ku2COlrHsA   1   1          1            0      9.7kb          9.7kb        9.7kb
green  open   .internal.alerts-ml.anomaly-detection.alerts-default-000001        S6DCX0x_SYqH6Yw22MTALQ   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-observability.slo.alerts-default-000001           IA2mPgKFS1SvT7iBD9Rxmw   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-default.alerts-default-000001                     rweYpWpuTVuKtJ3nflpSXQ   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-observability.apm.alerts-default-000001           YHuxgwT3Q7SITwjSgyDIjg   1   0          0            0       249b           249b         249b
yellow open   my_index_0510                                                      3Eti3SXlQY6WRRv4rmQGKQ   1   1          0            0       249b           249b         249b
yellow open   kibana_sample_data_flights                                         VhNwMZdSSpWZEVyfDAED3g   1   1      13014            0      5.7mb          5.7mb        5.7mb
green  open   .internal.alerts-observability.metrics.alerts-default-000001       aa7q-oCoSW2ra6immFMmUg   1   0          0            0       249b           249b         249b
green  open   .kibana-observability-ai-assistant-conversations-000001            0-ZCj2ywTEKGEcbmw_TcaQ   1   0          0            0       249b           249b         249b
yellow open   kibana_sample_data_ecommerce                                       EYzwnXS_QhuawoSw--Uh-w   1   1       4675            0        4mb            4mb          4mb
yellow open   .ds-kibana_sample_data_logs-2025.10.06-000001                      Bg7IFd9xTxOQWqkcR1_OoA   1   1      14074            0      8.2mb          8.2mb        8.2mb
green  open   .internal.alerts-ml.anomaly-detection-health.alerts-default-000001 JsyvXs3PS-2pw7obPCKzZg   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-observability.threshold.alerts-default-000001     -fSNQkaPROqfC9nRViyCww   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-security.alerts-default-000001                    Fp9y4Ea-TyeIGrPztXZt-w   1   0          0            0       249b           249b         249b
green  open   .kibana-observability-ai-assistant-kb-000001                       AKlDtnVjTxeKvD_vkJTofg   1   0          0            0       249b           249b         249b
green  open   .internal.alerts-stack.alerts-default-000001                       o8dEeNL7RKuTY27TXWBmpQ   1   0          0            0       249b           249b         249b

```

## 📊Elasticsearch 索引概览

### 索引状态分析

| 索引名称                       | 健康状态 | 状态 | 主分片 | 副本分片 | 文档数 | 存储大小 |
| ------------------------------ | -------- | ---- | ------ | -------- | ------ | -------- |
| **用户数据索引**               |          |      |        |          |        |          |
| `my_index_0509`                | 🟡 Yellow | Open | 1      | 1        | 1      | 9.7kb    |
| `my_index_0510`                | 🟡 Yellow | Open | 1      | 1        | 0      | 249b     |
| `kibana_sample_data_flights`   | 🟡 Yellow | Open | 1      | 1        | 13,014 | 5.7mb    |
| `kibana_sample_data_ecommerce` | 🟡 Yellow | Open | 1      | 1        | 4,675  | 4mb      |

| **系统内部索引** | | | | | | |

| `.internal.alerts-*`(多个) | 🟢 Green | Open | 1 | 0 | 0 | 249b |

| `.kibana-observability-*`| 🟢 Green | Open | 1 | 0 | 0 | 249b |

| `.ds-kibana_sample_data_logs-2025.10.06-000001`| 🟡 Yellow | Open | 1 | 1 | 14,074 | 8.2mb |

## 🔍 关键观察说明

### 健康状态说明

- **🟢 Green (绿色)**: 完全健康（主分片和副本分片都正常）
- **🟡 Yellow (黄色)**: 主分片正常，但副本分片缺失（在单节点环境中很常见）

### 重要发现

1. **用户索引**: 您有 4 个用户数据索引，其中 `my_index_0510`是空的（文档数为 0）
2. **样本数据**: Kibana 的样本数据（flights, ecommerce, logs）已加载
3. **系统索引**: 多个以 `.internal`开头的系统索引用于告警功能
4. **数据流**: `.ds-kibana_sample_data_logs-*`是数据流后台索引

### 💡 建议

- 黄色状态通常是因为副本分片无法分配（单节点集群的正常现象）
- 系统索引（以点开头的）一般不需要手动操作
- `my_index_0510`目前是空索引，可以用于测试或等待数据写入

**总结：**

要查看 Elasticsearch 集群中有哪些索引，最直接、最常用的命令是：

```java
GET /_cat/indices?v
```

## 如何在kibana中使用其图形化的索引管理功能

1. **打开 Kibana 并登录** 在浏览器中访问您的 Kibana 地址（例如 `http://localhost:5601`）并使用您的账号登录 。

2. **进入 Stack Management** 登录后，请留意 Kibana 主界面左侧的导航菜单。点击菜单底部的 **`Management`**（管理）选项，在中文界面中可能显示为“管理”或“堆栈管理” 。

3. **选择 Index Management** 在 `Stack Management`（堆栈管理）页面中，您会看到一个名为 **`Index Management`**（索引管理）的选项，点击它即可进入 。

4. **查看索引列表** 进入 `Index Management`页面后，系统会直接显示您 Elasticsearch 集群中所有的索引列表 。这个列表通常会包含每个索引的详细信息，例如： **索引名称**：这是您最需要关注的信息。 **健康状态**：绿色（健康）、黄色（需关注）、红色（故障）。 **状态**：开启或关闭。 **文档数量**和**存储大小**等 。 您还可以使用页面上的搜索框来快速过滤和查找特定的索引 。

   ![图形化的索引管理功能](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251006140231964.png)



