package com.smartcampus.resourcebooking.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull
    private Long resourceId;

    @NotNull
    private Long userId;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;
}

