import pool from '../config/database';

export interface InventoryReservation {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  status: 'reserved' | 'confirmed' | 'released';
  created_at: Date;
}

export const reserveInventory = async (
  productId: string,
  quantity: number,
  orderId: string
): Promise<InventoryReservation> => {
  // First, create the inventory_reservations table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_reservations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL,
      order_id UUID NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('reserved', 'confirmed', 'released')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Check if product exists and has enough stock
  const productResult = await pool.query(
    'SELECT stock FROM products WHERE id = $1',
    [productId]
  );

  if (productResult.rows.length === 0) {
    throw new Error('Product not found');
  }

  const currentStock = parseInt(productResult.rows[0].stock);
  if (currentStock < quantity) {
    throw new Error('Insufficient stock');
  }

  // Reserve inventory
  const result = await pool.query(
    `INSERT INTO inventory_reservations (product_id, order_id, quantity, status, created_at)
     VALUES ($1, $2, $3, 'reserved', NOW())
     RETURNING *`,
    [productId, orderId, quantity]
  );

  // Decrease stock
  await pool.query(
    'UPDATE products SET stock = stock - $1 WHERE id = $2',
    [quantity, productId]
  );

  return result.rows[0];
};

export const confirmReservation = async (orderId: string): Promise<void> => {
  await pool.query(
    `UPDATE inventory_reservations 
     SET status = 'confirmed'
     WHERE order_id = $1 AND status = 'reserved'`,
    [orderId]
  );
};

export const releaseReservation = async (orderId: string): Promise<void> => {
  const reservations = await pool.query(
    `SELECT * FROM inventory_reservations WHERE order_id = $1 AND status = 'reserved'`,
    [orderId]
  );

  for (const reservation of reservations.rows) {
    // Restore stock
    await pool.query(
      'UPDATE products SET stock = stock + $1 WHERE id = $2',
      [reservation.quantity, reservation.product_id]
    );

    // Mark as released
    await pool.query(
      `UPDATE inventory_reservations SET status = 'released' WHERE id = $1`,
      [reservation.id]
    );
  }
};
