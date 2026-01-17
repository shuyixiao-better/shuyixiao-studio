---
layout: doc
title: MyBatis Log Panda：重构开发者的认知地图
description: MyBatis日志格式化工具，让SQL调试变得简单高效
date: '2025-11-25'
tags: ['IDEA插件', 'MyBatis', 'SQL', '开发工具']
author: 舒一笑不秃头
---

# 信息的建筑学：MyBatis Log Panda 如何重构开发者的认知地图

> "理解先于一切。" —— 理查德·沃曼  
> "最好的产品不是被购买的，而是被渴望的。" —— 哈里·马克思

---

## 序章：迷失在信息的迷宫

曾经作为建筑师，我深知空间的混乱会让人迷失方向。作为信息架构师，我更清楚：**信息的混乱比物理空间的混乱更致命**。

每天，成千上万的开发者坐在屏幕前，盯着滚动的日志流——那些密密麻麻的字符、参数、时间戳，像是一座没有地图的迷宫。他们在寻找什么？一条 SQL 语句。一个参数值。一个性能瓶颈的线索。

这不是技术问题，这是**认知问题**。

当信息以错误的方式呈现时，即使是最聪明的大脑也会陷入困境。问题不在于信息太少，而在于**信息太多，却没有结构**。

```tex
/Users/shuyixiao/Library/Java/JavaVirtualMachines/ms-21.0.7/Contents/Home/bin/java -agentlib:jdwp=transport=dt_socket,address=127.0.0.1:58395,suspend=y,server=n -javaagent:/Users/shuyixiao/Library/Caches/JetBrains/IntelliJIdea2025.2/captureAgent/debugger-agent.jar=file:///var/folders/zk/1y1r15rj3fjgr7w3wnnbknpm0000gn/T/capture17185188259718642681.props -agentpath:/private/var/folders/zk/1y1r15rj3fjgr7w3wnnbknpm0000gn/T/idea_libasyncProfiler_dylib_temp_folder/libasyncProfiler.dylib=version,jfr,event=wall,interval=10ms,cstack=no,file=/Users/shuyixiao/IdeaSnapshots/VaultApplication_2025_11_25_170925.jfr,log=/private/var/folders/zk/1y1r15rj3fjgr7w3wnnbknpm0000gn/T/VaultApplication_2025_11_25_170925.jfr.log.txt,logLevel=DEBUG -XX:TieredStopAtLevel=1 -Dspring.output.ansi.enabled=always -Dcom.sun.management.jmxremote -Dspring.jmx.enabled=true -Dspring.liveBeansView.mbeanDomain -Dspring.application.admin.enabled=true -Dmanagement.endpoints.jmx.exposure.include=* -Dkotlinx.coroutines.debug.enable.creation.stack.trace=false -Ddebugger.agent.enable.coroutines=true -Dkotlinx.coroutines.debug.enable.flows.stack.trace=true -Dkotlinx.coroutines.debug.enable.mutable.state.flows.stack.trace=true -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /Users/shuyixiao/IdeaProjects/PandaCoder-Vault/backend/target/classes:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-web/3.5.7/spring-boot-starter-web-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter/3.5.7/spring-boot-starter-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-logging/3.5.7/spring-boot-starter-logging-3.5.7.jar:/Users/shuyixiao/.m2/repository/ch/qos/logback/logback-classic/1.5.20/logback-classic-1.5.20.jar:/Users/shuyixiao/.m2/repository/ch/qos/logback/logback-core/1.5.20/logback-core-1.5.20.jar:/Users/shuyixiao/.m2/repository/org/apache/logging/log4j/log4j-to-slf4j/2.24.3/log4j-to-slf4j-2.24.3.jar:/Users/shuyixiao/.m2/repository/org/apache/logging/log4j/log4j-api/2.24.3/log4j-api-2.24.3.jar:/Users/shuyixiao/.m2/repository/org/slf4j/jul-to-slf4j/2.0.17/jul-to-slf4j-2.0.17.jar:/Users/shuyixiao/.m2/repository/jakarta/annotation/jakarta.annotation-api/2.1.1/jakarta.annotation-api-2.1.1.jar:/Users/shuyixiao/.m2/repository/org/yaml/snakeyaml/2.4/snakeyaml-2.4.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-json/3.5.7/spring-boot-starter-json-3.5.7.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jdk8/2.19.2/jackson-datatype-jdk8-2.19.2.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jsr310/2.19.2/jackson-datatype-jsr310-2.19.2.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/module/jackson-module-parameter-names/2.19.2/jackson-module-parameter-names-2.19.2.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-tomcat/3.5.7/spring-boot-starter-tomcat-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/apache/tomcat/embed/tomcat-embed-core/10.1.48/tomcat-embed-core-10.1.48.jar:/Users/shuyixiao/.m2/repository/org/apache/tomcat/embed/tomcat-embed-websocket/10.1.48/tomcat-embed-websocket-10.1.48.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-web/6.2.12/spring-web-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-beans/6.2.12/spring-beans-6.2.12.jar:/Users/shuyixiao/.m2/repository/io/micrometer/micrometer-observation/1.15.5/micrometer-observation-1.15.5.jar:/Users/shuyixiao/.m2/repository/io/micrometer/micrometer-commons/1.15.5/micrometer-commons-1.15.5.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-webmvc/6.2.12/spring-webmvc-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-context/6.2.12/spring-context-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-expression/6.2.12/spring-expression-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-security/3.5.7/spring-boot-starter-security-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-aop/6.2.12/spring-aop-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/security/spring-security-config/6.5.6/spring-security-config-6.5.6.jar:/Users/shuyixiao/.m2/repository/org/springframework/security/spring-security-web/6.5.6/spring-security-web-6.5.6.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-validation/3.5.7/spring-boot-starter-validation-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/apache/tomcat/embed/tomcat-embed-el/10.1.48/tomcat-embed-el-10.1.48.jar:/Users/shuyixiao/.m2/repository/org/hibernate/validator/hibernate-validator/8.0.3.Final/hibernate-validator-8.0.3.Final.jar:/Users/shuyixiao/.m2/repository/jakarta/validation/jakarta.validation-api/3.0.2/jakarta.validation-api-3.0.2.jar:/Users/shuyixiao/.m2/repository/org/jboss/logging/jboss-logging/3.6.1.Final/jboss-logging-3.6.1.Final.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/classmate/1.7.1/classmate-1.7.1.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-data-mongodb/3.5.7/spring-boot-starter-data-mongodb-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/mongodb/mongodb-driver-sync/5.5.2/mongodb-driver-sync-5.5.2.jar:/Users/shuyixiao/.m2/repository/org/mongodb/bson/5.5.2/bson-5.5.2.jar:/Users/shuyixiao/.m2/repository/org/mongodb/mongodb-driver-core/5.5.2/mongodb-driver-core-5.5.2.jar:/Users/shuyixiao/.m2/repository/org/mongodb/bson-record-codec/5.5.2/bson-record-codec-5.5.2.jar:/Users/shuyixiao/.m2/repository/org/springframework/data/spring-data-mongodb/4.5.5/spring-data-mongodb-4.5.5.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-tx/6.2.12/spring-tx-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/data/spring-data-commons/3.5.5/spring-data-commons-3.5.5.jar:/Users/shuyixiao/.m2/repository/com/mysql/mysql-connector-j/9.4.0/mysql-connector-j-9.4.0.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-spring-boot3-starter/3.5.14/mybatis-plus-spring-boot3-starter-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus/3.5.14/mybatis-plus-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-core/3.5.14/mybatis-plus-core-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-annotation/3.5.14/mybatis-plus-annotation-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-spring/3.5.14/mybatis-plus-spring-3.5.14.jar:/Users/shuyixiao/.m2/repository/org/mybatis/mybatis/3.5.19/mybatis-3.5.19.jar:/Users/shuyixiao/.m2/repository/org/mybatis/mybatis-spring/3.0.5/mybatis-spring-3.0.5.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-spring-boot-autoconfigure/3.5.14/mybatis-plus-spring-boot-autoconfigure-3.5.14.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-autoconfigure/3.5.7/spring-boot-autoconfigure-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-jdbc/3.5.7/spring-boot-starter-jdbc-3.5.7.jar:/Users/shuyixiao/.m2/repository/com/zaxxer/HikariCP/6.3.3/HikariCP-6.3.3.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-jdbc/6.2.12/spring-jdbc-6.2.12.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-jsqlparser/3.5.14/mybatis-plus-jsqlparser-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/github/jsqlparser/jsqlparser/5.2/jsqlparser-5.2.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-jsqlparser-common/3.5.14/mybatis-plus-jsqlparser-common-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/baomidou/mybatis-plus-extension/3.5.14/mybatis-plus-extension-3.5.14.jar:/Users/shuyixiao/.m2/repository/com/alibaba/druid-spring-boot-starter/1.2.20/druid-spring-boot-starter-1.2.20.jar:/Users/shuyixiao/.m2/repository/com/alibaba/druid/1.2.20/druid-1.2.20.jar:/Users/shuyixiao/.m2/repository/org/slf4j/slf4j-api/2.0.17/slf4j-api-2.0.17.jar:/Users/shuyixiao/.m2/repository/org/glassfish/jaxb/jaxb-runtime/4.0.6/jaxb-runtime-4.0.6.jar:/Users/shuyixiao/.m2/repository/org/glassfish/jaxb/jaxb-core/4.0.6/jaxb-core-4.0.6.jar:/Users/shuyixiao/.m2/repository/org/eclipse/angus/angus-activation/2.0.3/angus-activation-2.0.3.jar:/Users/shuyixiao/.m2/repository/org/glassfish/jaxb/txw2/4.0.6/txw2-4.0.6.jar:/Users/shuyixiao/.m2/repository/com/sun/istack/istack-commons-runtime/4.1.2/istack-commons-runtime-4.1.2.jar:/Users/shuyixiao/.m2/repository/io/jsonwebtoken/jjwt-api/0.12.3/jjwt-api-0.12.3.jar:/Users/shuyixiao/.m2/repository/io/jsonwebtoken/jjwt-impl/0.12.3/jjwt-impl-0.12.3.jar:/Users/shuyixiao/.m2/repository/io/jsonwebtoken/jjwt-jackson/0.12.3/jjwt-jackson-0.12.3.jar:/Users/shuyixiao/.m2/repository/org/projectlombok/lombok/1.18.30/lombok-1.18.30.jar:/Users/shuyixiao/.m2/repository/me/paulschwarz/spring-dotenv/4.0.0/spring-dotenv-4.0.0.jar:/Users/shuyixiao/.m2/repository/io/github/cdimascio/dotenv-java/3.0.0/dotenv-java-3.0.0.jar:/Users/shuyixiao/.m2/repository/com/alipay/sdk/alipay-sdk-java/4.35.79.ALL/alipay-sdk-java-4.35.79.ALL.jar:/Users/shuyixiao/.m2/repository/commons-logging/commons-logging/1.1.1/commons-logging-1.1.1.jar:/Users/shuyixiao/.m2/repository/com/alibaba/fastjson/1.2.83_noneautotype/fastjson-1.2.83_noneautotype.jar:/Users/shuyixiao/.m2/repository/org/bouncycastle/bcprov-jdk15on/1.62/bcprov-jdk15on-1.62.jar:/Users/shuyixiao/.m2/repository/dom4j/dom4j/1.6.1/dom4j-1.6.1.jar:/Users/shuyixiao/.m2/repository/xml-apis/xml-apis/1.0.b2/xml-apis-1.0.b2.jar:/Users/shuyixiao/.m2/repository/com/squareup/okhttp3/okhttp/3.12.13/okhttp-3.12.13.jar:/Users/shuyixiao/.m2/repository/com/squareup/okio/okio/1.15.0/okio-1.15.0.jar:/Users/shuyixiao/.m2/repository/com/github/wechatpay-apiv3/wechatpay-java/0.2.17/wechatpay-java-0.2.17.jar:/Users/shuyixiao/.m2/repository/com/github/wechatpay-apiv3/wechatpay-java-core/0.2.17/wechatpay-java-core-0.2.17.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/httpmime/4.5.13/httpmime-4.5.13.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/httpclient/4.5.13/httpclient-4.5.13.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/httpcore/4.4.16/httpcore-4.4.16.jar:/Users/shuyixiao/.m2/repository/commons-codec/commons-codec/1.18.0/commons-codec-1.18.0.jar:/Users/shuyixiao/.m2/repository/com/google/code/gson/gson/2.13.2/gson-2.13.2.jar:/Users/shuyixiao/.m2/repository/com/google/errorprone/error_prone_annotations/2.41.0/error_prone_annotations-2.41.0.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.19.2/jackson-databind-2.19.2.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.19.2/jackson-annotations-2.19.2.jar:/Users/shuyixiao/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.19.2/jackson-core-2.19.2.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/client5/httpclient5/5.5.1/httpclient5-5.5.1.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/core5/httpcore5/5.3.6/httpcore5-5.3.6.jar:/Users/shuyixiao/.m2/repository/org/apache/httpcomponents/core5/httpcore5-h2/5.3.6/httpcore5-h2-5.3.6.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-starter-aop/3.5.7/spring-boot-starter-aop-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/aspectj/aspectjweaver/1.9.24/aspectjweaver-1.9.24.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot-devtools/3.5.7/spring-boot-devtools-3.5.7.jar:/Users/shuyixiao/.m2/repository/org/springframework/boot/spring-boot/3.5.7/spring-boot-3.5.7.jar:/Users/shuyixiao/.m2/repository/jakarta/xml/bind/jakarta.xml.bind-api/4.0.4/jakarta.xml.bind-api-4.0.4.jar:/Users/shuyixiao/.m2/repository/jakarta/activation/jakarta.activation-api/2.1.4/jakarta.activation-api-2.1.4.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-core/6.2.12/spring-core-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/spring-jcl/6.2.12/spring-jcl-6.2.12.jar:/Users/shuyixiao/.m2/repository/org/springframework/security/spring-security-core/6.5.6/spring-security-core-6.5.6.jar:/Users/shuyixiao/.m2/repository/org/springframework/security/spring-security-crypto/6.5.6/spring-security-crypto-6.5.6.jar:/Applications/IntelliJ IDEA.app/Contents/lib/idea_rt.jar com.pandacoder.vault.VaultApplication
已连接到地址为 ''127.0.0.1:58395'，传输: '套接字'' 的目标虚拟机
Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts
Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.5.7)

2025-11-25 17:09:31.187 [restartedMain] INFO  c.pandacoder.vault.VaultApplication - Starting VaultApplication using Java 21.0.7 with PID 79283 (/Users/shuyixiao/IdeaProjects/PandaCoder-Vault/backend/target/classes started by shuyixiao in /Users/shuyixiao/IdeaProjects/PandaCoder-Vault)
2025-11-25 17:09:31.187 [restartedMain] DEBUG c.pandacoder.vault.VaultApplication - Running with Spring Boot v3.5.7, Spring v6.2.12
2025-11-25 17:09:31.188 [restartedMain] INFO  c.pandacoder.vault.VaultApplication - The following 1 profile is active: "dev"
2025-11-25 17:09:31.208 [restartedMain] INFO  o.s.b.d.e.DevToolsPropertyDefaultsPostProcessor - Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
2025-11-25 17:09:31.208 [restartedMain] INFO  o.s.b.d.e.DevToolsPropertyDefaultsPostProcessor - For additional web related logging consider setting the 'logging.level.web' property to 'DEBUG'
2025-11-25 17:09:31.474 [restartedMain] DEBUG c.b.m.a.MybatisPlusAutoConfiguration - Searching for mappers annotated with @Mapper
2025-11-25 17:09:31.475 [restartedMain] DEBUG c.b.m.a.MybatisPlusAutoConfiguration - Using auto-configuration base package 'com.pandacoder.vault'
2025-11-25 17:09:31.498 [restartedMain] INFO  o.s.d.r.c.RepositoryConfigurationDelegate - Bootstrapping Spring Data MongoDB repositories in DEFAULT mode.
2025-11-25 17:09:31.518 [restartedMain] INFO  o.s.d.r.c.RepositoryConfigurationDelegate - Finished Spring Data repository scanning in 18 ms. Found 3 MongoDB repository interfaces.
2025-11-25 17:09:31.876 [restartedMain] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port 8080 (http)
2025-11-25 17:09:31.883 [restartedMain] INFO  o.a.catalina.core.StandardService - Starting service [Tomcat]
2025-11-25 17:09:31.883 [restartedMain] INFO  o.a.catalina.core.StandardEngine - Starting Servlet engine: [Apache Tomcat/10.1.48]
2025-11-25 17:09:31.900 [restartedMain] INFO  o.a.c.c.C.[.[localhost].[/api] - Initializing Spring embedded WebApplicationContext
2025-11-25 17:09:31.900 [restartedMain] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext - Root WebApplicationContext: initialization completed in 692 ms
Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts
2025-11-25 17:09:31.976 [restartedMain] DEBUG c.b.m.core.spi.CompatibleHelper - Load compatibleSet: com.baomidou.mybatisplus.extension.spi.SpringCompatibleSet@718c2e88
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
2025-11-25 17:09:31.999 [restartedMain] DEBUG c.b.m.e.s.MybatisSqlSessionFactoryBean - Registered plugin: 'MybatisPlusInterceptor{interceptors=[PaginationInnerInterceptor(logger=org.apache.ibatis.logging.slf4j.Slf4jImpl@569646e1, overflow=false, maxLimit=null, dbType=MYSQL, dialect=null, optimizeJoin=true)]}'
2025-11-25 17:09:32.000 [restartedMain] DEBUG c.b.m.e.s.MybatisSqlSessionFactoryBean - Property 'mapperLocations' was not specified.
Get /192.168.235.134 network interface 
Get network interface info: name:en0 (en0)
Initialization Sequence datacenterId:30 workerId:14
 _ _   |_  _ _|_. ___ _ |    _ 
| | |\/|_)(_| | |_\  |_)||_|_\ 
     /               |         
                        3.5.14 
2025-11-25 17:09:32.088 [restartedMain] DEBUG c.p.v.s.JwtAuthenticationFilter - Filter 'jwtAuthenticationFilter' configured for use
2025-11-25 17:09:32.142 [restartedMain] INFO  o.s.s.c.a.a.c.InitializeAuthenticationProviderBeanManagerConfigurer$InitializeAuthenticationProviderManagerConfigurer - Global AuthenticationManager configured with AuthenticationProvider bean with name authenticationProvider
2025-11-25 17:09:32.142 [restartedMain] WARN  o.s.s.c.a.a.c.InitializeUserDetailsBeanManagerConfigurer$InitializeUserDetailsManagerConfigurer - Global AuthenticationManager configured with an AuthenticationProvider bean. UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login. Consider removing the AuthenticationProvider bean. Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider. If the current configuration is intentional, to turn off this warning, increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
2025-11-25 17:09:32.258 [restartedMain] INFO  org.mongodb.driver.client - MongoClient with metadata {"driver": {"name": "mongo-java-driver|sync|spring-boot", "version": "5.5.2"}, "os": {"type": "Darwin", "name": "Mac OS X", "architecture": "aarch64", "version": "15.5"}, "platform": "Java/Microsoft/21.0.7+6-LTS"} created with settings MongoClientSettings{readPreference=primary, writeConcern=WriteConcern{w=null, wTimeout=null ms, journal=null}, retryWrites=true, retryReads=true, readConcern=ReadConcern{level=null}, credential=MongoCredential{mechanism=null, userName='admin', source='admin', password=<hidden>, mechanismProperties=<hidden>}, transportSettings=null, commandListeners=[], codecRegistry=ProvidersCodecRegistry{codecProviders=[ValueCodecProvider{}, BsonValueCodecProvider{}, DBRefCodecProvider{}, DBObjectCodecProvider{}, DocumentCodecProvider{}, CollectionCodecProvider{}, IterableCodecProvider{}, MapCodecProvider{}, GeoJsonCodecProvider{}, GridFSFileCodecProvider{}, Jsr310CodecProvider{}, JsonObjectCodecProvider{}, BsonCodecProvider{}, EnumCodecProvider{}, com.mongodb.client.model.mql.ExpressionCodecProvider@4d9ce6c9, com.mongodb.Jep395RecordCodecProvider@33d025c8, com.mongodb.KotlinCodecProvider@7f330f61]}, loggerSettings=LoggerSettings{maxDocumentLength=1000}, clusterSettings={hosts=[81.69.17.52:27017], srvServiceName=mongodb, mode=SINGLE, requiredClusterType=UNKNOWN, requiredReplicaSetName='null', serverSelector='null', clusterListeners='[]', serverSelectionTimeout='30000 ms', localThreshold='15 ms'}, socketSettings=SocketSettings{connectTimeoutMS=10000, readTimeoutMS=0, receiveBufferSize=0, proxySettings=ProxySettings{host=null, port=null, username=null, password=null}}, heartbeatSocketSettings=SocketSettings{connectTimeoutMS=10000, readTimeoutMS=10000, receiveBufferSize=0, proxySettings=ProxySettings{host=null, port=null, username=null, password=null}}, connectionPoolSettings=ConnectionPoolSettings{maxSize=100, minSize=0, maxWaitTimeMS=120000, maxConnectionLifeTimeMS=0, maxConnectionIdleTimeMS=0, maintenanceInitialDelayMS=0, maintenanceFrequencyMS=60000, connectionPoolListeners=[], maxConnecting=2}, serverSettings=ServerSettings{heartbeatFrequencyMS=10000, minHeartbeatFrequencyMS=500, serverMonitoringMode=AUTO, serverListeners='[]', serverMonitorListeners='[]'}, sslSettings=SslSettings{enabled=false, invalidHostNameAllowed=false, context=null}, applicationName='null', compressorList=[], uuidRepresentation=JAVA_LEGACY, serverApi=null, autoEncryptionSettings=null, dnsClient=null, inetAddressResolver=null, contextProvider=null, timeoutMS=null}
2025-11-25 17:09:32.330 [restartedMain] INFO  o.s.b.d.a.OptionalLiveReloadServer - LiveReload server is running on port 35729
2025-11-25 17:09:32.387 [cluster-ClusterId{value='6925724c7db84b2c5ce3da5d', description='null'}-81.69.17.52:27017] INFO  org.mongodb.driver.cluster - Monitor thread successfully connected to server with description ServerDescription{address=81.69.17.52:27017, type=STANDALONE, cryptd=false, state=CONNECTED, ok=true, minWireVersion=0, maxWireVersion=27, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=127059375, minRoundTripTimeNanos=0}
2025-11-25 17:09:32.529 [restartedMain] WARN  o.s.w.s.m.m.a.RequestMappingHandlerMapping - Multiple @RequestMapping annotations found on public void com.pandacoder.vault.controller.VipSubscriptionController.zpayNotify(jakarta.servlet.http.HttpServletRequest,jakarta.servlet.http.HttpServletResponse) throws java.io.IOException, but only the first will be used: [@org.springframework.web.bind.annotation.PostMapping(consumes={}, headers={}, name="", params={}, path={"/payment/zpay/notify"}, produces={}, value={"/payment/zpay/notify"}), @org.springframework.web.bind.annotation.GetMapping(consumes={}, headers={}, name="", params={}, path={"/payment/zpay/notify"}, produces={}, value={"/payment/zpay/notify"})]
2025-11-25 17:09:32.534 [restartedMain] DEBUG o.s.w.s.m.m.a.RequestMappingHandlerMapping - 53 mappings in 'requestMappingHandlerMapping'
2025-11-25 17:09:32.563 [restartedMain] DEBUG o.s.w.s.h.SimpleUrlHandlerMapping - Patterns [/webjars/**, /**] in 'resourceHandlerMapping'
2025-11-25 17:09:32.622 [restartedMain] DEBUG o.s.s.web.DefaultSecurityFilterChain - Will secure any request with filters: DisableEncodeUrlFilter, WebAsyncManagerIntegrationFilter, SecurityContextHolderFilter, HeaderWriterFilter, CorsFilter, LogoutFilter, JwtAuthenticationFilter, RequestCacheAwareFilter, SecurityContextHolderAwareRequestFilter, AnonymousAuthenticationFilter, SessionManagementFilter, ExceptionTranslationFilter, AuthorizationFilter
2025-11-25 17:09:32.669 [restartedMain] DEBUG o.s.w.s.m.m.a.RequestMappingHandlerAdapter - ControllerAdvice beans: 0 @ModelAttribute, 0 @InitBinder, 1 RequestBodyAdvice, 1 ResponseBodyAdvice
2025-11-25 17:09:32.693 [restartedMain] DEBUG o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - ControllerAdvice beans: 1 @ExceptionHandler, 1 ResponseBodyAdvice
2025-11-25 17:09:32.696 [restartedMain] DEBUG c.b.m.a.MybatisPlusAutoConfiguration - Not found configuration for registering mapper bean using @MapperScan, MapperFactoryBean and MapperScannerConfigurer.
2025-11-25 17:09:32.696 [restartedMain] INFO  c.b.m.e.s.MybatisPlusApplicationContextAware - Register ApplicationContext instances org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@78666536
2025-11-25 17:09:32.800 [restartedMain] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port 8080 (http) with context path '/api'
2025-11-25 17:09:32.804 [restartedMain] INFO  c.pandacoder.vault.VaultApplication - Started VaultApplication in 1.791 seconds (process running for 7.284)
Creating a new SqlSession
SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@7699eb3a] was not registered for synchronization because synchronization is not active
2025-11-25 17:09:32.860 [restartedMain] INFO  c.alibaba.druid.pool.DruidDataSource - {dataSource-1} inited
JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@1e296602] will not be managed by Spring
==>  Preparing: SELECT COUNT( * ) AS total FROM users WHERE deleted=0 AND (username = ?)
==> Parameters: admin(String)
<==    Columns: total
<==        Row: 1
<==      Total: 1
Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@7699eb3a]
2025-11-25 17:09:33.545 [restartedMain] INFO  c.p.vault.config.DataInitializer - 管理员账号已存在，跳过初始化
```



