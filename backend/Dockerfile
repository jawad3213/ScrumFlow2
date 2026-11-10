# Stage 1: build the jar with Maven (dependencies are cached in their own layer)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package -DskipTests

# Stage 2: slim runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/storage && chown app:app /app/storage

COPY --from=build /app/target/scrumflow-backend.jar app.jar

USER app
# PORT and STORAGE_PATH come from the env file like every other setting (backend.env / backend/.env)
EXPOSE 8000
# Uploaded avatars; mount a volume here to keep them across deployments.
VOLUME /app/storage

HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
    CMD wget -qO- http://localhost:8000/up >/dev/null || exit 1

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
