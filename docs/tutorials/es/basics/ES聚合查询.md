---
layout: doc
title: ES聚合查询
description: >-
  聚合（Aggregations）是 Elasticsearch
  中用于对数据进行**统计、分析和汇总**的核心功能。它允许你从大量数据中提取信息并生成复杂的分析结果，而不仅仅是返回匹配的文档。其功能类似于 SQL 中的
  `GROUP BY` 结合 `COUNT()`, `SUM()`, `AVG()
date: '2025-10-09'
tags:
  - Elasticsearch
  - Java
author: 舒一笑不秃头
---
## 一、聚合查询概述

### 1. 什么是聚合？

聚合（Aggregations）是 Elasticsearch 中用于对数据进行**统计、分析和汇总**的核心功能。它允许你从大量数据中提取信息并生成复杂的分析结果，而不仅仅是返回匹配的文档。其功能类似于 SQL 中的 `GROUP BY` 结合 `COUNT()`, `SUM()`, `AVG()` 等聚合函数，但更加强大和灵活。

### 2. 聚合与查询的区别

* **查询（Query）** ：用于**检索**符合条件的文档。它回答的是 **“有哪些文档？”** 的问题。核心是 **定位** 。
* **聚合（Aggregation）** ：用于对已检索的文档进行 **统计分析** 。它回答的是 **“这些数据看起来怎么样？”** 的问题。核心是 **分析** 。

当然，聚合是基于查询结果的。你可以先通过 `query` 筛选出一个数据的子集（例如，仅2023年的销售记录），然后对这个子集进行 `aggs` 分析（例如，计算每个月的销售额总和）。这是一种“先查询，后聚合”的强大模式。

### 3. 聚合的分类

1. **分桶聚合（Bucket Aggregations）**：将文档分组到不同的**桶（Bucket）** 中。每个桶对应一个 key 和一组满足该 key 条件的文档。这类似于 SQL 的 `GROUP BY`。例如：按国家分组、按价格区间分组、按时间间隔分组。
2. **指标聚合（Metrics Aggregations）**：从文档中**计算**出的一个或多个 **数值指标** 。例如：平均价格、最高工资、百分比、唯一值计数等。
3. **管道聚合（Pipeline Aggregations）**：对其他聚合的**输出结果**进行 **二次聚合** 。例如，要计算每月销售额的平均值，你需要先按 `date_histogram`（分桶聚合）得到每月销售额，再对这个结果使用 `avg_bucket`（管道聚合）。

---

### 4、数据准备

```
DELETE product
PUT /product/_doc/1
{
    "name" : "xiaomi phone",
    "desc" :  "shouji zhong de zhandouji",
    "date": "2021-06-01",
    "price" :  3999,
    "tags": [ "xingjiabi", "fashao", "buka" ]
}
PUT /product/_doc/2
{
    "name" : "xiaomi nfc phone",
    "desc" :  "zhichi quangongneng nfc,shouji zhong de jianjiji",
    "date": "2021-06-02",
    "price" :  4999,
    "tags": [ "xingjiabi", "fashao", "gongjiaoka" ]
}
PUT /product/_doc/3
{
    "name" : "nfc phone",
    "desc" :  "shouji zhong de hongzhaji",
    "date": "2021-06-03",
    "price" :  2999,
    "tags": [ "xingjiabi", "fashao", "menjinka" ]
}
PUT /product/_doc/4
{
    "name" : "xiaomi erji",
    "desc" :  "erji zhong de huangmenji",
    "date": "2021-04-15",
    "price" :  999,
    "tags": [ "low", "bufangshui", "yinzhicha" ]
}
PUT /product/_doc/5
{
    "name" : "hongmi erji",
    "desc" :  "erji zhong de kendeji 2021-06-01",
    "date": "2021-04-16",
    "price" :  399,
    "tags": [ "lowbee", "xuhangduan", "zhiliangx" ]
}
```

### 1. 基本语法（指标聚合）

```
GET /product/_search
{
  "size": 0,       // 设置为0，因为我们只关心聚合结果，不关心具体文档
  "query": {       // 可选：先使用查询筛选出要分析的数据集
    "match_all": {} // 这里使用匹配所有文档的查询
  },
  "aggs": {        // 聚合请求的主体
    "price_stats": { // 自定义聚合名称：price_stats
      "stats": {   // 聚合类型：统计聚合，返回计数、总和、最小值、最大值和平均值
        "field": "price" // 对price字段进行统计
      }
    }
  }
}
```

查询结果解释：

```
{
  "took": 3,  // 查询执行的总耗时，单位为毫秒
  "timed_out": false,  // 表明本次查询是否超时。false 表示在正常时间内完成。
  "_shards": {  // 描述了查询涉及的分片信息。
    "total": 1,    // 查询需要搜索的总分片数。
    "successful": 1,   // 成功执行了查询的分片数。
    "skipped": 0,   // 跳过的分片数（通常发生在执行搜索时，分片之前已经提供了相同的结果）。
    "failed": 0    // 执行失败的分片数。0 表示所有分片都成功返回。
  },
  "hits": {
    "total": {
      "value": 6,    // 匹配查询条件的文档总数量。您的 product 索引中有 6 个文档。
      "relation": "eq"    // 表示总数是精确值（eq），而不是一个近似值（例如 "gte" 大于或等于）。
    },
    "max_score": null,  // 由于没有进行相关性评分（只是聚合），所以为 null。
    "hits": []   // 具体的文档列表。因为 "size": 0，所以这个数组为空。
  },
  "aggregations": {
    "price_stats": {   // 这个键的名称 "price_stats" 对应您在 aggs 请求体中自定义的聚合名称。
      "count": 5,  // 【统计值】计算了 `price` 字段值不为 null 的文档数量。这里有 5 个文档有价格，可能有一个文档的 price 字段缺失或为 null。
      "min": 399,   // 【统计值】所有价格中的最小值。在您的数据中，是 id 为 5 的 "hongmi erji"，价格 399。
      "max": 4999,    // 【统计值】所有价格中的最大值。在您的数据中，是 id 为 2 的 "xiaomi nfc phone"，价格 4999。
      "avg": 2679,    // 【统计值】所有价格的平均值。(3999 + 4999 + 2999 + 999 + 399) / 5 = 13395 / 5 = 2679
      "sum": 13395    // 【统计值】所有价格的总和。3999 + 4999 + 2999 + 999 + 399 = 13395
    }
  }
}
```

### 2. 分桶聚合

按标签分组

```
GET /product/_search
{
  "size": 0,
  "aggs": {
    "tags_aggregation": {
      "terms": {
        "field": "tags.keyword",  // 使用.keyword确保精确匹配
        "size": 10                // 返回前10个最常见的标签
      }
    }
  }
}
```

### 3. 管道聚合

计算各月份平均价格的总体平均值

```
GET /product/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {          // 第一层聚合：按月份分桶
      "date_histogram": {
        "field": "date",          // 使用日期字段
        "calendar_interval": "month", // 按月分组
        "format": "yyyy-MM"       // 格式化输出为"年-月"
      },
      "aggs": {
        "monthly_avg_price": {    // 子聚合：计算每月的平均价格
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "overall_avg_monthly_price": { // 第二层聚合：管道聚合
      "avg_bucket": {
        "buckets_path": "sales_per_month>monthly_avg_price" // 指向第一层聚合的结果
      }
    }
  }
}
```

查询结果解释

```
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "sales_per_month": {
      "buckets": [
        {
          "key_as_string": "2021-04",
          "key": 1617235200000,
          "doc_count": 2,   // 这个月有2个产品
          "monthly_avg_price": {
            "value": 699   // 4月份产品的平均价格：(999 + 399) / 2 = 699
          }
        },
        {
          "key_as_string": "2021-05",
          "key": 1619827200000,
          "doc_count": 0,
          "monthly_avg_price": {
            "value": null
          }
        },
        {
          "key_as_string": "2021-06",
          "key": 1622505600000,
          "doc_count": 3,    // 这个月有3个产品
          "monthly_avg_price": {
            "value": 3999   // 6月份产品的平均价格：(3999 + 4999 + 2999) / 3 = 3999
          }
        }
      ]
    },
    "overall_avg_monthly_price": {
      "value": 2349      // 管道聚合结果：各月份平均价格的总体平均值 (699 + 3999) / 2 = 2349
    }
  }
}
```

---

## 三、常用聚合类型及代码实现

### 1. 分桶聚合：Terms

#### DSL 示例：

```
//分桶聚合
GET /product/_search
{
  "size": 0,
  "aggs": {
    "tags_aggregation": {
      "terms": {
        "field": "tags.keyword",  // 使用.keyword确保精确匹配
        "size": 10                // 返回前10个最常见的标签
      }
    }
  }
}
```

结果：

```
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "tags_aggregation": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 1,
      "buckets": [
        {
          "key": "fashao",
          "doc_count": 3
        },
        {
          "key": "xingjiabi",
          "doc_count": 3
        },
        {
          "key": "bufangshui",
          "doc_count": 1
        },
        {
          "key": "buka",
          "doc_count": 1
        },
        {
          "key": "gongjiaoka",
          "doc_count": 1
        },
        {
          "key": "low",
          "doc_count": 1
        },
        {
          "key": "lowbee",
          "doc_count": 1
        },
        {
          "key": "menjinka",
          "doc_count": 1
        },
        {
          "key": "xuhangduan",
          "doc_count": 1
        },
        {
          "key": "yinzhicha",
          "doc_count": 1
        }
      ]
    }
  }
}
```

#### Java 代码实现（使用 Elasticsearch Java Client）：

```
   // 分桶聚合：按标签统计
    public Map<String, Long>   termsAggregation() throws IOException {
        Map<String, Long> result = new HashMap<>();
        SearchResponse<Void> response = client.search(s -> s
                .index("product")
                .size(0)
                .aggregations("tags_bucket", a -> a
                        .terms(t -> t.field("tags.keyword").size(10))
                ), Void.class);

        // 解析聚合结果 - 使用 StringTermsAggregate 和 StringTermsBucket
        StringTermsAggregate tagsAgg = response.aggregations().get("tags_bucket").sterms();
        for (StringTermsBucket bucket : tagsAgg.buckets().array()) {
            result.put(bucket.key().stringValue(), bucket.docCount());
        }
        return result;
    }
