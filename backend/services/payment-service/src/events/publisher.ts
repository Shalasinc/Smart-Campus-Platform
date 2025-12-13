import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
const EXCHANGE_NAME = 'smartcampus_events';

let channel: amqp.Channel | null = null;

export const publishEvent = async (routingKey: string, message: any) => {
  if (!channel) {
    const conn = await amqp.connect(RABBITMQ_URL);
    if (!conn) {
      throw new Error('Failed to establish RabbitMQ connection');
    }
    
    channel = await conn.createChannel();
    if (!channel) {
      throw new Error('Failed to create RabbitMQ channel');
    }
    
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
  }

  if (!channel) {
    throw new Error('Channel is not available');
  }

  try {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.publish(EXCHANGE_NAME, routingKey, messageBuffer, { persistent: true });
    console.log(`📤 Event published: ${routingKey}`, message);
  } catch (error) {
    console.error('❌ Error publishing event:', error);
    throw error;
  }
};

