package com.smartcampus.marketplace.messaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Shared event payloads published by the marketplace service and consumed by notification-service.
 * Keeping the same package and structure as the producer avoids serialization issues on the queue.
 */
public class OrderEvents {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderCreatedEvent {
        private Long orderId;
        private Long userId;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderCancelledEvent {
        private Long orderId;
    }
}


