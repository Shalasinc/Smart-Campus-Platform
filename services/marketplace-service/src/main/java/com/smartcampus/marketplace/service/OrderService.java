package com.smartcampus.marketplace.service;

import com.smartcampus.marketplace.dto.CreateOrderRequest;
import com.smartcampus.marketplace.dto.OrderResponse;
import com.smartcampus.marketplace.model.Order;
import com.smartcampus.marketplace.model.OrderStatus;
import com.smartcampus.marketplace.model.Product;
import com.smartcampus.marketplace.repository.OrderRepository;
import com.smartcampus.marketplace.repository.ProductRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import java.util.Map;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final RabbitTemplate rabbitTemplate;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        RabbitTemplate rabbitTemplate) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    @CircuitBreaker(name = "inventoryBreaker", fallbackMethod = "fallbackCreateOrder")
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Reserve inventory (simple in-DB decrement)
        Map<Long, Integer> items = request.getItems();
        for (Map.Entry<Long, Integer> entry : items.entrySet()) {
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (product.getAvailableQuantity() < entry.getValue()) {
                throw new RuntimeException("Insufficient stock for product " + product.getId());
            }
            product.setAvailableQuantity(product.getAvailableQuantity() - entry.getValue());
            productRepository.save(product);
        }

        Order order = Order.builder()
                .userId(request.getUserId())
                .items(items)
                .status(OrderStatus.RESERVED)
                .build();
        Order saved = orderRepository.save(order);

        // Publish saga start event
        rabbitTemplate.convertAndSend("order.events", "order.created",
                new com.smartcampus.marketplace.messaging.OrderEvents.OrderCreatedEvent(saved.getId(), saved.getUserId()));

        return toResponse(saved);
    }

    public OrderResponse fallbackCreateOrder(CreateOrderRequest request, Throwable ex) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .items(request.getItems())
                .status(OrderStatus.CANCELLED)
                .build();
        Order saved = orderRepository.save(order);
        rabbitTemplate.convertAndSend("order.events", "order.cancelled",
                new com.smartcampus.marketplace.messaging.OrderEvents.OrderCancelledEvent(saved.getId()));
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.CONFIRMED);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getStatus() == OrderStatus.CANCELLED) {
            return toResponse(order);
        }
        // compensate inventory
        if (order.getItems() != null) {
            for (Map.Entry<Long, Integer> entry : order.getItems().entrySet()) {
                productRepository.findById(entry.getKey()).ifPresent(p -> {
                    p.setAvailableQuantity(p.getAvailableQuantity() + entry.getValue());
                    productRepository.save(p);
                });
            }
        }
        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        rabbitTemplate.convertAndSend("order.events", "order.cancelled",
                new com.smartcampus.marketplace.messaging.OrderEvents.OrderCancelledEvent(saved.getId()));
        return toResponse(saved);
    }

    public OrderResponse getOrder(Long id) {
        return orderRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .items(order.getItems())
                .status(order.getStatus())
                .build();
    }
}

