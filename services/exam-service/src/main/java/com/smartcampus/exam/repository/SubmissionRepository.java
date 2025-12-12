package com.smartcampus.exam.repository;

import com.smartcampus.exam.model.Submission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByExamId(Long examId);
}

