# ADR-001: Saga Pattern via RabbitMQ Choreography

- **Status**: Accepted
- **Context**: Marketplace purchase must coordinate inventory reservation, payment, and order confirmation with compensation on failure. Temporal/Orchestrator adds infra overhead for this prototype.
- **Decision**: Use choreography-based Saga over RabbitMQ topic exchanges. Marketplace Service publishes `order.created`; Inventory and Payment react and emit `inventory.reserved|released` and `payment.succeeded|failed`; Marketplace finalizes with `order.confirmed|cancelled`. Messages are idempotent and carry `saga_id`.
- **Consequences**:
  - ✅ Low coupling, simple to bootstrap with Spring AMQP.
  - ✅ Works in docker-compose with RabbitMQ alone.
  - ⚠️ Requires careful idempotency and DLQ for poison messages.
  - ⚠️ Harder to visualize flow; future upgrade path to Temporal/Kafka with the same event contracts.