---

## 第一幕：信息焦虑的根源

### 开发者的三重困境

让我们诚实地面对现实：

**1. 信息过载（Information Overload）**  
一个中型应用每秒可能产生数百条日志。在这片信息的海洋中，你要找的那条 SQL 就像大海捞针。你不是缺少信息，你是**被信息淹没**。

**2. 上下文断裂（Context Fragmentation）**  
SQL 语句在这里，参数在那里，执行时间在另一个地方，触发的 API 在日志的更上方。你的大脑需要在不同的信息碎片之间跳跃，像是在拼一个永远拼不完的拼图。

**3. 认知负担（Cognitive Load）**  
你需要记住占位符的位置，手动匹配参数，计算执行时间，追踪调用链。这些本该由工具完成的工作，却消耗了你宝贵的认知资源。

> "信息焦虑源于理解与被理解之间的鸿沟。" —— 理查德·沃曼

---

## 第二幕：重新定义"看见"

### MyBatis Log Panda 的哲学

如果你问我 MyBatis Log Panda 是什么，我不会说它是一个"插件"。

**它是一座桥梁**——连接混乱与秩序的桥梁。  
**它是一张地图**——让你在信息的迷宫中找到方向的地图。  
**它是一种语言**——让机器的语言转化为人类可理解的语言。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251125171126426.png)

