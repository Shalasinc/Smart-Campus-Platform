package com.smartcampus.marketplace.controller;

import com.smartcampus.marketplace.dto.CreateOrderRequest;
import com.smartcampus.marketplace.dto.OrderResponse;
import com.smartcampus.marketplace.dto.ProductResponse;
import com.smartcampus.marketplace.model.Product;
import com.smartcampus.marketplace.repository.ProductRepository;
import com.smartcampus.marketplace.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/marketplace")
@org.springframework.web.bind.annotation.CrossOrigin(origins = {"http://localhost:3000","http://localhost:3002","http://localhost:3003","http://localhost:8080"})
public class MarketplaceController {

    private final ProductRepository productRepository;
    private final OrderService orderService;

    public MarketplaceController(ProductRepository productRepository, OrderService orderService) {
        this.productRepository = productRepository;
        this.orderService = orderService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> products() {
        List<ProductResponse> products = productRepository.findAll().stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @PostMapping("/orders/{id}/confirm")
    public ResponseEntity<OrderResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.confirmOrder(id));
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    private ProductResponse toProductResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .availableQuantity(p.getAvailableQuantity())
                .build();
    }
}

