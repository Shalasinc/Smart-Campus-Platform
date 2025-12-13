import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
const EXCHANGE_NAME = 'smartcampus_events';

export const consumeEvents = async (routingKey: string, handler: (message: any) => Promise<void>) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    const queue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue.queue, EXCHANGE_NAME, routingKey);
    
    console.log(`👂 Listening for events: ${routingKey}`);
    
    channel.consume(queue.queue, async (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          await handler(message);
          channel.ack(msg);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('❌ Error setting up consumer:', error);
    throw error;
  }
};