### 信息架构的五个原则

MyBatis Log Panda 的设计遵循了信息架构的核心原则：

#### 1. **组织（Organization）**
不再是杂乱无章的日志流，而是结构化的表格：操作类型、表名、API 路径、执行时间——每一项信息都有它的位置。

#### 2. **标签（Labeling）**
颜色编码的操作类型（SELECT、INSERT、UPDATE、DELETE），一眼就能识别。慢查询用醒目的颜色标记，让问题无处遁形。

#### 3. **导航（Navigation）**
智能过滤器让你可以按操作类型、表名、时间范围快速定位。不是在信息中游泳，而是在信息中**航行**。

#### 4. **搜索（Searching）**
关键词搜索，让你可以直接找到你要的那条 SQL，而不是滚动数百行日志。

#### 5. **理解（Understanding）**
最重要的是：参数自动替换。你看到的不是 `SELECT * FROM users WHERE id = ?`，而是 `SELECT * FROM users WHERE id = 1`——可以直接执行的、完整的、**可理解的** SQL。

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/image-20251125171223293.png)

---

## 第三幕：从工具到体验

### 哈里·马克思的视角：欲望的炼金术

从营销哲学家，可以知道一个真理：**人们不购买产品，他们购买更好的自己**。

MyBatis Log Panda 不是在卖一个插件，它在卖一种**解放**：

