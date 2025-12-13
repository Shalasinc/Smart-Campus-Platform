import bcrypt from 'bcryptjs';
import pool from '../services/auth-service/src/config/database';

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');

    const users = [
      {
        email: 'student@example.com',
        password: 'password123',
        name: 'Student User',
        tenant: 'engineering' as const,
        role: 'student' as const,
      },
      {
        email: 'student2@example.com',
        password: 'password123',
        name: 'Student 2',
        tenant: 'medical' as const,
        role: 'student' as const,
      },
      {
        email: 'teacher@example.com',
        password: 'password123',
        name: 'Teacher User',
        tenant: 'engineering' as const,
        role: 'teacher' as const,
      },
      {
        email: 'teacher2@example.com',
        password: 'password123',
        name: 'Teacher 2',
        tenant: 'medical' as const,
        role: 'teacher' as const,
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        tenant: 'engineering' as const,
        role: 'admin' as const,
      },
      {
        email: 'seller@example.com',
        password: 'password123',
        name: 'Seller User',
        tenant: 'engineering' as const,
        role: 'teacher' as const,
      },
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
      
      console.log(`✅ User created: ${user.email}`);
    }

    console.log('✅ All users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

