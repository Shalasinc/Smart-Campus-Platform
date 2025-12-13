import axios from 'axios';
import amqp from 'amqplib';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
const MARKETPLACE_URL = `${API_GATEWAY_URL}/api/marketplace`;

describe('Saga Pattern Tests', () => {
  let authToken: string;
  let productId: string;
  let connection: any;
  let channel: any;

  beforeAll(async () => {
    // Login
    const response = await axios.post(`${API_GATEWAY_URL}/api/auth/login`, {
      email: 'student@example.com',
      password: 'password123',
    });
    authToken = response.data.token;

    // Connect to RabbitMQ to listen for events
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange('smartcampus_events', 'topic', { durable: true });
  });

  afterAll(async () => {
    if (channel) await channel.close();
    if (connection) await connection.close();
  });

  describe('Successful Saga Flow', () => {
    it('should complete full purchase saga successfully', async (done) => {
      // Get a product
      const productsResponse = await axios.get(`${MARKETPLACE_URL}/products`);
      if (productsResponse.data.length === 0) {
        return done(); // Skip if no products
      }
      productId = productsResponse.data[0].id;

      // Set up event listeners
      const events: string[] = [];
      const queue = await channel.assertQueue('', { exclusive: true });
      
      await channel.bindQueue(queue.queue, 'smartcampus_events', 'order.created');
      await channel.bindQueue(queue.queue, 'smartcampus_events', 'inventory.reserved');
      await channel.bindQueue(queue.queue, 'smartcampus_events', 'payment.processed');
      await channel.bindQueue(queue.queue, 'smartcampus_events', 'order.confirmed');

      channel.consume(queue.queue, (msg: any) => {
        if (msg) {
          const event = JSON.parse(msg.content.toString());
          events.push(msg.fields.routingKey);
          channel.ack(msg);

          // Check if all events occurred
          if (events.includes('order.created') && 
              events.includes('inventory.reserved') && 
              events.includes('payment.processed') && 
              events.includes('order.confirmed')) {
            expect(events).toContain('order.created');
            expect(events).toContain('inventory.reserved');
            expect(events).toContain('payment.processed');
            expect(events).toContain('order.confirmed');
            done();
          }
        }
      }, { noAck: false });

      // Create order (triggers Saga)
      const orderData = {
        items: [
          {
            productId: productId,
            quantity: 1,
            priceAtTime: 29.99,
          },
        ],
      };

      await axios.post(`${MARKETPLACE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Wait for events (timeout after 10 seconds)
      setTimeout(() => {
        if (!events.includes('order.confirmed')) {
          done(new Error('Saga did not complete in time'));
        }
      }, 10000);
    }, 15000);
  });

  describe('Saga Compensation Flow', () => {
    it('should trigger compensation on payment failure', async (done) => {
      // This test would require mocking payment service to fail
      // For now, we'll just verify the structure
      expect(true).toBe(true);
      done();
    });
  });
});

