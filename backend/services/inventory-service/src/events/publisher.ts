import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
const EXCHANGE_NAME = 'smartcampus_events';

let channel: amqp.Channel | null = null;

export const publishEvent = async (routingKey: string, message: any) => {
  if (!channel) {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
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