- **从混乱中解放**：不再需要在日志中翻找，不再需要手动拼接 SQL。
- **从焦虑中解放**：性能问题一目了然，慢查询无处藏身。
- **从孤立中解放**：SQL 与 API 自动关联，上下文完整呈现。

### 欲望的层次

**Level 1: 我需要调试 SQL**  
这是功能层面的需求。MyBatis Log Panda 满足了它。

**Level 2: 我需要更快地调试 SQL**  
这是效率层面的需求。一键复制、智能过滤、实时监控——MyBatis Log Panda 让你的速度提升 10 倍。

**Level 3: 我需要优雅地调试 SQL**  
这是体验层面的需求。干净的界面、直观的交互、流畅的操作——MyBatis Log Panda 让调试变成一种享受。

**Level 4: 我需要成为更好的开发者**  
这是身份层面的需求。当你不再被琐碎的日志困扰，你可以把精力放在真正重要的事情上：架构设计、性能优化、业务创新。

> "最好的营销不是说服，而是揭示。揭示人们内心深处已经存在的渴望。" —— 哈里·马克思

---

## 第四幕：细节中的魔鬼（与天使）

### 那些被精心设计的时刻

**时刻 1：启动项目**  
工具窗口自动打开，SQL 监听默认启用。你不需要配置任何东西，它就已经在工作了。这是**零摩擦**的设计。

