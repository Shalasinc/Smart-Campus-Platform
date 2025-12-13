import axios from 'axios';
import bcrypt from 'bcryptjs';
import pool from '../services/auth-service/src/config/database';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const seedAll = async () => {
  try {
    console.log('🌱 Starting seed process...');

    // 1. Seed Users
    console.log('\n📝 Seeding users...');
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
         SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
        [user.email, passwordHash, user.name, user.tenant, user.role]
      );
      console.log(`  ✅ User: ${user.email}`);
    }

    // 2. Seed Products (via API)
    console.log('\n🛍️ Seeding products...');
    const sellerResponse = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'seller@example.com',
      password: 'password123',
    });
    const sellerToken = sellerResponse.data.token;

    const products = [
      { name: 'Laptop Stand', description: 'Adjustable laptop stand', price: 29.99, category: 'electronics', stock: 50, tenant: 'engineering' },
      { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 19.99, category: 'electronics', stock: 100, tenant: 'engineering' },
      { name: 'Textbook: Data Structures', description: 'Introduction to Data Structures', price: 49.99, category: 'books', stock: 30, tenant: 'engineering' },
      { name: 'Calculator TI-84', description: 'Graphing calculator', price: 89.99, category: 'electronics', stock: 25, tenant: 'engineering' },
      { name: 'Lab Coat', description: 'White lab coat', price: 39.99, category: 'clothing', stock: 40, tenant: 'medical' },
      { name: 'Stethoscope', description: 'Professional stethoscope', price: 79.99, category: 'equipment', stock: 20, tenant: 'medical' },
      { name: 'Anatomy Atlas', description: 'Complete anatomy reference', price: 59.99, category: 'books', stock: 35, tenant: 'medical' },
    ];

    for (const product of products) {
      try {
        await axios.post(`${API_GATEWAY_URL}/api/marketplace/products`, product, {
          headers: { Authorization: `Bearer ${sellerToken}` },
        });
        console.log(`  ✅ Product: ${product.name}`);
      } catch (error: any) {
        console.log(`  ⚠️ Product ${product.name} might already exist`);
      }
    }

    // 3. Seed Notifications
    console.log('\n📧 Seeding notifications...');
    const studentResponse = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'student@example.com',
      password: 'password123',
    });
    const studentId = studentResponse.data.user.id;

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

    console.log('\n✅ Seed process completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Student: student@example.com / password123');
    console.log('  Teacher: teacher@example.com / password123');
    console.log('  Admin: admin@example.com / password123');
    console.log('  Seller: seller@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAll();

