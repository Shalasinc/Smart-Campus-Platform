package com.smartcampus.resourcebooking.dto;

import com.smartcampus.resourcebooking.entity.BookingStatus;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BookingResponse {

    private Long id;
    private Long resourceId;
    private Long userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
}

