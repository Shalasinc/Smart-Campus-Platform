package com.smartcampus.exam.controller;

import com.smartcampus.exam.dto.CreateExamRequest;
import com.smartcampus.exam.dto.ExamResponse;
import com.smartcampus.exam.dto.SubmitAnswersRequest;
import com.smartcampus.exam.model.Submission;
import com.smartcampus.exam.service.ExamService;
import com.smartcampus.exam.service.SubmissionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;
    private final SubmissionService submissionService;

    public ExamController(ExamService examService, SubmissionService submissionService) {
        this.examService = examService;
        this.submissionService = submissionService;
    }

    @PostMapping
    public ResponseEntity<ExamResponse> create(@Valid @RequestBody CreateExamRequest request) {
        return ResponseEntity.ok(examService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> list() {
        return ResponseEntity.ok(examService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(examService.get(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<List<String>> submit(@Valid @RequestBody SubmitAnswersRequest request) {
        Submission saved = submissionService.submit(request);
        List<String> answers = saved.getAnswers().values().stream().collect(Collectors.toList());
        return ResponseEntity.ok(answers);
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<Submission>> submissions(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.byExam(id));
    }
}

