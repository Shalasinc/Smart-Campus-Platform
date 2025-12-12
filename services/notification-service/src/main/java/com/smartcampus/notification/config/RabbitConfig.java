package com.smartcampus.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "order.events";
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String ORDER_CANCELLED_QUEUE = "order.cancelled.queue";

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return new Queue(ORDER_CREATED_QUEUE, true);
    }

    @Bean
    public Queue orderCancelledQueue() {
        return new Queue(ORDER_CANCELLED_QUEUE, true);
    }

    @Bean
    public Binding bindCreated() {
        return BindingBuilder.bind(orderCreatedQueue()).to(orderExchange()).with("order.created");
    }

    @Bean
    public Binding bindCancelled() {
        return BindingBuilder.bind(orderCancelledQueue()).to(orderExchange()).with("order.cancelled");
    }
}

