---
layout: doc
title: 微服务RAG架构
description: # 微服务RAG架构
tags:
  - Python
  - RAG
  - AI
  - Elasticsearch
  - 架构设计
author: 舒一笑不秃头
---
# 微服务RAG架构

## 引言

微服务RAG架构是将RAG系统拆分为多个独立的微服务，每个服务负责特定的功能。这种架构模式提供了更好的可扩展性、可维护性和技术多样性。本文将深入探讨微服务RAG架构的设计原则、服务拆分策略、通信机制和部署方案。

## 微服务RAG架构概述

### 什么是微服务RAG架构

微服务RAG架构是一种将RAG系统拆分为多个独立、可独立部署的微服务的架构模式。每个微服务负责特定的业务功能，通过API进行通信，共同协作完成RAG系统的功能。

### 微服务架构的优势

```mermaid
graph TD
    A[微服务RAG架构优势] --> B[技术多样性]
    A --> C[独立部署]
    A --> D[故障隔离]
    A --> E[团队自治]
    A --> F[可扩展性]
    
    B --> B1[不同服务使用不同技术栈]
    B --> B2[选择最适合的工具]
    
    C --> C1[独立发布]
    C --> C2[快速迭代]
    
    D --> D1[单个服务故障不影响整体]
    D --> D2[提高系统稳定性]
    
    E --> E1[团队独立开发]
    E --> E2[减少协调成本]
    
    F --> F1[按需扩展]
    F --> F2[资源优化]
```

### 微服务架构的挑战

1. **分布式复杂性**：网络延迟、服务发现、配置管理
2. **数据一致性**：跨服务事务处理
3. **监控和调试**：分布式系统的可观测性
4. **服务治理**：版本管理、API兼容性
5. **安全考虑**：服务间认证和授权

## 服务拆分策略

### 1. 按业务功能拆分

#### 服务划分

```mermaid
graph TD
    A[微服务RAG系统] --> B[用户服务]
    A --> C[文档服务]
    A --> D[向量服务]
    A --> E[检索服务]
    A --> F[生成服务]
    A --> G[通知服务]
    A --> H[监控服务]
    
    B --> B1[用户管理]
    B --> B2[认证授权]
    B --> B3[权限控制]
    
    C --> C1[文档上传]
    C --> C2[文档处理]
    C --> C3[文档存储]
    
    D --> D1[向量化]
    D --> D2[向量存储]
    D --> D3[向量检索]
    
    E --> E1[相似度计算]
    E --> E2[结果排序]
    E --> E3[检索优化]
    
    F --> F1[提示构建]
    F --> F2[LLM调用]
    F --> F3[响应生成]
    
    G --> G1[消息推送]
    G --> G2[邮件通知]
    G --> G3[短信通知]
    
    H --> H1[性能监控]
    H --> H2[日志收集]
    H --> H3[告警管理]
```

#### 实现示例

