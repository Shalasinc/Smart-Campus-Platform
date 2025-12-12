package com.smartcampus.resourcebooking.service;

import com.smartcampus.resourcebooking.entity.Booking;
import com.smartcampus.resourcebooking.entity.BookingStatus;
import com.smartcampus.resourcebooking.entity.Resource;
import com.smartcampus.resourcebooking.repository.BookingRepository;
import com.smartcampus.resourcebooking.repository.ResourceRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;

    public BookingService(ResourceRepository resourceRepository, BookingRepository bookingRepository) {
        this.resourceRepository = resourceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Booking createBooking(Long resourceId, Long userId, LocalDateTime start, LocalDateTime end) {
        Resource resource = resourceRepository.findByIdForUpdate(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (resource.getCapacity() == null) {
            throw new RuntimeException("Resource has no capacity");
        }

        long conflicts = bookingRepository.countConflicts(resourceId, start, end);
        if (conflicts >= resource.getCapacity()) {
            throw new RuntimeException("No capacity available");
        }

        Booking booking = new Booking();
        booking.setResource(resource);
        booking.setUserId(userId);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }
}

