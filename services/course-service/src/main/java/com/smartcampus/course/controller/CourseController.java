package com.smartcampus.course.controller;

import com.smartcampus.course.dto.CourseResponse;
import com.smartcampus.course.dto.CreateCourseRequest;
import com.smartcampus.course.service.CourseService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponse> create(
            @RequestHeader("X-Roles") String roles,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @Valid @RequestBody CreateCourseRequest request) {
        if (!roles.contains("ADMIN") && !roles.contains("PROFESSOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // FR-03: professor creates course scoped to tenant
        CourseResponse response = courseService.create(request, userId, tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> list(@RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(courseService.list(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> get(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(courseService.get(id, tenantId));
    }
}