```python
# 微服务RAG系统架构
class MicroserviceRAGSystem:
    def __init__(self):
        # 服务注册中心
        self.service_registry = ServiceRegistry()
        
        # 服务客户端
        self.user_client = UserServiceClient()
        self.document_client = DocumentServiceClient()
        self.vector_client = VectorServiceClient()
        self.retrieval_client = RetrievalServiceClient()
        self.generation_client = GenerationServiceClient()
        self.notification_client = NotificationServiceClient()
        self.monitoring_client = MonitoringServiceClient()
        
        # 注册服务
        self._register_services()
    
    def _register_services(self):
        """注册服务"""
        services = [
            ('user-service', self.user_client),
            ('document-service', self.document_client),
            ('vector-service', self.vector_client),
            ('retrieval-service', self.retrieval_client),
            ('generation-service', self.generation_client),
            ('notification-service', self.notification_client),
            ('monitoring-service', self.monitoring_client)
        ]
        
        for service_name, service_client in services:
            self.service_registry.register(service_name, service_client)
    
    def process_query(self, query: str, user_id: str) -> Dict[str, any]:
        """处理查询"""
        try:
            # 1. 用户认证
            auth_result = self.user_client.authenticate(user_id)
            if not auth_result['authenticated']:
                return {'error': '用户认证失败'}
            
            # 2. 检索相关文档
            retrieval_result = self.retrieval_client.retrieve(query)
            relevant_docs = retrieval_result['documents']
            
            # 3. 生成回答
            generation_result = self.generation_client.generate(query, relevant_docs)
            response = generation_result['response']
            
            # 4. 记录查询历史
            self.user_client.record_query_history(user_id, query, response)
            
            # 5. 发送通知（如果需要）
            if self._should_send_notification(user_id):
                self.notification_client.send_notification(user_id, response)
            
            # 6. 记录监控数据
            self.monitoring_client.record_query_metrics(user_id, query, response)
            
            return {
                'response': response,
                'relevant_docs': relevant_docs,
                'timestamp': time.time()
            }
            
        except Exception as e:
            # 错误处理
            self.monitoring_client.record_error(user_id, str(e))
            return {'error': f'处理查询失败: {str(e)}'}
    
    def _should_send_notification(self, user_id: str) -> bool:
        """判断是否需要发送通知"""
        user_preferences = self.user_client.get_user_preferences(user_id)
        return user_preferences.get('notifications_enabled', False)


class ServiceRegistry:
    def __init__(self):
        self.services = {}
        self.health_checker = HealthChecker()
        self.load_balancer = LoadBalancer()
    
    def register(self, service_name: str, service_client):
        """注册服务"""
        self.services[service_name] = {
            'client': service_client,
            'instances': [],
            'status': 'healthy',
            'last_check': time.time()
        }
    
    def discover_service(self, service_name: str):
        """服务发现"""
        if service_name in self.services:
            service_info = self.services[service_name]
            
            # 健康检查
            healthy_instances = []
            for instance in service_info['instances']:
                if self.health_checker.is_healthy(instance):
                    healthy_instances.append(instance)
            
            if healthy_instances:
                # 负载均衡
                selected_instance = self.load_balancer.select_instance(healthy_instances)
                return selected_instance
            else:
                # 服务不健康，尝试故障转移
                return self._failover_service(service_name)
        else:
            raise Exception(f'服务 {service_name} 不存在')
    
    def _failover_service(self, service_name: str):
        """故障转移"""
        # 实现故障转移逻辑
        pass


class HealthChecker:
    def __init__(self):
        self.check_interval = 30  # 30秒检查一次
        self.timeout = 5  # 5秒超时
    
    def is_healthy(self, instance) -> bool:
        """检查服务实例健康状态"""
        try:
            # 发送健康检查请求
            response = requests.get(f"{instance['url']}/health", timeout=self.timeout)
            return response.status_code == 200
        except:
            return False
    
    def check_all_services(self):
        """检查所有服务健康状态"""
        for service_name, service_info in self.services.items():
            for instance in service_info['instances']:
                instance['healthy'] = self.is_healthy(instance)


class LoadBalancer:
    def __init__(self):
        self.strategy = 'round_robin'  # 轮询策略
        self.current_index = 0
    
    def select_instance(self, instances: List[Dict[str, any]]) -> Dict[str, any]:
        """选择服务实例"""
        if not instances:
            raise Exception('没有可用的服务实例')
        
        if self.strategy == 'round_robin':
            instance = instances[self.current_index]
            self.current_index = (self.current_index + 1) % len(instances)
            return instance
        elif self.strategy == 'random':
            import random
            return random.choice(instances)
        elif self.strategy == 'least_connections':
            return min(instances, key=lambda x: x.get('connections', 0))
        else:
            return instances[0]


class UserServiceClient:
    def __init__(self):
        self.service_name = 'user-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def authenticate(self, user_id: str) -> Dict[str, any]:
        """用户认证"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/authenticate", json={
            'user_id': user_id
        })
        return response.json()
    
    def get_user_preferences(self, user_id: str) -> Dict[str, any]:
        """获取用户偏好"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.get(f"{instance['url']}/preferences/{user_id}")
        return response.json()
    
    def record_query_history(self, user_id: str, query: str, response: str):
        """记录查询历史"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/history", json={
            'user_id': user_id,
            'query': query,
            'response': response
        })


class DocumentServiceClient:
    def __init__(self):
        self.service_name = 'document-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def add_document(self, document: Dict[str, any]) -> str:
        """添加文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/documents", json=document)
        return response.json()['doc_id']
    
    def get_document(self, doc_id: str) -> Dict[str, any]:
        """获取文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.get(f"{instance['url']}/documents/{doc_id}")
        return response.json()
    
    def update_document(self, doc_id: str, document: Dict[str, any]) -> bool:
        """更新文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.put(f"{instance['url']}/documents/{doc_id}", json=document)
        return response.status_code == 200
    
    def delete_document(self, doc_id: str) -> bool:
        """删除文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.delete(f"{instance['url']}/documents/{doc_id}")
        return response.status_code == 200


class VectorServiceClient:
    def __init__(self):
        self.service_name = 'vector-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def vectorize_document(self, document: Dict[str, any]) -> List[float]:
        """向量化文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/vectorize", json=document)
        return response.json()['vector']
    
    def vectorize_query(self, query: str) -> List[float]:
        """向量化查询"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/vectorize-query", json={
            'query': query
        })
        return response.json()['vector']
    
    def search_similar_vectors(self, query_vector: List[float], top_k: int = 5) -> List[Dict[str, any]]:
        """搜索相似向量"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/search", json={
            'vector': query_vector,
            'top_k': top_k
        })
        return response.json()['results']


class RetrievalServiceClient:
    def __init__(self):
        self.service_name = 'retrieval-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def retrieve(self, query: str, top_k: int = 5) -> Dict[str, any]:
        """检索相关文档"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/retrieve", json={
            'query': query,
            'top_k': top_k
        })
        return response.json()
    
    def hybrid_search(self, query: str, filters: Dict[str, any] = None) -> Dict[str, any]:
        """混合搜索"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/hybrid-search", json={
            'query': query,
            'filters': filters
        })
        return response.json()


class GenerationServiceClient:
    def __init__(self):
        self.service_name = 'generation-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def generate(self, query: str, relevant_docs: List[Dict[str, any]]) -> Dict[str, any]:
        """生成回答"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/generate", json={
            'query': query,
            'relevant_docs': relevant_docs
        })
        return response.json()
    
    def generate_with_template(self, query: str, relevant_docs: List[Dict[str, any]], 
                             template: str) -> Dict[str, any]:
        """使用模板生成回答"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.post(f"{instance['url']}/generate-with-template", json={
            'query': query,
            'relevant_docs': relevant_docs,
            'template': template
        })
        return response.json()


class NotificationServiceClient:
    def __init__(self):
        self.service_name = 'notification-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def send_notification(self, user_id: str, message: str, 
                        notification_type: str = 'info'):
        """发送通知"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/notify", json={
            'user_id': user_id,
            'message': message,
            'type': notification_type
        })
    
    def send_email(self, user_id: str, subject: str, content: str):
        """发送邮件"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/email", json={
            'user_id': user_id,
            'subject': subject,
            'content': content
        })
    
    def send_sms(self, user_id: str, message: str):
        """发送短信"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/sms", json={
            'user_id': user_id,
            'message': message
        })


class MonitoringServiceClient:
    def __init__(self):
        self.service_name = 'monitoring-service'
        self.service_registry = None
    
    def set_service_registry(self, service_registry):
        """设置服务注册中心"""
        self.service_registry = service_registry
    
    def record_query_metrics(self, user_id: str, query: str, response: str):
        """记录查询指标"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/metrics/query", json={
            'user_id': user_id,
            'query': query,
            'response': response,
            'timestamp': time.time()
        })
    
    def record_error(self, user_id: str, error: str):
        """记录错误"""
        instance = self.service_registry.discover_service(self.service_name)
        requests.post(f"{instance['url']}/metrics/error", json={
            'user_id': user_id,
            'error': error,
            'timestamp': time.time()
        })
    
    def get_service_metrics(self, service_name: str) -> Dict[str, any]:
        """获取服务指标"""
        instance = self.service_registry.discover_service(self.service_name)
        response = requests.get(f"{instance['url']}/metrics/{service_name}")
        return response.json()
```

### 2. 按数据域拆分

#### 数据域划分

