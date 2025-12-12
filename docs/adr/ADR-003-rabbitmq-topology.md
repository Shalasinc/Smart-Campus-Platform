# ADR-003: RabbitMQ Topology

- **Status**: Accepted
- **Context**: We need async events for Saga choreography and notifications with flexible routing per tenant/event type.
- **Decision**: Use topic exchanges with durable queues. Names:
  - Exchanges: `exam.events`, `order.events`, `booking.events`, `notification.events`.
  - Queues: `exam.started.queue`, `order.saga.queue`, `inventory.reservation.queue`, `notification.dispatch.queue`.
  - Routing keys: `exam.started`, `order.created`, `inventory.reserved`, `inventory.released`, `payment.succeeded`, `payment.failed`, `order.confirmed`, `order.cancelled`.
- **Consequences**:
  - ✅ Topic routing keeps event contracts evolvable.
  - ✅ Durable queues survive broker restarts; DLQ can be attached later.
  - ⚠️ Must define idempotent consumers to handle redelivery.
  - ⚠️ Need tenant-aware headers; we add `x-tenant-id` header on publish.

