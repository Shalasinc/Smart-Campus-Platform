package com.smartcampus.exam.service;

import com.smartcampus.exam.dto.SubmitAnswersRequest;
import com.smartcampus.exam.model.Submission;
import com.smartcampus.exam.repository.SubmissionRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    @Transactional
    public Submission submit(SubmitAnswersRequest request) {
        Submission submission = Submission.builder()
                .examId(request.getExamId())
                .studentId(request.getStudentId())
                .answers(request.getAnswers())
                .submittedAt(LocalDateTime.now())
                .build();
        return submissionRepository.save(submission);
    }

    public List<Submission> byExam(Long examId) {
        return submissionRepository.findByExamId(examId);
    }
}