```mermaid
graph TD
    A[数据域拆分] --> B[用户域]
    A --> C[文档域]
    A --> D[向量域]
    A --> E[检索域]
    A --> F[生成域]
    
    B --> B1[用户数据]
    B --> B2[权限数据]
    B --> B3[偏好数据]
    
    C --> C1[文档内容]
    C --> C2[文档元数据]
    C --> C3[文档版本]
    
    D --> D1[向量数据]
    D --> D2[索引数据]
    D --> D3[相似度数据]
    
    E --> E1[检索配置]
    E --> E2[检索历史]
    E --> E3[检索结果]
    
    F --> F1[生成配置]
    F --> F2[生成历史]
    F --> F3[生成结果]
```

#### 实现示例

```python
# 按数据域拆分的微服务架构
class DataDomainMicroserviceRAGSystem:
    def __init__(self):
        # 数据域服务
        self.user_domain_service = UserDomainService()
        self.document_domain_service = DocumentDomainService()
        self.vector_domain_service = VectorDomainService()
        self.retrieval_domain_service = RetrievalDomainService()
        self.generation_domain_service = GenerationDomainService()
        
        # 服务协调器
        self.service_coordinator = ServiceCoordinator()
    
    def process_query(self, query: str, user_id: str) -> Dict[str, any]:
        """处理查询"""
        try:
            # 1. 用户域：获取用户信息和权限
            user_info = self.user_domain_service.get_user_info(user_id)
            if not user_info['authenticated']:
                return {'error': '用户认证失败'}
            
            # 2. 检索域：执行检索
            retrieval_result = self.retrieval_domain_service.retrieve(query, user_info)
            
            # 3. 生成域：生成回答
            generation_result = self.generation_domain_service.generate(
                query, retrieval_result, user_info
            )
            
            # 4. 用户域：记录查询历史
            self.user_domain_service.record_query_history(
                user_id, query, generation_result['response']
            )
            
            return {
                'response': generation_result['response'],
                'relevant_docs': retrieval_result['documents'],
                'timestamp': time.time()
            }
            
        except Exception as e:
            return {'error': f'处理查询失败: {str(e)}'}
    
    def add_document(self, document: Dict[str, any], user_id: str) -> str:
        """添加文档"""
        try:
            # 1. 用户域：检查权限
            if not self.user_domain_service.has_permission(user_id, 'add_document'):
                return {'error': '权限不足'}
            
            # 2. 文档域：处理文档
            processed_doc = self.document_domain_service.process_document(document)
            
            # 3. 向量域：向量化文档
            vector = self.vector_domain_service.vectorize_document(processed_doc)
            
            # 4. 文档域：存储文档
            doc_id = self.document_domain_service.store_document(processed_doc)
            
            # 5. 向量域：存储向量
            self.vector_domain_service.store_vector(doc_id, vector)
            
            return {'doc_id': doc_id}
            
        except Exception as e:
            return {'error': f'添加文档失败: {str(e)}'}


class UserDomainService:
    def __init__(self):
        self.user_db = UserDatabase()
        self.permission_db = PermissionDatabase()
        self.preference_db = PreferenceDatabase()
    
    def get_user_info(self, user_id: str) -> Dict[str, any]:
        """获取用户信息"""
        user = self.user_db.get_user(user_id)
        permissions = self.permission_db.get_user_permissions(user_id)
        preferences = self.preference_db.get_user_preferences(user_id)
        
        return {
            'authenticated': user is not None,
            'user': user,
            'permissions': permissions,
            'preferences': preferences
        }
    
    def has_permission(self, user_id: str, permission: str) -> bool:
        """检查权限"""
        permissions = self.permission_db.get_user_permissions(user_id)
        return permission in permissions
    
    def record_query_history(self, user_id: str, query: str, response: str):
        """记录查询历史"""
        self.user_db.add_query_history(user_id, query, response)


class DocumentDomainService:
    def __init__(self):
        self.document_db = DocumentDatabase()
        self.metadata_db = MetadataDatabase()
        self.version_db = VersionDatabase()
        self.processor = DocumentProcessor()
    
    def process_document(self, document: Dict[str, any]) -> Dict[str, any]:
        """处理文档"""
        # 处理文档内容
        processed_content = self.processor.process_document(document)
        
        # 提取元数据
        metadata = self.processor.extract_metadata(document)
        
        # 生成版本信息
        version = self.processor.generate_version(document)
        
        return {
            'content': processed_content,
            'metadata': metadata,
            'version': version
        }
    
    def store_document(self, processed_doc: Dict[str, any]) -> str:
        """存储文档"""
        # 存储文档内容
        doc_id = self.document_db.store_document(processed_doc['content'])
        
        # 存储元数据
        self.metadata_db.store_metadata(doc_id, processed_doc['metadata'])
        
        # 存储版本信息
        self.version_db.store_version(doc_id, processed_doc['version'])
        
        return doc_id
    
    def get_document(self, doc_id: str) -> Dict[str, any]:
        """获取文档"""
        content = self.document_db.get_document(doc_id)
        metadata = self.metadata_db.get_metadata(doc_id)
        version = self.version_db.get_version(doc_id)
        
        return {
            'content': content,
            'metadata': metadata,
            'version': version
        }


class VectorDomainService:
    def __init__(self):
        self.vector_db = VectorDatabase()
        self.index_db = IndexDatabase()
        self.similarity_db = SimilarityDatabase()
        self.vectorizer = Vectorizer()
    
    def vectorize_document(self, document: Dict[str, any]) -> List[float]:
        """向量化文档"""
        return self.vectorizer.vectorize_document(document['content'])
    
    def store_vector(self, doc_id: str, vector: List[float]):
        """存储向量"""
        # 存储向量
        self.vector_db.store_vector(doc_id, vector)
        
        # 更新索引
        self.index_db.update_index(doc_id, vector)
        
        # 计算相似度
        similarities = self._calculate_similarities(doc_id, vector)
        self.similarity_db.store_similarities(doc_id, similarities)
    
    def search_similar_vectors(self, query_vector: List[float], 
                             top_k: int = 5) -> List[Dict[str, any]]:
        """搜索相似向量"""
        # 使用索引搜索
        similar_vectors = self.index_db.search(query_vector, top_k)
        
        # 获取详细信息
        results = []
        for vector_info in similar_vectors:
            doc_id = vector_info['doc_id']
            similarity = vector_info['similarity']
            
            results.append({
                'doc_id': doc_id,
                'similarity': similarity,
                'vector': self.vector_db.get_vector(doc_id)
            })
        
        return results
    
    def _calculate_similarities(self, doc_id: str, vector: List[float]) -> List[Dict[str, any]]:
        """计算相似度"""
        # 计算与其他文档的相似度
        similarities = []
        all_vectors = self.vector_db.get_all_vectors()
        
        for other_doc_id, other_vector in all_vectors.items():
            if other_doc_id != doc_id:
                similarity = self.vectorizer.calculate_similarity(vector, other_vector)
                similarities.append({
                    'doc_id': other_doc_id,
                    'similarity': similarity
                })
        
        return similarities


class RetrievalDomainService:
    def __init__(self):
        self.config_db = RetrievalConfigDatabase()
        self.history_db = RetrievalHistoryDatabase()
        self.result_db = RetrievalResultDatabase()
        self.retriever = Retriever()
    
    def retrieve(self, query: str, user_info: Dict[str, any]) -> Dict[str, any]:
        """执行检索"""
        # 获取检索配置
        config = self.config_db.get_config(user_info['user']['id'])
        
        # 执行检索
        results = self.retriever.retrieve(query, config)
        
        # 记录检索历史
        self.history_db.record_retrieval(user_info['user']['id'], query, results)
        
        # 存储检索结果
        result_id = self.result_db.store_result(query, results)
        
        return {
            'documents': results,
            'result_id': result_id,
            'config': config
        }
    
    def get_retrieval_history(self, user_id: str) -> List[Dict[str, any]]:
        """获取检索历史"""
        return self.history_db.get_history(user_id)
    
    def update_retrieval_config(self, user_id: str, config: Dict[str, any]):
        """更新检索配置"""
        self.config_db.update_config(user_id, config)


class GenerationDomainService:
    def __init__(self):
        self.config_db = GenerationConfigDatabase()
        self.history_db = GenerationHistoryDatabase()
        self.result_db = GenerationResultDatabase()
        self.generator = Generator()
    
    def generate(self, query: str, retrieval_result: Dict[str, any], 
                user_info: Dict[str, any]) -> Dict[str, any]:
        """生成回答"""
        # 获取生成配置
        config = self.config_db.get_config(user_info['user']['id'])
        
        # 生成回答
        response = self.generator.generate(query, retrieval_result['documents'], config)
        
        # 记录生成历史
        self.history_db.record_generation(user_info['user']['id'], query, response)
        
        # 存储生成结果
        result_id = self.result_db.store_result(query, response)
        
        return {
            'response': response,
            'result_id': result_id,
            'config': config
        }
    
    def get_generation_history(self, user_id: str) -> List[Dict[str, any]]:
        """获取生成历史"""
        return self.history_db.get_history(user_id)
    
    def update_generation_config(self, user_id: str, config: Dict[str, any]):
        """更新生成配置"""
        self.config_db.update_config(user_id, config)


class ServiceCoordinator:
    def __init__(self):
        self.service_clients = {}
        self.transaction_manager = TransactionManager()
    
    def coordinate_transaction(self, operations: List[Dict[str, any]]) -> Dict[str, any]:
        """协调事务"""
        try:
            # 开始事务
            transaction_id = self.transaction_manager.begin_transaction()
            
            # 执行操作
            results = []
            for operation in operations:
                service_name = operation['service']
                action = operation['action']
                data = operation['data']
                
                result = self._execute_operation(service_name, action, data)
                results.append(result)
            
            # 提交事务
            self.transaction_manager.commit_transaction(transaction_id)
            
            return {
                'success': True,
                'results': results,
                'transaction_id': transaction_id
            }
            
        except Exception as e:
            # 回滚事务
            self.transaction_manager.rollback_transaction(transaction_id)
            
            return {
                'success': False,
                'error': str(e),
                'transaction_id': transaction_id
            }
    
    def _execute_operation(self, service_name: str, action: str, data: Dict[str, any]):
        """执行操作"""
        if service_name in self.service_clients:
            service_client = self.service_clients[service_name]
            return service_client.execute_action(action, data)
        else:
            raise Exception(f'服务 {service_name} 不存在')
    
    def set_service_client(self, service_name: str, service_client):
        """设置服务客户端"""
        self.service_clients[service_name] = service_client


class TransactionManager:
    def __init__(self):
        self.transactions = {}
        self.transaction_counter = 0
    
    def begin_transaction(self) -> str:
        """开始事务"""
        transaction_id = f"tx_{self.transaction_counter}"
        self.transaction_counter += 1
        
        self.transactions[transaction_id] = {
            'status': 'active',
            'operations': [],
            'start_time': time.time()
        }
        
        return transaction_id
    
    def commit_transaction(self, transaction_id: str):
        """提交事务"""
        if transaction_id in self.transactions:
            self.transactions[transaction_id]['status'] = 'committed'
            self.transactions[transaction_id]['end_time'] = time.time()
    
    def rollback_transaction(self, transaction_id: str):
        """回滚事务"""
        if transaction_id in self.transactions:
            self.transactions[transaction_id]['status'] = 'rolled_back'
            self.transactions[transaction_id]['end_time'] = time.time()
    
    def get_transaction_status(self, transaction_id: str) -> str:
        """获取事务状态"""
        if transaction_id in self.transactions:
            return self.transactions[transaction_id]['status']
        else:
            return 'not_found'
```

