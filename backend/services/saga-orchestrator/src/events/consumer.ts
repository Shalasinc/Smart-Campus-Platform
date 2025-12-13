import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
const EXCHANGE_NAME = 'smartcampus_events';

let channel: amqp.Channel | null = null;
let connection: amqp.Connection | null = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    console.log('✅ RabbitMQ Exchange declared:', EXCHANGE_NAME);
    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ connection error:', error);
    throw error;
  }
};

export const consumeEvents = async (routingKey: string, handler: (message: any) => Promise<void>) => {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    const queue = await channel!.assertQueue('', { exclusive: true });
    await channel!.bindQueue(queue.queue, EXCHANGE_NAME, routingKey);
    
    console.log(`👂 Listening for events: ${routingKey}`);
    
    channel!.consume(queue.queue, async (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          await handler(message);
          channel!.ack(msg);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          channel!.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('❌ Error setting up consumer:', error);
    throw error;
  }
};

