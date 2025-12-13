import axios from 'axios';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const BOOKING_URL = `${API_GATEWAY_URL}/api/bookings`;
const ROOMS_URL = `${API_GATEWAY_URL}/api/rooms`;

describe('Booking Service Tests', () => {
  let authToken: string;
  let roomId: string;
  let bookingId: string;

  beforeAll(async () => {
    // Login to get token
    const loginResponse = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });
    authToken = loginResponse.data.token;
  });

  describe('Room Management', () => {
    it('should get all rooms', async () => {
      const response = await axios.get(ROOMS_URL);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        roomId = response.data[0].id;
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('name');
        expect(response.data[0]).toHaveProperty('capacity');
      }
    });

    it('should get room by ID', async () => {
      if (!roomId) {
        const roomsResponse = await axios.get(ROOMS_URL);
        if (roomsResponse.data.length === 0) {
          return; // Skip if no rooms
        }
        roomId = roomsResponse.data[0].id;
      }

      const response = await axios.get(`${ROOMS_URL}/${roomId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(roomId);
    });

    it('should filter rooms by tenant', async () => {
      const response = await axios.get(`${ROOMS_URL}?tenant=engineering`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      response.data.forEach((room: any) => {
        expect(room.tenant).toBe('engineering');
      });
    });
  });

  describe('Booking Management', () => {
    it('should create a booking successfully', async () => {
      if (!roomId) {
        const roomsResponse = await axios.get(ROOMS_URL);
        if (roomsResponse.data.length === 0) {
          return; // Skip if no rooms
        }
        roomId = roomsResponse.data[0].id;
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(12, 0, 0, 0);

      const bookingData = {
        room_id: roomId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        purpose: 'Test Meeting',
      };

      const response = await axios.post(BOOKING_URL, bookingData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('booking');
      expect(response.data.booking.room_id).toBe(roomId);
      
      bookingId = response.data.booking.id;
    });

    it('should prevent overbooking (time conflict)', async () => {
      if (!roomId) return;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(12, 0, 0, 0);

      const bookingData = {
        room_id: roomId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        purpose: 'Conflicting Meeting',
      };

      try {
        await axios.post(BOOKING_URL, bookingData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        fail('Should have thrown an error for overbooking');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toContain('not available');
      }
    });

    it('should get user bookings', async () => {
      const response = await axios.get(BOOKING_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should cancel a booking', async () => {
      if (!bookingId) return;

      const response = await axios.delete(`${BOOKING_URL}/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('booking');
      expect(response.data.booking.status).toBe('cancelled');
    });

    it('should reject booking in the past', async () => {
      if (!roomId) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const bookingData = {
        room_id: roomId,
        start_time: yesterday.toISOString(),
        end_time: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        purpose: 'Past Meeting',
      };

      try {
        await axios.post(BOOKING_URL, bookingData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        fail('Should have thrown an error for past booking');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});


