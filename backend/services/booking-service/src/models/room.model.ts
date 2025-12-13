import pool from '../config/database';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  amenities: string[];
  is_available: boolean;
  tenant: 'engineering' | 'medical';
  created_at: Date;
  updated_at: Date;
}

export const getAllRooms = async (tenant?: string): Promise<Room[]> => {
  let query = 'SELECT * FROM rooms';
  const params: any[] = [];

  if (tenant) {
    query += ' WHERE tenant = $1';
    params.push(tenant);
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0] || null;
};