## 服务间通信

### 1. 同步通信

#### HTTP/REST通信

```python
class HTTPCommunication:
    def __init__(self):
        self.http_client = HttpClient()
        self.circuit_breaker = CircuitBreaker()
        self.retry_handler = RetryHandler()
    
    def call_service(self, service_name: str, endpoint: str, 
                    data: Dict[str, any]) -> Dict[str, any]:
        """调用服务"""
        try:
            # 检查熔断器状态
            if not self.circuit_breaker.can_execute(service_name):
                return {'error': '服务熔断'}
            
            # 执行重试逻辑
            return self.retry_handler.execute_with_retry(
                lambda: self._make_http_request(service_name, endpoint, data)
            )
            
        except Exception as e:
            # 记录失败
            self.circuit_breaker.record_failure(service_name)
            
            return {'error': f'调用服务失败: {str(e)}'}
    
    def _make_http_request(self, service_name: str, endpoint: str, 
                          data: Dict[str, any]) -> Dict[str, any]:
        """发起HTTP请求"""
        url = f"http://{service_name}{endpoint}"
        response = self.http_client.post(url, json=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f'HTTP错误: {response.status_code}')
    
    def call_service_with_timeout(self, service_name: str, endpoint: str, 
                                data: Dict[str, any], timeout: int = 30) -> Dict[str, any]:
        """带超时的服务调用"""
        try:
            response = self.http_client.post(
                f"http://{service_name}{endpoint}",
                json=data,
                timeout=timeout
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {'error': f'HTTP错误: {response.status_code}'}
                
        except requests.exceptions.Timeout:
            return {'error': '请求超时'}
        except Exception as e:
            return {'error': f'请求失败: {str(e)}'}


class HttpClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'RAG-Microservice-Client/1.0'
        })
    
    def get(self, url: str, params: Dict = None, timeout: int = 30) -> requests.Response:
        """GET请求"""
        return self.session.get(url, params=params, timeout=timeout)
    
    def post(self, url: str, data: Dict = None, timeout: int = 30) -> requests.Response:
        """POST请求"""
        return self.session.post(url, json=data, timeout=timeout)
    
    def put(self, url: str, data: Dict = None, timeout: int = 30) -> requests.Response:
        """PUT请求"""
        return self.session.put(url, json=data, timeout=timeout)
    
    def delete(self, url: str, timeout: int = 30) -> requests.Response:
        """DELETE请求"""
        return self.session.delete(url, timeout=timeout)


class CircuitBreaker:
    def __init__(self):
        self.service_states = {}
        self.failure_threshold = 5
        self.timeout = 60
        self.half_open_max_calls = 3
    
    def can_execute(self, service_name: str) -> bool:
        """检查是否可以执行"""
        if service_name not in self.service_states:
            self.service_states[service_name] = {
                'state': 'closed',
                'failure_count': 0,
                'last_failure_time': 0,
                'half_open_calls': 0
            }
        
        state = self.service_states[service_name]
        
        if state['state'] == 'open':
            # 检查是否应该尝试恢复
            if time.time() - state['last_failure_time'] > self.timeout:
                state['state'] = 'half-open'
                state['half_open_calls'] = 0
                return True
            return False
        
        elif state['state'] == 'half-open':
            # 半开状态，限制调用次数
            if state['half_open_calls'] < self.half_open_max_calls:
                state['half_open_calls'] += 1
                return True
            return False
        
        return True
    
    def record_success(self, service_name: str):
        """记录成功"""
        if service_name in self.service_states:
            state = self.service_states[service_name]
            state['state'] = 'closed'
            state['failure_count'] = 0
            state['half_open_calls'] = 0
    
    def record_failure(self, service_name: str):
        """记录失败"""
        if service_name not in self.service_states:
            self.service_states[service_name] = {
                'state': 'closed',
                'failure_count': 0,
                'last_failure_time': 0,
                'half_open_calls': 0
            }
        
        state = self.service_states[service_name]
        state['failure_count'] += 1
        state['last_failure_time'] = time.time()
        
        if state['failure_count'] >= self.failure_threshold:
            state['state'] = 'open'


class RetryHandler:
    def __init__(self):
        self.max_retries = 3
        self.base_delay = 1  # 基础延迟1秒
        self.max_delay = 60  # 最大延迟60秒
    
    def execute_with_retry(self, operation, max_retries: int = None) -> any:
        """执行重试逻辑"""
        if max_retries is None:
            max_retries = self.max_retries
        
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                return operation()
            except Exception as e:
                last_exception = e
                
                if attempt < max_retries:
                    # 计算延迟时间（指数退避）
                    delay = min(self.base_delay * (2 ** attempt), self.max_delay)
                    time.sleep(delay)
                else:
                    break
        
        raise last_exception
```

