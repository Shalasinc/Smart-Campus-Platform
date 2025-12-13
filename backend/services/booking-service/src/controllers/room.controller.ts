import { Request, Response } from 'express';
import { getAllRooms, getRoomById } from '../models/room.model';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const tenant = req.query.tenant as string | undefined;
    const rooms = await getAllRooms(tenant);
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

