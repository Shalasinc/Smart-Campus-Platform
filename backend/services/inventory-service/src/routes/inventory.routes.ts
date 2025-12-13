import { Router } from 'express';
import { reserveInventoryHandler, releaseInventoryHandler } from '../controllers/inventory.controller';

const router = Router();

router.post('/reserve', reserveInventoryHandler);
router.post('/release', releaseInventoryHandler);

export default router;

