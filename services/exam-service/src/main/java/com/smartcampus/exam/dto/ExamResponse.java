package com.smartcampus.exam.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExamResponse {
    private Long id;
    private Long instructorId;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<String> questions;
}

