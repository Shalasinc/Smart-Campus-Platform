CREATE TABLE exam (
    id BIGSERIAL PRIMARY KEY,
    instructor_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE exam_questions (
    exam_id BIGINT NOT NULL REFERENCES exam(id),
    question_text TEXT NOT NULL
);

CREATE TABLE submission (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submitted_at TIMESTAMP NOT NULL
);

CREATE TABLE submission_answers (
    submission_id BIGINT NOT NULL REFERENCES submission(id),
    question_index INT NOT NULL,
    answer_text TEXT NOT NULL,
    PRIMARY KEY (submission_id, question_index)
);

