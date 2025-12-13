-- Seed Rooms for Booking Service
INSERT INTO rooms (name, capacity, building, floor, amenities, tenant, is_available, created_at, updated_at)
VALUES
  ('Conference Room A', 20, 'Engineering Building', 1, ARRAY['projector', 'whiteboard', 'wifi'], 'engineering', true, NOW(), NOW()),
  ('Conference Room B', 15, 'Engineering Building', 1, ARRAY['projector', 'wifi'], 'engineering', true, NOW(), NOW()),
  ('Lab 101', 30, 'Engineering Building', 2, ARRAY['computers', 'wifi'], 'engineering', true, NOW(), NOW()),
  ('Study Room 1', 8, 'Engineering Building', 3, ARRAY['wifi'], 'engineering', true, NOW(), NOW()),
  ('Study Room 2', 6, 'Engineering Building', 3, ARRAY['wifi'], 'engineering', true, NOW(), NOW()),
  ('Medical Lab A', 25, 'Medical Building', 1, ARRAY['microscopes', 'wifi'], 'medical', true, NOW(), NOW()),
  ('Medical Lab B', 20, 'Medical Building', 1, ARRAY['equipment', 'wifi'], 'medical', true, NOW(), NOW()),
  ('Examination Room 1', 10, 'Medical Building', 2, ARRAY['beds', 'equipment'], 'medical', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed Sample Bookings
DO $$
DECLARE
  student_id_val UUID;
  teacher_id_val UUID;
  room1_id UUID;
  room2_id UUID;
  room3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO student_id_val FROM users WHERE email = 'student@example.com' LIMIT 1;
  SELECT id INTO teacher_id_val FROM users WHERE email = 'teacher@example.com' LIMIT 1;
  
  -- Get room IDs
  SELECT id INTO room1_id FROM rooms WHERE name = 'Conference Room A' LIMIT 1;
  SELECT id INTO room2_id FROM rooms WHERE name = 'Lab 101' LIMIT 1;
  SELECT id INTO room3_id FROM rooms WHERE name = 'Medical Lab A' LIMIT 1;
  
  IF student_id_val IS NOT NULL AND room1_id IS NOT NULL THEN
    -- Past booking (completed)
    INSERT INTO bookings (room_id, user_id, start_time, end_time, purpose, status, created_at, updated_at)
    VALUES (
      room1_id, 
      student_id_val, 
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days' + INTERVAL '2 hours',
      'Group Study Session',
      'confirmed',
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '2 days'
    ) ON CONFLICT DO NOTHING;
    
    -- Upcoming booking (confirmed)
    INSERT INTO bookings (room_id, user_id, start_time, end_time, purpose, status, created_at, updated_at)
    VALUES (
      room1_id, 
      student_id_val, 
      NOW() + INTERVAL '1 day',
      NOW() + INTERVAL '1 day' + INTERVAL '3 hours',
      'Project Presentation',
      'confirmed',
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF teacher_id_val IS NOT NULL AND room2_id IS NOT NULL THEN
    -- Teacher booking
    INSERT INTO bookings (room_id, user_id, start_time, end_time, purpose, status, created_at, updated_at)
    VALUES (
      room2_id, 
      teacher_id_val, 
      NOW() + INTERVAL '3 days',
      NOW() + INTERVAL '3 days' + INTERVAL '2 hours',
      'Lab Session',
      'confirmed',
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  IF student_id_val IS NOT NULL AND room3_id IS NOT NULL THEN
    -- Medical student booking
    INSERT INTO bookings (room_id, user_id, start_time, end_time, purpose, status, created_at, updated_at)
    VALUES (
      room3_id, 
      student_id_val, 
      NOW() + INTERVAL '5 days',
      NOW() + INTERVAL '5 days' + INTERVAL '4 hours',
      'Medical Practice',
      'pending',
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed Sample Orders (for Saga Pattern visualization)
DO $$
DECLARE
  student_id_val UUID;
  student2_id_val UUID;
  product1_id UUID;
  product2_id UUID;
  product3_id UUID;
  order1_id UUID;
  order2_id UUID;
  order3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO student_id_val FROM users WHERE email = 'student@example.com' LIMIT 1;
  SELECT id INTO student2_id_val FROM users WHERE email = 'student2@example.com' LIMIT 1;
  
  -- Get product IDs
  SELECT id INTO product1_id FROM products WHERE name = 'Laptop Stand' LIMIT 1;
  SELECT id INTO product2_id FROM products WHERE name = 'Wireless Mouse' LIMIT 1;
  SELECT id INTO product3_id FROM products WHERE name = 'Textbook: Data Structures' LIMIT 1;
  
  IF student_id_val IS NOT NULL AND product1_id IS NOT NULL THEN
    -- Order 1: Completed (all saga steps done)
    INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
    VALUES (student_id_val, 29.99, 'confirmed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
    RETURNING id INTO order1_id;
    
    IF order1_id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
      VALUES (order1_id, product1_id, 1, 29.99, NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING;
      
      -- Inventory reservation (confirmed)
      INSERT INTO inventory_reservations (product_id, order_id, quantity, status, created_at)
      VALUES (product1_id, order1_id, 1, 'confirmed', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Order 2: Processing (saga in progress)
    INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
    VALUES (student_id_val, 49.99, 'processing', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour')
    RETURNING id INTO order2_id;
    
    IF order2_id IS NOT NULL AND product3_id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
      VALUES (order2_id, product3_id, 1, 49.99, NOW() - INTERVAL '1 hour')
      ON CONFLICT DO NOTHING;
      
      -- Inventory reservation (reserved - waiting for payment)
      INSERT INTO inventory_reservations (product_id, order_id, quantity, status, created_at)
      VALUES (product3_id, order2_id, 1, 'reserved', NOW() - INTERVAL '1 hour')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  IF student2_id_val IS NOT NULL AND product2_id IS NOT NULL THEN
    -- Order 3: Pending (just created - saga starting)
    INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
    VALUES (student2_id_val, 39.98, 'pending', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes')
    RETURNING id INTO order3_id;
    
    IF order3_id IS NOT NULL THEN
      INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
      VALUES (order3_id, product2_id, 2, 19.99, NOW() - INTERVAL '5 minutes')
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Order 4: Failed (saga compensation triggered)
    INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
    VALUES (student2_id_val, 89.99, 'failed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
    RETURNING id INTO order3_id;
    
    IF order3_id IS NOT NULL THEN
      SELECT id INTO product1_id FROM products WHERE name = 'Calculator TI-84' LIMIT 1;
      IF product1_id IS NOT NULL THEN
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
        VALUES (order3_id, product1_id, 1, 89.99, NOW() - INTERVAL '1 day')
        ON CONFLICT DO NOTHING;
        
        -- Inventory reservation (released - compensation)
        INSERT INTO inventory_reservations (product_id, order_id, quantity, status, created_at)
        VALUES (product1_id, order3_id, 1, 'released', NOW() - INTERVAL '1 day')
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END IF;
END $$;

