import express from 'express';
import { registerUser, loginUser, fetchUserById, fetchProfile, bulkInsert, searchUserByQuery } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/bulk-insert', bulkInsert);
router.post('/login', loginUser);
router.get('/:id', protect, fetchUserById);
router.get('/:id/profile', protect, fetchProfile);
router.get('/search/:query', protect, searchUserByQuery);

export default router;