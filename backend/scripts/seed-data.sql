-- Seed Data for Smart Campus Platform
-- This script creates sample data for testing and demonstration

-- ============================================
-- USERS (for Auth Service)
-- ============================================
INSERT INTO users (email, password_hash, name, tenant, role, created_at, updated_at)
VALUES
  -- Students
  ('student@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Student User', 'engineering', 'student', NOW(), NOW()),
  ('student2@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Student 2', 'medical', 'student', NOW(), NOW()),
  
  -- Teachers
  ('teacher@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Teacher User', 'engineering', 'teacher', NOW(), NOW()),
  ('teacher2@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Teacher 2', 'medical', 'teacher', NOW(), NOW()),
  
  -- Admins
  ('admin@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Admin User', 'engineering', 'admin', NOW(), NOW()),
  
  -- Sellers (for Marketplace)
  ('seller@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Seller User', 'engineering', 'teacher', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Note: Password for all users is 'password123'
-- In production, use proper bcrypt hashes

-- ============================================
-- PRODUCTS (for Marketplace)
-- ============================================
-- Get seller user ID
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

-- ============================================
-- ORDERS (Sample orders for testing)
-- ============================================
DO $$
DECLARE
  student_id_val UUID;
  product_id_val UUID;
BEGIN
  SELECT id INTO student_id_val FROM users WHERE email = 'student@example.com' LIMIT 1;
  SELECT id INTO product_id_val FROM products WHERE name = 'Laptop Stand' LIMIT 1;
  
  IF student_id_val IS NOT NULL AND product_id_val IS NOT NULL THEN
    -- Create a sample order
    INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
    VALUES (student_id_val, 29.99, 'processing', NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Create order items
    INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
    SELECT o.id, product_id_val, 1, 29.99, NOW()
    FROM orders o
    WHERE o.user_id = student_id_val AND o.status = 'processing'
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- NOTIFICATIONS (Sample notifications)
-- ============================================
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

-- ============================================
-- CART ITEMS (Sample cart items)
-- ============================================
DO $$
DECLARE
  student_id_val UUID;
  product_id_val UUID;
BEGIN
  SELECT id INTO student_id_val FROM users WHERE email = 'student@example.com' LIMIT 1;
  SELECT id INTO product_id_val FROM products WHERE name = 'Wireless Mouse' LIMIT 1;
  
  IF student_id_val IS NOT NULL AND product_id_val IS NOT NULL THEN
    INSERT INTO cart_items (user_id, product_id, quantity, created_at)
    VALUES (student_id_val, product_id_val, 2, NOW())
    ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = 2;
  END IF;
END $$;

