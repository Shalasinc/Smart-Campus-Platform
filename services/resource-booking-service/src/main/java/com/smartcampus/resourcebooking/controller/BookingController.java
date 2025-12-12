package com.smartcampus.resourcebooking.controller;

import com.smartcampus.resourcebooking.dto.BookingResponse;
import com.smartcampus.resourcebooking.dto.CreateBookingRequest;
import com.smartcampus.resourcebooking.entity.Booking;
import com.smartcampus.resourcebooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest req) {
        Booking booking = bookingService.createBooking(
                req.getResourceId(),
                req.getUserId(),
                req.getStartTime(),
                req.getEndTime()
        );

        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setResourceId(booking.getResource().getId());
        response.setUserId(booking.getUserId());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setStatus(booking.getStatus());

        return ResponseEntity.ok(response);
    }
}

