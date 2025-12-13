import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createBooking, getBookings, getBookingById, cancelBooking } from '../models/booking.model';
import { isRoomAvailable } from '../services/booking.service';

export const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authReq = req as any;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { room_id, start_time, end_time, purpose } = req.body;

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Check availability (prevent overbooking)
    const availability = await isRoomAvailable(room_id, startTime, endTime);
    if (!availability.available) {
      return res.status(400).json({
        error: 'Room not available',
        reason: availability.reason,
      });
    }

    // Create booking
    const booking = await createBooking(userId, room_id, startTime, endTime, purpose);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookingsHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;

    const bookings = await getBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelBookingHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const booking = await cancelBooking(id, userId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateCreateBooking = [
  body('room_id').notEmpty().withMessage('Room ID is required'),
  body('start_time').isISO8601().withMessage('Valid start time is required'),
  body('end_time').isISO8601().withMessage('Valid end time is required'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
];


