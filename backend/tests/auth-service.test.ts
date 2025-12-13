import axios from 'axios';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const AUTH_URL = `${API_GATEWAY_URL}/api/auth`;

describe('Auth Service Tests', () => {
  let authToken: string;
  let userId: string;

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        tenant: 'engineering',
        role: 'student',
      };

      const response = await axios.post(`${AUTH_URL}/register`, userData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(userData.email);
      
      authToken = response.data.token;
      userId = response.data.user.id;
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
        tenant: 'engineering',
        role: 'student',
      };

      await axios.post(`${AUTH_URL}/register`, userData);
      
      try {
        await axios.post(`${AUTH_URL}/register`, userData);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toContain('already exists');
      }
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // too short
      };

      try {
        await axios.post(`${AUTH_URL}/register`, invalidData);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await axios.post(`${AUTH_URL}/login`, loginData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      
      authToken = response.data.token;
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      try {
        await axios.post(`${AUTH_URL}/login`, loginData);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toContain('Invalid credentials');
      }
    });

    it('should reject non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      try {
        await axios.post(`${AUTH_URL}/login`, loginData);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('JWT Token Validation', () => {
    it('should get user info with valid token', async () => {
      const response = await axios.get(`${AUTH_URL}/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user).toHaveProperty('email');
    });

    it('should reject request without token', async () => {
      try {
        await axios.get(`${AUTH_URL}/me`);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should reject invalid token', async () => {
      try {
        await axios.get(`${AUTH_URL}/me`, {
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(403);
      }
    });
  });
});

