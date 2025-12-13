import { Router } from 'express';
import { getRooms, getRoom } from '../controllers/room.controller';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoom);

export default router;

