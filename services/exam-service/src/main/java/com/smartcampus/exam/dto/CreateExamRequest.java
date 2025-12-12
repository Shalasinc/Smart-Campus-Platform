package com.smartcampus.exam.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateExamRequest {
    @NotNull
    private Long instructorId;
    @NotBlank
    private String title;
    @NotNull
    @Future
    private LocalDateTime startTime;
    @NotNull
    @Future
    private LocalDateTime endTime;
    @NotEmpty
    private List<@NotBlank String> questions;
}

