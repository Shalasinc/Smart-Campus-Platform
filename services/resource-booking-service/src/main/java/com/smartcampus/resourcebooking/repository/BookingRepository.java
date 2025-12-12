package com.smartcampus.resourcebooking.repository;

import com.smartcampus.resourcebooking.entity.Booking;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query(
            "SELECT COUNT(b) FROM Booking b "
                    + "WHERE b.resource.id = :resourceId "
                    + "AND b.status = 'CONFIRMED' "
                    + "AND (b.startTime < :end AND b.endTime > :start)"
    )
    long countConflicts(
            @Param("resourceId") Long resourceId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    List<Booking> findByResource_Id(Long resourceId);
}

