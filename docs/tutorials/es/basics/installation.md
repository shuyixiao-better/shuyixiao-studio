# Elasticsearch安装配置

> 工欲善其事，必先利其器。正确的安装配置是学习Elasticsearch的第一步。

## 系统要求

### 硬件要求
- **内存**：至少4GB，推荐8GB以上
- **CPU**：2核以上，推荐4核
- **磁盘**：SSD推荐，至少10GB可用空间
- **网络**：稳定的网络连接

### 软件要求
- **Java**：JDK 8或更高版本
- **操作系统**：Linux、Windows、macOS
- **浏览器**：用于访问Kibana界面

## 安装步骤

### 1. 安装Java环境

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk

# CentOS/RHEL
sudo yum install java-11-openjdk-devel

# macOS (使用Homebrew)
brew install openjdk@11

# 验证Java版本
java -version
```

### 2. 下载Elasticsearch

```bash
# 下载最新版本
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.0-linux-x86_64.tar.gz

# 解压
tar -xzf elasticsearch-8.11.0-linux-x86_64.tar.gz

# 移动到合适位置
sudo mv elasticsearch-8.11.0 /opt/elasticsearch
```

### 3. 创建专用用户

```bash
# 创建elasticsearch用户
sudo useradd -r -m -U -d /var/lib/elasticsearch -s /bin/bash elasticsearch

# 设置目录权限
sudo chown -R elasticsearch: /opt/elasticsearch
sudo chown -R elasticsearch: /var/lib/elasticsearch
```

### 4. 配置Elasticsearch

编辑配置文件 `/opt/elasticsearch/config/elasticsearch.yml`：

```yaml
# 集群名称
cluster.name: my-elasticsearch-cluster

# 节点名称
node.name: node-1

# 数据存储路径
path.data: /var/lib/elasticsearch

# 日志存储路径
path.logs: /var/log/elasticsearch

# 网络配置
network.host: 0.0.0.0
http.port: 9200

# 发现配置
discovery.type: single-node

# 安全配置（生产环境建议启用）
# xpack.security.enabled: true
# xpack.security.transport.ssl.enabled: true
```

### 5. 启动Elasticsearch

```bash
# 切换到elasticsearch用户
sudo su - elasticsearch

# 启动Elasticsearch
/opt/elasticsearch/bin/elasticsearch

# 后台运行
nohup /opt/elasticsearch/bin/elasticsearch > /dev/null 2>&1 &
```

## 验证安装

### 1. 检查服务状态

```bash
# 检查进程
ps aux | grep elasticsearch

# 检查端口
netstat -tlnp | grep 9200
```

### 2. 测试API

```bash
# 健康检查
curl -X GET "localhost:9200/_cluster/health?pretty"

# 节点信息
curl -X GET "localhost:9200/_nodes?pretty"

# 集群信息
curl -X GET "localhost:9200/_cluster/stats?pretty"
```

## 常见问题解决

### 1. 内存不足
```bash
# 设置JVM堆内存大小
export ES_HEAP_SIZE=2g
```

### 2. 文件描述符限制
```bash
# 临时设置
ulimit -n 65536

# 永久设置
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf
```

### 3. 虚拟内存限制
```bash
# 临时设置
sysctl -w vm.max_map_count=262144

# 永久设置
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
```

## Docker安装方式

### 1. 使用Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - es_data:/usr/share/elasticsearch/data

volumes:
  es_data:
    driver: local
```

### 2. 启动服务

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f elasticsearch

# 停止
docker-compose down
```

## 生产环境配置

### 1. 安全配置
```yaml
# 启用安全功能
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.http.ssl.enabled: true

# 设置密码
bin/elasticsearch-setup-passwords interactive
```

### 2. 性能优化
```yaml
# JVM堆内存设置
ES_HEAP_SIZE=4g

# 线程池配置
thread_pool.write.queue_size: 1000
thread_pool.search.queue_size: 1000

# 索引配置
index.number_of_shards: 3
index.number_of_replicas: 1
```

## 监控和维护

### 1. 健康监控
```bash
# 集群健康状态
curl -X GET "localhost:9200/_cluster/health?pretty"

# 节点状态
curl -X GET "localhost:9200/_nodes/stats?pretty"
```

### 2. 日志管理
```bash
# 查看日志
tail -f /var/log/elasticsearch/my-elasticsearch-cluster.log

# 日志轮转配置
sudo nano /etc/logrotate.d/elasticsearch
```

## 结语

正确的安装配置是使用Elasticsearch的基础。在生产环境中，还需要考虑安全、性能、监控等多个方面。建议在正式使用前，先在测试环境中充分验证配置的正确性。

---

*本文首发于个人博客，转载请注明出处。*
