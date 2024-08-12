FROM amazoncorretto:21.0.4-alpine3.20 as builder
WORKDIR /app
ADD . .
RUN chmod +x ./gradlew
RUN ["./gradlew","bootJar"]

FROM gcr.io/distroless/java21-debian12:latest
WORKDIR /app
COPY --from=builder /app/build/libs/Credit-Transfer-0.0.1-SNAPSHOT.jar Credit-Transfer-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "Credit-Transfer-0.0.1-SNAPSHOT.jar"]