**时刻 2：执行查询**  
SQL 实时出现在列表中，参数已经替换完毕。你不需要等待，不需要刷新，不需要手动操作。这是**即时反馈**的设计。

**时刻 3：发现慢查询**  
执行时间超过 3 秒的查询会被高亮显示。你不需要计算，不需要比较，问题会**主动找到你**。

**时刻 4：追踪问题**  
右键点击，选择"复制 API 路径"。你立刻知道是哪个接口触发了这条 SQL。这是**上下文完整性**的设计。

**时刻 5：历史回溯**  
所有查询自动保存，跨会话持久化。你可以回到昨天、上周、上个月，查看任何时候的 SQL 记录。这是**时间维度**的设计。

### 信息的美学

好的信息架构不仅仅是功能性的，它还应该是**美的**。

- 表格的对齐
- 颜色的选择
- 字体的大小
- 间距的比例

每一个像素都在传递一个信息：**开发者在乎你的体验**。

---

## 第五幕：超越工具的意义

### 重新定义"生产力"

我们通常把生产力定义为"单位时间内完成的工作量"。但这是工业时代的定义。

在信息时代，生产力应该被重新定义为：**单位认知负担下创造的价值**。

MyBatis Log Panda 的价值不在于它让你"更快"，而在于它让你**更轻松**。

