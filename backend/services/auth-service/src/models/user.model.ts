import pool from '../config/database';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  tenant: 'engineering' | 'medical';
  role: 'student' | 'teacher' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export const createUser = async (
  email: string,
  passwordHash: string,
  name: string,
  tenant: 'engineering' | 'medical',
  role: 'student' | 'teacher' | 'admin'
): Promise<User> => {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, name, tenant, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, email, password_hash, name, tenant, role, created_at, updated_at`,
    [email, passwordHash, name, tenant, role]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT id, email, name, tenant, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

