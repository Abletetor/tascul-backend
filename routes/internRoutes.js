import express from 'express';
import { signupIntern, verifyInternEmail, loginIntern, getInternDetails, requestPasswordReset, resetPassword } from '../controllers/internController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupIntern);
router.get('/email-verification', verifyInternEmail);
router.post('/login', loginIntern);
router.get('/details', protect, getInternDetails);

// Password Reset Routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


export default router;

