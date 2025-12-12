package com.smartcampus.exam.service;

import com.smartcampus.exam.dto.CreateExamRequest;
import com.smartcampus.exam.dto.ExamResponse;
import com.smartcampus.exam.model.Exam;
import com.smartcampus.exam.repository.ExamRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final RestTemplate restTemplate;

    public ExamService(ExamRepository examRepository, RestTemplate restTemplate) {
        this.examRepository = examRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    @CircuitBreaker(name = "examBreaker", fallbackMethod = "fallbackCreate")
    public ExamResponse create(CreateExamRequest request) {
        Exam exam = Exam.builder()
                .instructorId(request.getInstructorId())
                .title(request.getTitle())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .questions(request.getQuestions())
                .build();
        Exam saved = examRepository.save(exam);
        notifyExamStart(saved);
        return toResponse(saved);
    }

    public ExamResponse fallbackCreate(CreateExamRequest request, Throwable ex) {
        throw new RuntimeException("Exam service temporarily unavailable: " + ex.getMessage());
    }

    public List<ExamResponse> list() {
        return examRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExamResponse get(Long id) {
        return examRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    private ExamResponse toResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .instructorId(exam.getInstructorId())
                .title(exam.getTitle())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .questions(exam.getQuestions())
                .build();
    }

    @CircuitBreaker(name = "notificationBreaker", fallbackMethod = "notificationFallback")
    public void notifyExamStart(Exam exam) {
        String url = System.getenv().getOrDefault(
                "NOTIFICATION_URL",
                "http://notification-service:8088/api/notifications/send");
        Map<String, Object> payload = new HashMap<>();
        payload.put("subject", "Exam started: " + exam.getTitle());
        payload.put("body", "Exam window open from " + exam.getStartTime() + " to " + exam.getEndTime());
        payload.put("tenantId", "default");
        restTemplate.postForEntity(url, payload, Void.class);
    }

    public void notificationFallback(Exam exam, Throwable ex) {
        // Circuit breaker fallback keeps exam creation fast even if Notification is down
        System.out.println("[CB] Notification skipped for exam " + exam.getId() + ": " + ex.getMessage());
    }
}

