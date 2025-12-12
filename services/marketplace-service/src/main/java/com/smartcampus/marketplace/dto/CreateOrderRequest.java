package com.smartcampus.marketplace.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    @NotNull
    private Long userId;

    @NotEmpty
    private Map<@NotNull Long, @Min(1) Integer> items;
}

