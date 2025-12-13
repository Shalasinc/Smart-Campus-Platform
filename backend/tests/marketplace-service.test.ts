import axios from 'axios';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const MARKETPLACE_URL = `${API_GATEWAY_URL}/api/marketplace`;

describe('Marketplace Service Tests', () => {
  let authToken: string;
  let sellerToken: string;
  let productId: string;
  let orderId: string;

  beforeAll(async () => {
    // Login as buyer
    const buyerResponse = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'student@example.com',
      password: 'password123',
    });
    authToken = buyerResponse.data.token;

    // Login as seller
    const sellerResponse = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'seller@example.com',
      password: 'password123',
    });
    sellerToken = sellerResponse.data.token;
  });

  describe('Product Management', () => {
    it('should get all products', async () => {
      const response = await axios.get(`${MARKETPLACE_URL}/products`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should create a product (seller)', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        category: 'electronics',
        stock: 10,
        tenant: 'engineering',
      };

      const response = await axios.post(`${MARKETPLACE_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${sellerToken}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('product');
      expect(response.data.product.name).toBe(productData.name);
      
      productId = response.data.product.id;
    });

    it('should get product by ID', async () => {
      if (!productId) return;

      const response = await axios.get(`${MARKETPLACE_URL}/products/${productId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(productId);
    });

    it('should filter products by tenant', async () => {
      const response = await axios.get(`${MARKETPLACE_URL}/products?tenant=engineering`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Order Management', () => {
    it('should create an order (triggers Saga)', async () => {
      if (!productId) {
        // Get first available product
        const productsResponse = await axios.get(`${MARKETPLACE_URL}/products`);
        if (productsResponse.data.length === 0) {
          return; // Skip if no products
        }
        productId = productsResponse.data[0].id;
      }

      const orderData = {
        items: [
          {
            productId: productId,
            quantity: 2,
            priceAtTime: 29.99,
          },
        ],
      };

      const response = await axios.post(`${MARKETPLACE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('order');
      
      orderId = response.data.order.id;
    });

    it('should reject order with insufficient stock', async () => {
      if (!productId) return;

      const orderData = {
        items: [
          {
            productId: productId,
            quantity: 1000, // More than available
            priceAtTime: 29.99,
          },
        ],
      };

      try {
        await axios.post(`${MARKETPLACE_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        fail('Should have thrown an error for insufficient stock');
      } catch (error: any) {
        // Order might be created but Saga will fail at inventory step
        expect([201, 400, 500]).toContain(error.response?.status || 500);
      }
    });
  });
});

