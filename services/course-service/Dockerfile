FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
# Copy only pom files first to leverage Docker layer cache for dependencies
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY libs/common/pom.xml libs/common/pom.xml
COPY libs/common-security/pom.xml libs/common-security/pom.xml
COPY services/auth-service/pom.xml services/auth-service/pom.xml
COPY services/user-service/pom.xml services/user-service/pom.xml
COPY services/resource-booking-service/pom.xml services/resource-booking-service/pom.xml
COPY services/marketplace-service/pom.xml services/marketplace-service/pom.xml
COPY services/exam-service/pom.xml services/exam-service/pom.xml
COPY services/notification-service/pom.xml services/notification-service/pom.xml
COPY services/dashboard-service/pom.xml services/dashboard-service/pom.xml
COPY services/course-service/pom.xml services/course-service/pom.xml

RUN for i in 1 2 3; do \
    mvn -B -pl services/course-service -am dependency:go-offline \
      -Dmaven.wagon.http.retryHandler.count=3 \
      -Dmaven.wagon.http.connectionTimeout=60000 \
      -Dmaven.wagon.http.socketTimeout=60000 \
      -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 && break || sleep 10; \
  done
COPY . .
RUN for i in 1 2 3; do \
    mvn -B -pl services/course-service -am package -DskipTests \
      -Dmaven.wagon.http.retryHandler.count=3 \
      -Dmaven.wagon.http.connectionTimeout=60000 \
      -Dmaven.wagon.http.socketTimeout=60000 \
      -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 && break || sleep 10; \
  done

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/services/course-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]