#### gRPC通信

```python
import grpc
from concurrent import futures
import threading

class GRPCCommunication:
    def __init__(self):
        self.channels = {}
        self.stubs = {}
        self.server = None
    
    def create_channel(self, service_name: str, host: str, port: int):
        """创建gRPC通道"""
        channel = grpc.insecure_channel(f"{host}:{port}")
        self.channels[service_name] = channel
        
        # 创建存根
        # 这里需要根据实际的protobuf定义创建存根
        # stub = YourServiceStub(channel)
        # self.stubs[service_name] = stub
    
    def call_service(self, service_name: str, method: str, 
                    request_data: Dict[str, any]) -> Dict[str, any]:
        """调用gRPC服务"""
        try:
            if service_name not in self.stubs:
                raise Exception(f'服务 {service_name} 不存在')
            
            stub = self.stubs[service_name]
            
            # 根据方法名调用相应的gRPC方法
            # 这里需要根据实际的protobuf定义实现
            # response = getattr(stub, method)(request_data)
            
            # 模拟响应
            response = {'result': 'success', 'data': request_data}
            
            return response
            
        except Exception as e:
            return {'error': f'gRPC调用失败: {str(e)}'}
    
    def start_server(self, port: int):
        """启动gRPC服务器"""
        self.server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        
        # 添加服务实现
        # 这里需要根据实际的protobuf定义添加服务
        # add_YourServiceServicer_to_server(YourServiceServicer(), self.server)
        
        self.server.add_insecure_port(f'[::]:{port}')
        self.server.start()
        
        print(f'gRPC服务器启动在端口 {port}')
    
    def stop_server(self):
        """停止gRPC服务器"""
        if self.server:
            self.server.stop(0)
```

### 2. 异步通信

#### 消息队列通信