```

---

### 2. 指标聚合：Avg, Max, Min, Sum

#### DSL 示例：

```
//聚合查询2
GET /product/_search
{
  "size": 0,
  "aggs": {
    "average_price": {  // 自定义聚合名：average_price
      "avg": {          // 聚合类型：求平均值
        "field": "price" // 对 price 字段求平均
      }
    }
  }
}
```

#### Java 代码实现：

```
    // 指标聚合：计算平均价格
    public double  avgPriceAggregation() throws IOException {
        SearchResponse<Void> response = client.search(s -> s
                .index("product")
                .size(0)
                .aggregations("avg_price", a -> a
                        .avg(avg -> avg.field("price"))
                ), Void.class);

        AvgAggregate avgAgg = response.aggregations().get("avg_price").avg();
        return avgAgg.value();
    }
```

---

### 3. 直方图聚合：Histogram

#### DSL 示例：

```
GET /product/_search
{
  "size": 0,
  "aggs": {
    "price_histogram": {
      "histogram": {
        "field": "price",
        "interval": 1000
      }
    }
  }
}
```

#### Java 代码实现：

```
// 直方图聚合：按价格区间统计
    public void histogramAggregation() throws IOException {
        SearchResponse<Void> response = client.search(s -> s
                .index("product")
                .size(0)
                .aggregations("price_histogram", a -> a
                        .histogram(h -> h.field("price").interval(1000.0))
                ), Void.class);

        HistogramAggregate histogram = response.aggregations().get("price_histogram").histogram();
        for (HistogramBucket bucket : histogram.buckets().array()) {
            double startRange = bucket.key();
            double endRange = startRange + 1000.0; // 假设间隔为1000
            long count = bucket.docCount();
            log.info("价格区间: {}-{}, 商品数量: {}", startRange, endRange, count);
        }
    }
