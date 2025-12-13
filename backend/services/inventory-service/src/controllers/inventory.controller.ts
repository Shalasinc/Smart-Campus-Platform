import { Request, Response } from 'express';
import { reserveInventory, confirmReservation, releaseReservation } from '../models/inventory.model';
import { publishEvent } from '../events/publisher';

export const reserveInventoryHandler = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, orderId } = req.body;

    const reservation = await reserveInventory(productId, quantity, orderId);

    // Publish inventory reserved event
    await publishEvent('inventory.reserved', {
      orderId,
      productId,
      quantity,
    });

    res.json({
      message: 'Inventory reserved successfully',
      reservation,
    });
  } catch (error: any) {
    console.error('Reserve inventory error:', error);
    res.status(400).json({ error: error.message || 'Failed to reserve inventory' });
  }
};

export const releaseInventoryHandler = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    await releaseReservation(orderId);

    res.json({
      message: 'Inventory released successfully',
    });
  } catch (error: any) {
    console.error('Release inventory error:', error);
    res.status(500).json({ error: error.message || 'Failed to release inventory' });
  }
};

// Export for use in event handlers
export { reserveInventory, releaseReservation };

