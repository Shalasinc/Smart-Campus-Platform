package com.smartcampus.course.repository;

import com.smartcampus.course.model.Course;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByTenantId(String tenantId);
}

