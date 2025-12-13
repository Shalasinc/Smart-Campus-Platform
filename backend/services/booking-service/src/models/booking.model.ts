import pool from '../config/database';

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  start_time: Date;
  end_time: Date;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export const createBooking = async (
  userId: string,
  roomId: string,
  startTime: Date,
  endTime: Date,
  purpose: string
): Promise<Booking> => {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, room_id, start_time, end_time, purpose, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'confirmed', NOW(), NOW())
     RETURNING *`,
    [userId, roomId, startTime, endTime, purpose]
  );
  return result.rows[0];
};

export const getBookings = async (userId?: string): Promise<Booking[]> => {
  let query = 'SELECT * FROM bookings';
  const params: any[] = [];

  if (userId) {
    query += ' WHERE user_id = $1';
    params.push(userId);
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const cancelBooking = async (id: string, userId: string): Promise<Booking | null> => {
  const result = await pool.query(
    `UPDATE bookings 
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return result.rows[0] || null;
};

export const checkBookingConflict = async (
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
): Promise<boolean> => {
  let query = `
    SELECT COUNT(*) as count
    FROM bookings
    WHERE room_id = $1
      AND status = 'confirmed'
      AND (
        (start_time <= $2 AND end_time > $2) OR
        (start_time < $3 AND end_time >= $3) OR
        (start_time >= $2 AND end_time <= $3)
      )
  `;
  const params: any[] = [roomId, startTime, endTime];

  if (excludeBookingId) {
    query += ' AND id != $4';
    params.push(excludeBookingId);
  }

  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count) > 0;
};

