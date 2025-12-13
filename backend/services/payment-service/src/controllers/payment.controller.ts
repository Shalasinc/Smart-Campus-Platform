import { Request, Response } from 'express';
import { publishEvent } from '../events/publisher';

// Mock payment processing
export const processPayment = async (orderId: string, amount: number): Promise<void> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock: 90% success rate
  const success = Math.random() > 0.1;
  
  if (success) {
    await publishEvent('payment.processed', {
      orderId,
      amount,
      status: 'success',
    });
  } else {
    throw new Error('Payment processing failed');
  }
};

export const refundPayment = async (orderId: string, amount: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  await publishEvent('payment.refunded', {
    orderId,
    amount,
  });
};

export const processPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;
    
    await processPayment(orderId, amount);
    
    res.json({
      message: 'Payment processed successfully',
      orderId,
    });
  } catch (error: any) {
    console.error('Process payment error:', error);
    res.status(400).json({ error: error.message || 'Payment processing failed' });
  }
};

export const refundPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;
    
    await refundPayment(orderId, amount);
    
    res.json({
      message: 'Payment refunded successfully',
      orderId,
    });
  } catch (error: any) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: error.message || 'Refund failed' });
  }
};

