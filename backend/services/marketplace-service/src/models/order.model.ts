import pool from '../config/database';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: Date;
}

export const createOrder = async (userId: string, totalAmount: number): Promise<Order> => {
  const result = await pool.query(
    `INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
     VALUES ($1, $2, 'pending', NOW(), NOW())
     RETURNING *`,
    [userId, totalAmount]
  );
  return result.rows[0];
};

export const createOrderItem = async (
  orderId: string,
  productId: string,
  quantity: number,
  priceAtTime: number
): Promise<OrderItem> => {
  const result = await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price_at_time, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [orderId, productId, quantity, priceAtTime]
  );
  return result.rows[0];
};

export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<Order | null> => {
  const result = await pool.query(
    `UPDATE orders 
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, orderId]
  );
  return result.rows[0] || null;
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0] || null;
};


