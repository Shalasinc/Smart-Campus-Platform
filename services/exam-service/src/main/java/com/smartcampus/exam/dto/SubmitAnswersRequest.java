package com.smartcampus.exam.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAnswersRequest {
    @NotNull
    private Long examId;
    @NotNull
    private Long studentId;
    @NotEmpty
    private Map<Integer, String> answers;
}

