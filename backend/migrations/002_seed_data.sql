-- Seed Data for Smart Campus Platform
-- Password for all users: password123 (bcrypt hash)

-- Insert Users
INSERT INTO users (email, password_hash, name, tenant, role, created_at, updated_at)
VALUES
  ('student@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Student User', 'engineering', 'student', NOW(), NOW()),
  ('student2@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Student 2', 'medical', 'student', NOW(), NOW()),
  ('teacher@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Teacher User', 'engineering', 'teacher', NOW(), NOW()),
  ('teacher2@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Teacher 2', 'medical', 'teacher', NOW(), NOW()),
  ('admin@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Admin User', 'engineering', 'admin', NOW(), NOW()),
  ('seller@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Seller User', 'engineering', 'teacher', NOW(), NOW())
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, updated_at = NOW();

-- Insert Products (using seller user)
DO $$
DECLARE
  seller_id_val UUID;
BEGIN
  SELECT id INTO seller_id_val FROM users WHERE email = 'seller@example.com' LIMIT 1;
  
  IF seller_id_val IS NOT NULL THEN
    INSERT INTO products (name, description, price, seller_id, category, stock, image, tenant, created_at, updated_at)
    VALUES
      ('Laptop Stand', 'Adjustable laptop stand for ergonomic workspace', 29.99, seller_id_val, 'electronics', 50, 'https://via.placeholder.com/300', 'engineering', NOW(), NOW()),
      ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 19.99, seller_id_val, 'electronics', 100, 'https://via.placeholder.com/300', 'engineering', NOW(), NOW()),
      ('Textbook: Data Structures', 'Introduction to Data Structures and Algorithms', 49.99, seller_id_val, 'books', 30, 'https://via.placeholder.com/300', 'engineering', NOW(), NOW()),
      ('Calculator TI-84', 'Graphing calculator for engineering courses', 89.99, seller_id_val, 'electronics', 25, 'https://via.placeholder.com/300', 'engineering', NOW(), NOW()),
      ('Lab Coat', 'White lab coat for medical students', 39.99, seller_id_val, 'clothing', 40, 'https://via.placeholder.com/300', 'medical', NOW(), NOW()),
      ('Stethoscope', 'Professional stethoscope for medical training', 79.99, seller_id_val, 'equipment', 20, 'https://via.placeholder.com/300', 'medical', NOW(), NOW()),
      ('Anatomy Atlas', 'Complete human anatomy reference book', 59.99, seller_id_val, 'books', 35, 'https://via.placeholder.com/300', 'medical', NOW(), NOW())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert Notifications
DO $$
DECLARE
  student_id_val UUID;
BEGIN
  SELECT id INTO student_id_val FROM users WHERE email = 'student@example.com' LIMIT 1;
  
  IF student_id_val IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, read, created_at)
    VALUES
      (student_id_val, 'Welcome!', 'Welcome to Smart Campus Platform', 'info', false, NOW()),
      (student_id_val, 'Order Confirmed', 'Your order has been confirmed', 'success', false, NOW()),
      (student_id_val, 'Room Booking Reminder', 'Your room booking is tomorrow at 10 AM', 'warning', false, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

