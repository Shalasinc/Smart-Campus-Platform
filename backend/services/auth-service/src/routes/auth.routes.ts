import { Router } from 'express';
import {
  register,
  login,
  getMe,
  validateRegister,
  validateLogin,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getMe);

export default router;

