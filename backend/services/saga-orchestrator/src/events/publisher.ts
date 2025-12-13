import * as amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
const EXCHANGE_NAME = 'smartcampus_events';

let channel: amqp.Channel | null = null;
let connection: amqp.Connection | null = null;

export const connectRabbitMQ = async (): Promise<amqp.Channel> => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    if (!connection) {
      throw new Error('Failed to establish RabbitMQ connection');
    }
    
    channel = await connection.createChannel();
    if (!channel) {
      throw new Error('Failed to create RabbitMQ channel');
    }
    
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    console.log('✅ RabbitMQ Exchange declared:', EXCHANGE_NAME);
    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ connection error:', error);
    throw error;
  }
};

export const publishEvent = async (routingKey: string, message: any) => {
  if (!channel) {
    channel = await connectRabbitMQ();
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