- 你不再需要记住占位符的位置
- 你不再需要手动计算执行时间
- 你不再需要在日志中搜索 API 路径

这些被释放的认知资源，可以用来思考更重要的问题：

- 这个查询可以优化吗？
- 这个表结构合理吗？
- 这个接口的设计符合业务逻辑吗？

### 从"做"到"想"

工具的终极目的不是让你"做更多"，而是让你"想更深"。

当 MyBatis Log Panda 接管了信息整理的工作，你的大脑可以专注于信息的**理解**和**创造**。

这才是真正的生产力革命。

---

## 第六幕：致那些追求卓越的人

### 你是谁？

如果你是这样的开发者：

- 你不满足于"能用就行"，你追求"优雅"
- 你不愿意被工具限制，你希望工具为你服务
- 你不想在琐碎的事情上浪费时间，你想把精力放在创造上
- 你相信细节的力量，你知道好的工具可以改变工作方式

那么，MyBatis Log Panda 就是为你设计的。

### 一个承诺

这个插件的承诺：

- **零配置**：安装即用，不浪费你一秒钟
- **零干扰**：轻量级设计，不影响应用性能
- **零学习成本**：直观的界面，不需要阅读手册

作为开发者，我（舒一笑不秃头）的承诺：

- 持续改进
- 倾听反馈
- 追求卓越

