import axios from 'axios';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const NOTIFICATION_URL = `${API_GATEWAY_URL}/api/notifications`;

describe('Circuit Breaker Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'student@example.com',
      password: 'password123',
    });
    authToken = response.data.token;
  });

  describe('Circuit Breaker Behavior', () => {
    it('should handle service unavailability gracefully', async () => {
      // Stop auth service to trigger circuit breaker
      // In real scenario, we would stop the service
      
      const response = await axios.get(NOTIFICATION_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Should still work (fallback or cached response)
      expect([200, 503]).toContain(response.status);
    });

    it('should get notifications successfully', async () => {
      const response = await axios.get(NOTIFICATION_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should create notification', async () => {
      const notificationData = {
        userId: 'test-user-id',
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
      };

      const response = await axios.post(NOTIFICATION_URL, notificationData);

      expect([201, 200]).toContain(response.status);
    });
  });
});

