// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getCurrentUser, uploadImageFunction } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../helpers/MulterConf.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.post('/upload-pic',protect,upload.single('image'),uploadImageFunction)
export default router;
