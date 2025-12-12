package com.smartcampus.marketplace.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private Integer availableQuantity;
    private Integer price;
}

