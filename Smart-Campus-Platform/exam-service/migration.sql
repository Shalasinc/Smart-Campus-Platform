-- Migration script for exam-service tables
-- This ensures all required tables and columns exist

-- Add duration_minutes to exams if not exists
ALTER TABLE exams ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- Add new columns to exam_attempts
ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS max_score INTEGER;
ALTER TABLE exam_attempts ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    question_text VARCHAR(1000) NOT NULL,
    correct_option_index INTEGER NOT NULL,
    points INTEGER NOT NULL,
    tenant_id VARCHAR(255),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
    question_id BIGINT NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    option_order INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create student_answers table
CREATE TABLE IF NOT EXISTS student_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_index INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    tenant_id VARCHAR(255),
    FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_tenant_id ON questions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_attempt_id ON student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_tenant_id ON student_answers(tenant_id);