```python
import asyncio
import aio_pika
from typing import Dict, Any, Callable

class MessageQueueCommunication:
    def __init__(self):
        self.connection = None
        self.channel = None
        self.queues = {}
        self.consumers = {}
        self.publishers = {}
    
    async def initialize(self, rabbitmq_url: str):
        """初始化消息队列连接"""
        self.connection = await aio_pika.connect_robust(rabbitmq_url)
        self.channel = await self.connection.channel()
        
        # 声明交换器
        await self._declare_exchanges()
        
        # 声明队列
        await self._declare_queues()
    
    async def _declare_exchanges(self):
        """声明交换器"""
        # 声明主题交换器
        self.topic_exchange = await self.channel.declare_exchange(
            'rag.topic', aio_pika.ExchangeType.TOPIC
        )
        
        # 声明直接交换器
        self.direct_exchange = await self.channel.declare_exchange(
            'rag.direct', aio_pika.ExchangeType.DIRECT
        )
    
    async def _declare_queues(self):
        """声明队列"""
        # 声明各服务的队列
        services = [
            'user-service',
            'document-service',
            'vector-service',
            'retrieval-service',
            'generation-service',
            'notification-service'
        ]
        
        for service in services:
            queue = await self.channel.declare_queue(f"{service}.queue")
            self.queues[service] = queue
            
            # 绑定队列到交换器
            await queue.bind(self.topic_exchange, f"{service}.*")
    
    async def publish_message(self, service_name: str, message: Dict[str, any], 
                            routing_key: str = None):
        """发布消息"""
        if routing_key is None:
            routing_key = f"{service_name}.default"
        
        message_body = json.dumps(message).encode()
        
        await self.topic_exchange.publish(
            aio_pika.Message(message_body),
            routing_key=routing_key
        )
    
    async def subscribe_to_queue(self, service_name: str, 
                               message_handler: Callable):
        """订阅队列"""
        if service_name not in self.queues:
            raise Exception(f'服务 {service_name} 的队列不存在')
        
        queue = self.queues[service_name]
        
        async def consumer():
            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        try:
                            message_data = json.loads(message.body.decode())
                            await message_handler(message_data)
                        except Exception as e:
                            print(f'处理消息失败: {e}')
        
        # 启动消费者
        asyncio.create_task(consumer())
    
    async def publish_event(self, event_type: str, event_data: Dict[str, any]):
        """发布事件"""
        event_message = {
            'type': event_type,
            'data': event_data,
            'timestamp': time.time()
        }
        
        await self.topic_exchange.publish(
            aio_pika.Message(json.dumps(event_message).encode()),
            routing_key=f"event.{event_type}"
        )
    
    async def subscribe_to_events(self, event_types: List[str], 
                                 event_handler: Callable):
        """订阅事件"""
        # 创建事件队列
        event_queue = await self.channel.declare_queue(
            'event.queue', exclusive=True
        )
        
        # 绑定到事件交换器
        for event_type in event_types:
            await event_queue.bind(
                self.topic_exchange, 
                f"event.{event_type}"
            )
        
        async def event_consumer():
            async with event_queue.iterator() as queue_iter:
                async for message in queue_iter:
                    async with message.process():
                        try:
                            event_data = json.loads(message.body.decode())
                            await event_handler(event_data)
                        except Exception as e:
                            print(f'处理事件失败: {e}')
        
        # 启动事件消费者
        asyncio.create_task(event_consumer())
    
    async def close(self):
        """关闭连接"""
        if self.connection:
            await self.connection.close()


class EventDrivenMicroserviceRAGSystem:
    def __init__(self):
        self.message_queue = MessageQueueCommunication()
        self.event_handlers = {}
        self.service_clients = {}
    
    async def initialize(self, rabbitmq_url: str):
        """初始化系统"""
        await self.message_queue.initialize(rabbitmq_url)
        
        # 注册事件处理器
        self._register_event_handlers()
        
        # 订阅事件
        await self._subscribe_to_events()
    
    def _register_event_handlers(self):
        """注册事件处理器"""
        self.event_handlers = {
            'user_query': self._handle_user_query,
            'document_added': self._handle_document_added,
            'document_updated': self._handle_document_updated,
            'document_deleted': self._handle_document_deleted,
            'vectorization_completed': self._handle_vectorization_completed,
            'retrieval_completed': self._handle_retrieval_completed,
            'generation_completed': self._handle_generation_completed
        }
    
    async def _subscribe_to_events(self):
        """订阅事件"""
        event_types = list(self.event_handlers.keys())
        
        await self.message_queue.subscribe_to_events(
            event_types, 
            self._process_event
        )
    
    async def _process_event(self, event_data: Dict[str, any]):
        """处理事件"""
        event_type = event_data['type']
        
        if event_type in self.event_handlers:
            handler = self.event_handlers[event_type]
            await handler(event_data['data'])
    
    async def _handle_user_query(self, data: Dict[str, any]):
        """处理用户查询事件"""
        user_id = data['user_id']
        query = data['query']
        
        # 发布检索事件
        await self.message_queue.publish_event('retrieval_requested', {
            'user_id': user_id,
            'query': query
        })
    
    async def _handle_document_added(self, data: Dict[str, any]):
        """处理文档添加事件"""
        doc_id = data['doc_id']
        document = data['document']
        
        # 发布向量化事件
        await self.message_queue.publish_event('vectorization_requested', {
            'doc_id': doc_id,
            'document': document
        })
    
    async def _handle_document_updated(self, data: Dict[str, any]):
        """处理文档更新事件"""
        doc_id = data['doc_id']
        document = data['document']
        
        # 发布向量化事件
        await self.message_queue.publish_event('vectorization_requested', {
            'doc_id': doc_id,
            'document': document
        })
    
    async def _handle_document_deleted(self, data: Dict[str, any]):
        """处理文档删除事件"""
        doc_id = data['doc_id']
        
        # 发布索引删除事件
        await self.message_queue.publish_event('index_deletion_requested', {
            'doc_id': doc_id
        })
    
    async def _handle_vectorization_completed(self, data: Dict[str, any]):
        """处理向量化完成事件"""
        doc_id = data['doc_id']
        vector = data['vector']
        
        # 发布索引更新事件
        await self.message_queue.publish_event('index_update_requested', {
            'doc_id': doc_id,
            'vector': vector
        })
    
    async def _handle_retrieval_completed(self, data: Dict[str, any]):
        """处理检索完成事件"""
        user_id = data['user_id']
        query = data['query']
        documents = data['documents']
        
        # 发布生成事件
        await self.message_queue.publish_event('generation_requested', {
            'user_id': user_id,
            'query': query,
            'documents': documents
        })
    
    async def _handle_generation_completed(self, data: Dict[str, any]):
        """处理生成完成事件"""
        user_id = data['user_id']
        query = data['query']
        response = data['response']
        
        # 发布通知事件
        await self.message_queue.publish_event('notification_requested', {
            'user_id': user_id,
            'message': f'查询 "{query}" 的回答已生成',
            'type': 'query_completed'
        })
    
    async def process_query(self, query: str, user_id: str):
        """处理查询"""
        # 发布用户查询事件
        await self.message_queue.publish_event('user_query', {
            'user_id': user_id,
            'query': query,
            'timestamp': time.time()
        })
    
    async def add_document(self, document: Dict[str, any], user_id: str):
        """添加文档"""
        # 发布文档添加事件
        await self.message_queue.publish_event('document_added', {
            'user_id': user_id,
            'document': document,
            'timestamp': time.time()
        })
    
    async def close(self):
        """关闭系统"""
        await self.message_queue.close()
```

