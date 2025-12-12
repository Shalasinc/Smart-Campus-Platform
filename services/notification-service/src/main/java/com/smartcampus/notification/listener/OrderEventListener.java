package com.smartcampus.notification.listener;

import com.smartcampus.marketplace.messaging.OrderEvents;
import com.smartcampus.notification.config.RabbitConfig;
import com.smartcampus.notification.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {

    private final NotificationService notificationService;

    public OrderEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = RabbitConfig.ORDER_CREATED_QUEUE)
    public void onOrderCreated(OrderEvents.OrderCreatedEvent event) {
        notificationService.saveMessage("Order created: " + event.getOrderId());
    }

    @RabbitListener(queues = RabbitConfig.ORDER_CANCELLED_QUEUE)
    public void onOrderCancelled(OrderEvents.OrderCancelledEvent event) {
        notificationService.saveMessage("Order cancelled: " + event.getOrderId());
    }
}

