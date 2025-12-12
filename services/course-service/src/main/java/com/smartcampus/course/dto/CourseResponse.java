package com.smartcampus.course.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CourseResponse {
    UUID id;
    String title;
    String description;
    UUID professorId;
    String tenantId;
    Instant createdAt;
}

