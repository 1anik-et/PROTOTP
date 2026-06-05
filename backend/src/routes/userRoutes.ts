import { Router } from 'express';
import { saveProfile } from '../controllers/userController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/profile', requireAuth, saveProfile);

export default router;