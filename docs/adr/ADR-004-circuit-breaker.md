# ADR-004: Circuit Breaker with Resilience4j

- **Status**: Accepted
- **Context**: Synchronous calls (e.g., Exam → Notification, Gateway → services) must avoid cascading failures when a downstream is slow or down.
- **Decision**: Use Resilience4j annotations and Spring Boot auto-config. `examBreaker` guards Exam → Notification HTTP client; Gateway HTTP clients use `resilience4j-spring-boot3` with configs in `application.yml`.
- **Consequences**:
  - ✅ Lightweight, no sidecar; metrics exported to Actuator/Prometheus.
  - ✅ Supports retry/backoff and timeouts.
  - ⚠️ Must design idempotent operations for retries.
  - ⚠️ Circuit state needs monitoring; include dashboard panels.

