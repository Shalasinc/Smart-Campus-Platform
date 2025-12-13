import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'smartcampus',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const seedUsers = async () => {
  console.log('📝 Seeding users...');
  
  const users = [
    { email: 'student@example.com', password: 'password123', name: 'Student User', tenant: 'engineering', role: 'student' },
    { email: 'student2@example.com', password: 'password123', name: 'Student 2', tenant: 'medical', role: 'student' },
    { email: 'teacher@example.com', password: 'password123', name: 'Teacher User', tenant: 'engineering', role: 'teacher' },
    { email: 'teacher2@example.com', password: 'password123', name: 'Teacher 2', tenant: 'medical', role: 'teacher' },
    { email: 'admin@example.com', password: 'password123', name: 'Admin User', tenant: 'engineering', role: 'admin' },
    { email: 'seller@example.com', password: 'password123', name: 'Seller User', tenant: 'engineering', role: 'teacher' },
  ];

  for (const user of users) {
    const passwordHash = await hashPassword(user.password);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, name, tenant, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, updated_at = NOW()`,
      [user.email, passwordHash, user.name, user.tenant, user.role]
    );
    
    console.log(`  ✅ User: ${user.email} (${user.role})`);
  }
};

const seedProducts = async () => {
  console.log('\n🛍️ Seeding products...');
  
  const sellerResult = await pool.query('SELECT id FROM users WHERE email = $1', ['seller@example.com']);
  if (sellerResult.rows.length === 0) {
    console.log('  ⚠️ Seller not found, skipping products');
    return;
  }
  
  const sellerId = sellerResult.rows[0].id;
  
  const products = [
    { name: 'Laptop Stand', description: 'Adjustable laptop stand for ergonomic workspace', price: 29.99, category: 'electronics', stock: 50, tenant: 'engineering' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with long battery life', price: 19.99, category: 'electronics', stock: 100, tenant: 'engineering' },
    { name: 'Textbook: Data Structures', description: 'Introduction to Data Structures and Algorithms', price: 49.99, category: 'books', stock: 30, tenant: 'engineering' },
    { name: 'Calculator TI-84', description: 'Graphing calculator for engineering courses', price: 89.99, category: 'electronics', stock: 25, tenant: 'engineering' },
    { name: 'Lab Coat', description: 'White lab coat for medical students', price: 39.99, category: 'clothing', stock: 40, tenant: 'medical' },
    { name: 'Stethoscope', description: 'Professional stethoscope for medical training', price: 79.99, category: 'equipment', stock: 20, tenant: 'medical' },
    { name: 'Anatomy Atlas', description: 'Complete human anatomy reference book', price: 59.99, category: 'books', stock: 35, tenant: 'medical' },
  ];

  for (const product of products) {
    await pool.query(
      `INSERT INTO products (name, description, price, seller_id, category, stock, image, tenant, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [product.name, product.description, product.price, sellerId, product.category, product.stock, 'https://via.placeholder.com/300', product.tenant]
    );
    console.log(`  ✅ Product: ${product.name}`);
  }
};

const seedNotifications = async () => {
  console.log('\n📧 Seeding notifications...');
  
  const studentResult = await pool.query('SELECT id FROM users WHERE email = $1', ['student@example.com']);
  if (studentResult.rows.length === 0) {
    console.log('  ⚠️ Student not found, skipping notifications');
    return;
  }
  
  const studentId = studentResult.rows[0].id;
  
  const notifications = [
    { userId: studentId, title: 'Welcome!', message: 'Welcome to Smart Campus Platform', type: 'info' },
    { userId: studentId, title: 'Order Confirmed', message: 'Your order has been confirmed', type: 'success' },
    { userId: studentId, title: 'Room Booking Reminder', message: 'Your room booking is tomorrow at 10 AM', type: 'warning' },
  ];

  for (const notif of notifications) {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, read, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())
       ON CONFLICT DO NOTHING`,
      [notif.userId, notif.title, notif.message, notif.type]
    );
    console.log(`  ✅ Notification: ${notif.title}`);
  }
};

const main = async () => {
  try {
    console.log('🌱 Starting seed process...\n');
    
    await seedUsers();
    await seedProducts();
    await seedNotifications();
    
    console.log('\n✅ Seed process completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Student: student@example.com / password123');
    console.log('  Teacher: teacher@example.com / password123');
    console.log('  Admin: admin@example.com / password123');
    console.log('  Seller: seller@example.com / password123');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await pool.end();
    process.exit(1);
  }
};

main();


