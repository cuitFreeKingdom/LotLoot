#FROM maven:3.9.6-amazoncorretto-8 AS build
#LABEL authors="AloneAtWar"
#
#COPY src /usr/src/app/src
#COPY pom.xml /usr/src/app
## 切换到app目录，并使用Maven打包应用为jar
#RUN mvn -f /usr/src/app/pom.xml clean package -DskipTests
#
## 使用另一个镜像来运行我们的应用
FROM openjdk:8

# 从build镜像中拷贝编译的jar包到新的镜像中
COPY *.jar /app.jar

# 声明暴露的端口 假设你的Spring Boot应用运行在8080端口
EXPOSE 5000

# 指定容器启动的命令
ENTRYPOINT ["java", "-jar", "/app.jar"]