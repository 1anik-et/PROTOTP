import { Router } from 'express';
import { sendOTP, verifyOTP, verifyFirebaseToken } from '../controllers/authController';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/firebase-login', verifyFirebaseToken);

export default router;