```

---

### 4. 日期直方图聚合：Date Histogram

#### DSL 示例：

```
//日期直方图聚合：
GET /product/_search
{
  "size": 0,
  "aggs": {
    "sales_over_time": {
      "date_histogram": {
        "field": "date",
        "calendar_interval": "month",
        "format": "yyyy-MM"
      }
    }
  }
}
```

#### Java 代码实现：

```
 // 日期直方图聚合：按月份统计
    public void dateHistogramAggregation() throws IOException {
        SearchResponse<Void> response = client.search(s -> s
                .index("product")
                .size(0)
                .aggregations("sales_over_time", a -> a
                        .dateHistogram(dh -> dh
                                .field("date")
                                .calendarInterval(CalendarInterval.Month)
                                .format("yyyy-MM")
                        )
                ), Void.class);

        DateHistogramAggregate dateHistogram = response.aggregations().get("sales_over_time").dateHistogram();
        for (DateHistogramBucket bucket : dateHistogram.buckets().array()) {
            log.info("销售统计 - 月份: {}, 商品销售数量: {}", bucket.key(), bucket.docCount());
        }
    }
```

---

### 5. 管道聚合：计算各月份平均价格的总体平均值

#### DSL 示例：

```
//管道聚合：计算各月份平均价格的总体平均值
GET /product/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {          // 第一层聚合：按月份分桶
      "date_histogram": {
        "field": "date",          // 使用日期字段
        "calendar_interval": "month", // 按月分组
        "format": "yyyy-MM"       // 格式化输出为"年-月"
      },
      "aggs": {
        "monthly_avg_price": {    // 子聚合：计算每月的平均价格
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "overall_avg_monthly_price": { // 第二层聚合：管道聚合
      "avg_bucket": {
        "buckets_path": "sales_per_month>monthly_avg_price" // 指向第一层聚合的结果
      }
    }
  }
}

```

#### Java 代码实现：

```
 // 多层聚合：按月统计销售及平均价格
    public void queryThenAggregate() throws IOException {
        SearchResponse<Void> response = client.search(s -> s
                .index("product")
                .size(0)
                .aggregations("sales_per_month", a -> a
                        .dateHistogram(dh -> dh
                                .field("date")
                                .calendarInterval(CalendarInterval.Month)
                                .format("yyyy-MM")
                        )
                        .aggregations("monthly_avg_price", a2 -> a2
                                .avg(avg -> avg.field("price"))
                        )
                )
                .aggregations("overall_avg_monthly_price", a -> a
                        .avgBucket(ab -> ab
                                .bucketsPath(bp -> bp
                                        .single("sales_per_month>monthly_avg_price")
                                )
                        )
                ), Void.class);

        // 解析第一层聚合：按月分桶
        DateHistogramAggregate salesPerMonth = response.aggregations().get("sales_per_month").dateHistogram();

        log.info("===== 按月销售统计 =====");
        for (DateHistogramBucket monthBucket : salesPerMonth.buckets().array()) {
            String month = monthBucket.keyAsString();
            long docCount = monthBucket.docCount();

            // 解析子聚合：月平均价格
            AvgAggregate monthlyAvgPrice = monthBucket.aggregations().get("monthly_avg_price").avg();
            double avgPrice = monthlyAvgPrice != null ? monthlyAvgPrice.value() : 0;

            log.info("月份: {}, 销售数量: {}, 平均价格: {}", month, docCount, avgPrice);
        }
        //获取第二层聚合：管道聚合
        Aggregate overallAgg = response.aggregations().get("overall_avg_monthly_price");

        // 处理 SimpleValue 类型的聚合
        if (overallAgg._kind().name().equals("SimpleValue")) {
            try {
                // 使用 simpleValue() 方法获取 SimpleValueAggregate
                co.elastic.clients.elasticsearch._types.aggregations.SimpleValueAggregate simpleValueAgg =
                        overallAgg.simpleValue();
                // 获取值
                double value = simpleValueAgg.value();
                log.info("所有月份平均价格的全局平均: {}", value);
            } catch (Exception e) {
                log.error("获取 SimpleValue 聚合值时出错: {}", e.getMessage());
            }
        } else {
            log.info("聚合类型不是 SimpleValue，实际类型: {}", overallAgg._kind());
        }

    }

```

---
