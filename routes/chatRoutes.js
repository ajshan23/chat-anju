// routes/authRoutes.js
import express from 'express';
import { getAlluserExeptlogginedUser, getConversations, getMessagesOfAConversation, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/get-conversations').get(protect, getConversations);
router.route('/get-messages-by-conversation-id').get(protect, getMessagesOfAConversation);
router.route('/get-all-available-users').get(protect, getAlluserExeptlogginedUser);
router.route('/send-message').post(protect, sendMessage)

export default router;
