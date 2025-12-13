import { Request, Response } from 'express';
import { createOrder, createOrderItem, updateOrderStatus, getOrderById } from '../models/order.model';
import { getProductById, updateProductStock } from '../models/product.model';
import { publishEvent } from '../events/publisher';

export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { items } = req.body; // [{ productId, quantity, priceAtTime }]

    // Calculate total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.priceAtTime * item.quantity;
    }

    // Create order
    const order = await createOrder(userId, totalAmount);

    // Create order items
    for (const item of items) {
      await createOrderItem(order.id, item.productId, item.quantity, item.priceAtTime);
    }

    // Publish order created event for Saga
    await publishEvent('order.created', {
      orderId: order.id,
      userId,
      items,
      totalAmount,
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const confirmOrder = async (orderId: string) => {
  await updateOrderStatus(orderId, 'processing');
  await publishEvent('order.confirmed', { orderId });
};

export const cancelOrder = async (orderId: string) => {
  await updateOrderStatus(orderId, 'cancelled');
  await publishEvent('order.cancelled', { orderId });
};