## 部署和运维

### 1. 容器化部署

#### Docker配置

```dockerfile
# Dockerfile for RAG Microservice
FROM python:3.9-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "main.py"]
```

#### Docker Compose配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API网关
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    environment:
      - SERVICE_REGISTRY_URL=http://consul:8500
    depends_on:
      - consul
      - user-service
      - document-service
      - vector-service
      - retrieval-service
      - generation-service
      - notification-service

  # 用户服务
  user-service:
    build: ./user-service
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/user_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # 文档服务
  document-service:
    build: ./document-service
    ports:
      - "8002:8002"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/document_db
      - STORAGE_URL=s3://bucket/documents
    depends_on:
      - postgres
      - minio

  # 向量服务
  vector-service:
    build: ./vector-service
    ports:
      - "8003:8003"
    environment:
      - VECTOR_DB_URL=http://qdrant:6333
      - EMBEDDING_MODEL_URL=http://embedding-service:8004
    depends_on:
      - qdrant
      - embedding-service

  # 检索服务
  retrieval-service:
    build: ./retrieval-service
    ports:
      - "8004:8004"
    environment:
      - VECTOR_SERVICE_URL=http://vector-service:8003
      - DOCUMENT_SERVICE_URL=http://document-service:8002
    depends_on:
      - vector-service
      - document-service

  # 生成服务
  generation-service:
    build: ./generation-service
    ports:
      - "8005:8005"
    environment:
      - LLM_API_URL=http://llm-service:8006
      - PROMPT_TEMPLATE_URL=http://template-service:8007
    depends_on:
      - llm-service
      - template-service

  # 通知服务
  notification-service:
    build: ./notification-service
    ports:
      - "8006:8006"
    environment:
      - SMTP_SERVER=smtp.gmail.com
      - SMTP_PORT=587
      - SMTP_USERNAME=your-email@gmail.com
      - SMTP_PASSWORD=your-password
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - rabbitmq

  # 监控服务
  monitoring-service:
    build: ./monitoring-service
    ports:
      - "8007:8007"
    environment:
      - PROMETHEUS_URL=http://prometheus:9090
      - GRAFANA_URL=http://grafana:3000
    depends_on:
      - prometheus
      - grafana

  # 基础设施服务
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    command: consul agent -server -bootstrap-expect=1 -data-dir=/tmp/consul -ui -client=0.0.0.0

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=rag_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  qdrant_data:
  grafana_data:
```

### 2. Kubernetes部署

#### 部署配置

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rag-microservice-system
  labels:
    app: rag-microservice
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rag-microservice
  template:
    metadata:
      labels:
        app: rag-microservice
    spec:
      containers:
      - name: api-gateway
        image: rag-microservice/api-gateway:latest
        ports:
        - containerPort: 8000
        env:
        - name: SERVICE_REGISTRY_URL
          value: "http://consul-service:8500"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
spec:
  selector:
    app: rag-microservice
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: rag-microservice/user-service:latest
        ports:
        - containerPort: 8001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - protocol: TCP
    port: 8001
    targetPort: 8001

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: document-service
  labels:
    app: document-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: document-service
  template:
    metadata:
      labels:
        app: document-service
    spec:
      containers:
      - name: document-service
        image: rag-microservice/document-service:latest
        ports:
        - containerPort: 8002
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: STORAGE_URL
          valueFrom:
            secretKeyRef:
              name: storage-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "400m"

---
apiVersion: v1
kind: Service
metadata:
  name: document-service
spec:
  selector:
    app: document-service
  ports:
  - protocol: TCP
    port: 8002
    targetPort: 8002

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vector-service
  labels:
    app: vector-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vector-service
  template:
    metadata:
      labels:
        app: vector-service
    spec:
      containers:
      - name: vector-service
        image: rag-microservice/vector-service:latest
        ports:
        - containerPort: 8003
        env:
        - name: VECTOR_DB_URL
          value: "http://qdrant-service:6333"
        resources:
          requests:
            memory: "512Mi"
            cpu: "400m"
          limits:
            memory: "1Gi"
            cpu: "800m"

---
apiVersion: v1
kind: Service
metadata:
  name: vector-service
spec:
  selector:
    app: vector-service
  ports:
  - protocol: TCP
    port: 8003
    targetPort: 8003

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: retrieval-service
  labels:
    app: retrieval-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: retrieval-service
  template:
    metadata:
      labels:
        app: retrieval-service
    spec:
      containers:
      - name: retrieval-service
        image: rag-microservice/retrieval-service:latest
        ports:
        - containerPort: 8004
        env:
        - name: VECTOR_SERVICE_URL
          value: "http://vector-service:8003"
        - name: DOCUMENT_SERVICE_URL
          value: "http://document-service:8002"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "400m"

---
apiVersion: v1
kind: Service
metadata:
  name: retrieval-service
spec:
  selector:
    app: retrieval-service
  ports:
  - protocol: TCP
    port: 8004
    targetPort: 8004

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: generation-service
  labels:
    app: generation-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: generation-service
  template:
    metadata:
      labels:
        app: generation-service
    spec:
      containers:
      - name: generation-service
        image: rag-microservice/generation-service:latest
        ports:
        - containerPort: 8005
        env:
        - name: LLM_API_URL
          valueFrom:
            secretKeyRef:
              name: llm-secret
              key: url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"

---
apiVersion: v1
kind: Service
metadata:
  name: generation-service
spec:
  selector:
    app: generation-service
  ports:
  - protocol: TCP
    port: 8005
    targetPort: 8005

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
  labels:
    app: notification-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
    spec:
      containers:
      - name: notification-service
        image: rag-microservice/notification-service:latest
        ports:
        - containerPort: 8006
        env:
        - name: RABBITMQ_URL
          value: "amqp://rabbitmq-service:5672"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: notification-service
spec:
  selector:
    app: notification-service
  ports:
  - protocol: TCP
    port: 8006
    targetPort: 8006
```

### 3. 监控和运维

#### 监控配置