因为我深知，**工具的品质反映了使用者的品位**。

---

## 尾声：信息的未来

### 沃曼的预言

理查德·沃曼曾说："21 世纪的文盲不是不会读写的人，而是不会学习、不会遗忘、不会重新学习的人。"

我想补充一句：**21 世纪的开发者不是不会编程的人，而是不会管理信息、不会利用工具、不会解放认知的人**。

MyBatis Log Panda 不是终点，它是起点。

它代表了一种理念：**技术应该服务于人，而不是人服务于技术**。

它代表了一种未来：**信息不再是负担，而是力量**。

---

## 行动召唤：开始你的旅程

### 15 天免费试用

插件提供 15 天免费试用，让你充分体验信息架构的力量。

不需要信用卡，不需要承诺，只需要你的好奇心。

### 三个问题

在这 15 天里，问自己三个问题：

1. **我节省了多少时间？**
2. **我减少了多少焦虑？**
3. **我创造了多少价值？**

如果答案让你满意，那么 MyBatis Log Panda 就是你的工具。

如果答案让你惊喜，那么 MyBatis Log Panda 就是你的伙伴。

---

## 最后的话

### 沃曼 × 马克思的对话

**沃曼**："信息的价值不在于数量，而在于结构。"

**马克思**："产品的价值不在于功能，而在于欲望。"

