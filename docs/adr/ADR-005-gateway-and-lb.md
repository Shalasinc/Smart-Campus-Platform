# ADR-005: API Gateway & Load Balancer

- **Status**: Accepted
- **Context**: Need single entrypoint with JWT validation/RBAC and ability to horizontally scale services.
- **Decision**: Use Spring Cloud Gateway for routing + filters; place NGINX in front as HTTP load balancer to distribute traffic to multiple gateway or course-service instances. Gateway propagates tenant/role headers and performs coarse RBAC; services still authorize by role/tenant.
- **Consequences**:
  - ✅ Simple developer experience; config-as-code in `application.yml` and `nginx.conf`.
  - ✅ Can scale selected services via Compose replicas and upstream blocks.
  - ⚠️ Must keep JWT secret consistent across gateway replicas.
  - ⚠️ Sticky sessions not required (stateless), but WebSocket paths need review later.

