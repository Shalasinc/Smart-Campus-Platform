import { checkBookingConflict } from '../models/booking.model';
import { getRoomById } from '../models/room.model';

export const isRoomAvailable = async (
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
): Promise<{ available: boolean; reason?: string }> => {
  // Check if room exists and is available
  const room = await getRoomById(roomId);
  if (!room) {
    return { available: false, reason: 'Room not found' };
  }

  if (!room.is_available) {
    return { available: false, reason: 'Room is not available' };
  }

  // Check for time conflicts
  const hasConflict = await checkBookingConflict(roomId, startTime, endTime, excludeBookingId);
  if (hasConflict) {
    return { available: false, reason: 'Time slot is already booked' };
  }

  // Validate time range
  if (startTime >= endTime) {
    return { available: false, reason: 'End time must be after start time' };
  }

  // Check if booking is in the past
  if (startTime < new Date()) {
    return { available: false, reason: 'Cannot book in the past' };
  }

  return { available: true };
};


