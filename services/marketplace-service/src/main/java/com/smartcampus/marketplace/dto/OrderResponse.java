package com.smartcampus.marketplace.dto;

import com.smartcampus.marketplace.model.OrderStatus;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private Map<Long, Integer> items;
    private OrderStatus status;
}

