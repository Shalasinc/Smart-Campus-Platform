package com.smartcampus.course.service;

import com.smartcampus.course.dto.CourseResponse;
import com.smartcampus.course.dto.CreateCourseRequest;
import com.smartcampus.course.model.Course;
import com.smartcampus.course.repository.CourseRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    @Transactional
    @CacheEvict(value = "courses", key = "#tenantId")
    public CourseResponse create(CreateCourseRequest request, UUID professorId, String tenantId) {
        Course course = Course.builder()
                .id(UUID.randomUUID())
                .title(request.getTitle())
                .description(request.getDescription())
                .professorId(professorId)
                .tenantId(tenantId)
                .createdAt(Instant.now())
                .build();
        return toResponse(repository.save(course));
    }

    @Cacheable(value = "courses", key = "#tenantId")
    public List<CourseResponse> list(String tenantId) {
        return repository.findByTenantId(tenantId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse get(UUID id, String tenantId) {
        Course course = repository.findById(id)
                .filter(c -> tenantId.equals(c.getTenantId()))
                .orElseThrow(() -> new IllegalArgumentException("Course not found for tenant"));
        return toResponse(course);
    }

    private CourseResponse toResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .professorId(course.getProfessorId())
                .tenantId(course.getTenantId())
                .createdAt(course.getCreatedAt())
                .build();
    }
}