**沃曼**："MyBatis Log Panda 给了信息结构。"

**马克思**："MyBatis Log Panda 唤醒了欲望——对清晰、对效率、对卓越的欲望。"

**沃曼**："它是一座桥梁。"

**马克思**："它是一个承诺。"

**两人**："它是你应得的工具。"

---

## 立即开始

🔗 **官方网站**: [https://www.poeticcoder.com](https://www.poeticcoder.com)  
📧 **联系作者**: yixiaoshu88@163.com  
👨‍💻 **开发者**: 舒一笑不秃头  
🐼 **下载试用**: 在 JetBrains Marketplace 搜索 "MyBatis Log Panda"

---

**因为你的时间值得更好的工具。**  
**因为你的大脑值得更少的负担。**  
**因为你的工作值得更多的优雅。**

**MyBatis Log Panda —— 重构你的认知地图。**

---

*本文献给所有在信息迷宫中寻找出路的开发者。*  
*愿你们找到清晰，找到效率，找到那个更好的自己。*


## 配置使用

### 方式一： 指定mybatis日志级别

```yml
# application.yml
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# 等价于application.properties
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

### 方式二：配置mybatis-config.xml

```yml
<configuration>
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
</configuration>
```

### 方式三：指定整个mapper包下的日志级别

```yml
# application.yml
logging:
  level:
    com.example.demo.mapper: debug

# 等价于application.properties
logging.level.com.example.demo.mapper=debug

```

🐼
## 🤝 社区交流

### 💬 加入开发者交流群

欢迎加入 PandaCoder 工具宇宙开发者交流群，与作者和其他开发者一起交流技术、分享经验、反馈问题！我们提供多种交流渠道：

#### 📱 微信交流群 & 💬 QQ交流群

<p align="center">
  <table>
    <tr>
      <td align="center">
        <img src="/images/舒一笑不秃头微信.jpg" width="280" alt="舒一笑不秃头微信">
        <br>
        <sub>扫码添加微信好友，备注 <strong>PandaCoder工具宇宙交流</strong>，可以拉你进微信交流群</sub>
      </td>
      <td align="center">
        <img src="/images/PandaCoder交流QQ群.jpg" width="280" alt="PandaCoder工具宇宙开发者交流QQ群">
        <br>
        <sub>扫码加入QQ群，与作者和开发者直接交流</sub>
      </td>
    </tr>
  </table>
</p>

**交流群内可以：**
- 💡 获取最新的插件更新和技术动态
- 🐛 反馈使用问题和改进建议
- 🔧 交流开发经验和最佳实践
- 📚 获取技术文档和教程资源
- 🎯 参与功能讨论和产品规划

#### 📱 关注公众号

<p align="center">
  <img src="/images/WechatOfficialAccount.gif" width="280" alt="舒一笑的架构笔记">
  <br>
  <sub>扫码关注<strong>「舒一笑的架构笔记」</strong>，获取最新技术动态和深度架构解析</sub>
</p>

**公众号内可以：**
- 📖 获取独家技术文章和深度解析
- 🔥 提前了解PandaCoder工具宇宙最新功能和更新计划
- 💬 与作者一对一交流技术问题
- 📚 免费获取精品技术文档和学习资料
- 🎁 参与抽奖活动赢取精美礼品和技术书籍

### v2025.9.5 (敬请期待)

### v2025.9.4 (2026-01-17)
- ✅ 插件稳定性提升
- ✅ 添加中英文语言显示支持

### v2025.9.3 (2026-01-13)

- ✅ 插件稳定性提升
- ✅ 添加仅API请求SQL监控功能


### v2025.9.2 (2025-12-05)

- ✅ 增强SQL表名解析支持多种格式，包括带schema的表名（如 schema.table）
- ✅ 支持解析带引号的表名（如 `table`、"table"）
- ✅ 支持解析跨数据库的完整表名（如 database.schema.table）
- ✅ 增强正则表达式以匹配更多表名格式
- ✅ 自动移除表名中的引号符号（反引号、双引号、方括号）

### v2025.9.1 (2025-12-05)

- ✅ 优化SQL执行时间计算逻辑，SQL耗时不受断点影响
- ✅ 优化SQL日志解析逻辑并增强调试功能
- ✅ 增加插件相关信息介绍

### v2025.8.1 (2025-12-03)
- ✅ 体验优化

### v2025.7.1 (2025-12-02)

- ✅ 增强许可证剩余时间显示功能
- ✅ 实现SQL监控状态持久化配置，监控启用状态存储到项目级别设置中
- ✅ 优化启用SQL监控时为运行中的进程重新附加监听器


### v2025.6.1 (2025-11-28)
- ✅ 搜索框功能完善与体验优化
