import pool from '../config/database';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  seller_id: string;
  category: string;
  stock: number;
  image: string | null;
  tenant: 'engineering' | 'medical';
  created_at: Date;
  updated_at: Date;
}

export const getAllProducts = async (tenant?: string): Promise<Product[]> => {
  let query = 'SELECT * FROM products';
  const params: any[] = [];

  if (tenant) {
    query += ' WHERE tenant = $1';
    params.push(tenant);
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createProduct = async (
  name: string,
  description: string | null,
  price: number,
  sellerId: string,
  category: string,
  stock: number,
  image: string | null,
  tenant: 'engineering' | 'medical'
): Promise<Product> => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, seller_id, category, stock, image, tenant, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     RETURNING *`,
    [name, description, price, sellerId, category, stock, image, tenant]
  );
  return result.rows[0];
};

export const updateProductStock = async (id: string, quantity: number): Promise<Product | null> => {
  const result = await pool.query(
    `UPDATE products 
     SET stock = stock - $1, updated_at = NOW()
     WHERE id = $2 AND stock >= $1
     RETURNING *`,
    [quantity, id]
  );
  return result.rows[0] || null;
};


