import { publishEvent } from '../events/publisher';
import axios from 'axios';

const MARKETPLACE_SERVICE_URL = process.env.MARKETPLACE_SERVICE_URL || 'http://marketplace-service:3003';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3004';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

interface SagaStep {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export class OrderSaga {
  private executedSteps: SagaStep[] = [];

  async execute(orderData: any) {
    const { orderId, userId, items, totalAmount } = orderData;

    // Define saga steps
    const steps: SagaStep[] = [
      {
        name: 'reserveInventory',
        execute: async () => {
          console.log(`📦 Step 1: Reserving inventory for order ${orderId}`);
          
          // Reserve inventory for each item
          for (const item of items) {
            try {
              await axios.post(`${INVENTORY_SERVICE_URL}/inventory/reserve`, {
                productId: item.productId,
                quantity: item.quantity,
                orderId,
              });
            } catch (error: any) {
              throw new Error(`Failed to reserve inventory: ${error.message}`);
            }
          }
          
          // Publish event
          await publishEvent('inventory.reserved', {
            orderId,
            items,
            totalAmount,
          });
        },
        compensate: async () => {
          console.log(`↩️ Compensating: Releasing inventory for order ${orderId}`);
          
          try {
            await axios.post(`${INVENTORY_SERVICE_URL}/inventory/release`, {
              orderId,
            });
          } catch (error) {
            console.error('Error releasing inventory:', error);
          }
        },
      },
      {
        name: 'processPayment',
        execute: async () => {
          console.log(`💳 Step 2: Processing payment for order ${orderId}`);
          
          try {
            await axios.post(`${PAYMENT_SERVICE_URL}/payments/process`, {
              orderId,
              amount: totalAmount,
            });
          } catch (error: any) {
            throw new Error(`Payment processing failed: ${error.message}`);
          }
          
          // Publish event
          await publishEvent('payment.processed', {
            orderId,
            amount: totalAmount,
            status: 'success',
          });
        },
        compensate: async () => {
          console.log(`↩️ Compensating: Refunding payment for order ${orderId}`);
          
          try {
            await axios.post(`${PAYMENT_SERVICE_URL}/payments/refund`, {
              orderId,
              amount: totalAmount,
            });
          } catch (error) {
            console.error('Error refunding payment:', error);
          }
        },
      },
      {
        name: 'confirmOrder',
        execute: async () => {
          console.log(`✅ Step 3: Confirming order ${orderId}`);
          
          // This would typically call marketplace service to update order status
          // For now, we'll just publish an event
          await publishEvent('order.confirmed', {
            orderId,
            userId,
            totalAmount,
          });
        },
        compensate: async () => {
          console.log(`↩️ Compensating: Cancelling order ${orderId}`);
          
          // Publish cancellation event
          await publishEvent('order.cancelled', {
            orderId,
          });
        },
      },
    ];

    // Execute steps sequentially
    try {
      for (const step of steps) {
        await step.execute();
        this.executedSteps.push(step);
      }
      
      console.log(`✅ Saga completed successfully for order ${orderId}`);
    } catch (error: any) {
      console.error(`❌ Saga failed at step: ${this.executedSteps.length + 1}`, error);
      
      // Execute compensation in reverse order
      for (let i = this.executedSteps.length - 1; i >= 0; i--) {
        try {
          await this.executedSteps[i].compensate();
        } catch (compError) {
          console.error(`Error during compensation for step ${i + 1}:`, compError);
        }
      }
      
      // Reset executed steps
      this.executedSteps = [];
      
      throw error;
    }
  }
}