```python
# 监控服务实现
class MonitoringService:
    def __init__(self):
        self.metrics_collector = MetricsCollector()
        self.alert_manager = AlertManager()
        self.dashboard = Dashboard()
    
    def collect_metrics(self, service_name: str) -> Dict[str, any]:
        """收集服务指标"""
        metrics = {
            'service_name': service_name,
            'timestamp': time.time(),
            'cpu_usage': self._get_cpu_usage(),
            'memory_usage': self._get_memory_usage(),
            'request_count': self._get_request_count(service_name),
            'error_count': self._get_error_count(service_name),
            'response_time': self._get_response_time(service_name),
            'throughput': self._get_throughput(service_name)
        }
        
        return metrics
    
    def _get_cpu_usage(self) -> float:
        """获取CPU使用率"""
        import psutil
        return psutil.cpu_percent()
    
    def _get_memory_usage(self) -> float:
        """获取内存使用率"""
        import psutil
        return psutil.virtual_memory().percent
    
    def _get_request_count(self, service_name: str) -> int:
        """获取请求数量"""
        # 从日志或监控系统获取
        return 0
    
    def _get_error_count(self, service_name: str) -> int:
        """获取错误数量"""
        # 从日志或监控系统获取
        return 0
    
    def _get_response_time(self, service_name: str) -> float:
        """获取响应时间"""
        # 从日志或监控系统获取
        return 0.0
    
    def _get_throughput(self, service_name: str) -> float:
        """获取吞吐量"""
        # 从日志或监控系统获取
        return 0.0
    
    def check_alerts(self, metrics: Dict[str, any]):
        """检查告警"""
        service_name = metrics['service_name']
        
        # CPU使用率告警
        if metrics['cpu_usage'] > 80:
            self.alert_manager.send_alert(
                f'{service_name} CPU使用率过高: {metrics["cpu_usage"]}%'
            )
        
        # 内存使用率告警
        if metrics['memory_usage'] > 85:
            self.alert_manager.send_alert(
                f'{service_name} 内存使用率过高: {metrics["memory_usage"]}%'
            )
        
        # 错误率告警
        if metrics['error_count'] > 10:
            self.alert_manager.send_alert(
                f'{service_name} 错误数量过多: {metrics["error_count"]}'
            )
        
        # 响应时间告警
        if metrics['response_time'] > 5.0:
            self.alert_manager.send_alert(
                f'{service_name} 响应时间过长: {metrics["response_time"]}s'
            )
    
    def generate_report(self, service_name: str, time_range: str) -> Dict[str, any]:
        """生成监控报告"""
        report = {
            'service_name': service_name,
            'time_range': time_range,
            'summary': {
                'total_requests': 0,
                'total_errors': 0,
                'avg_response_time': 0.0,
                'avg_throughput': 0.0
            },
            'trends': {
                'cpu_usage': [],
                'memory_usage': [],
                'response_time': [],
                'throughput': []
            },
            'alerts': []
        }
        
        return report


class MetricsCollector:
    def __init__(self):
        self.metrics_store = MetricsStore()
    
    def collect_and_store(self, service_name: str):
        """收集并存储指标"""
        metrics = self.collect_metrics(service_name)
        self.metrics_store.store_metrics(metrics)
    
    def collect_metrics(self, service_name: str) -> Dict[str, any]:
        """收集指标"""
        # 实现指标收集逻辑
        pass


class AlertManager:
    def __init__(self):
        self.notification_channels = []
    
    def send_alert(self, message: str):
        """发送告警"""
        for channel in self.notification_channels:
            channel.send_alert(message)
    
    def add_notification_channel(self, channel):
        """添加通知渠道"""
        self.notification_channels.append(channel)


class Dashboard:
    def __init__(self):
        self.dashboard_data = {}
    
    def update_dashboard(self, service_name: str, metrics: Dict[str, any]):
        """更新仪表板"""
        self.dashboard_data[service_name] = metrics
    
    def get_dashboard_data(self) -> Dict[str, any]:
        """获取仪表板数据"""
        return self.dashboard_data
```

## 最佳实践

### 1. 微服务设计原则

```python
def apply_microservice_design_principles(service_design: dict) -> List[str]:
    """应用微服务设计原则"""
    principles = []
    
    # 单一职责原则
    if len(service_design['responsibilities']) > 1:
        principles.append("每个服务应该只有一个职责")
    
    # 自治性原则
    if not service_design['autonomous']:
        principles.append("服务应该是自治的，不依赖其他服务")
    
    # 数据所有权原则
    if not service_design['data_ownership']:
        principles.append("每个服务应该拥有自己的数据")
    
    # 故障隔离原则
    if not service_design['fault_isolation']:
        principles.append("服务故障应该被隔离，不影响其他服务")
    
    return principles
```

### 2. 微服务架构建议

```python
class MicroserviceArchitectureAdvisor:
    def __init__(self):
        self.architecture_patterns = {}
    
    def get_architecture_recommendations(self, requirements: Dict[str, any]) -> List[str]:
        """获取架构建议"""
        recommendations = []
        
        # 基于需求提供建议
        if requirements.get('scale', 0) > 0.8:
            recommendations.append("使用微服务架构支持水平扩展")
        
        if requirements.get('team_size', 0) > 10:
            recommendations.append("按团队拆分微服务")
        
        if requirements.get('technology_diversity', False):
            recommendations.append("允许不同服务使用不同技术栈")
        
        if requirements.get('deployment_frequency', 0) > 0.8:
            recommendations.append("实现独立部署和发布")
        
        return recommendations
```

## 总结

微服务RAG架构通过将RAG系统拆分为多个独立的微服务，提供了更好的可扩展性、可维护性和技术多样性。本文介绍了微服务RAG架构的设计原则、服务拆分策略、通信机制和部署方案，包括按业务功能拆分、按数据域拆分、同步和异步通信、容器化部署和监控运维等方面。

关键要点：
1. **服务拆分**：合理拆分服务，确保单一职责和自治性
2. **通信机制**：选择合适的服务间通信方式
3. **部署运维**：使用容器化和Kubernetes进行部署
4. **监控告警**：建立完善的监控和告警体系

在下一篇文章中，我们将探讨性能优化策略，了解如何提升RAG系统的性能。

---

**下一步学习建议：**
- 阅读《性能优化策略》，了解RAG系统的性能优化方法
- 实践微服务架构设计，体验其优势
- 关注微服务RAG架构的最新发展和创新方案
