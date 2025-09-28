import express from 'express';
import { addComment,createPost, getPosts, likePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts)
router.post('/', protect, createPost)
router.post('/:id/comments', protect, addComment)
router.put('/:id/like', protect, likePost)

export default router;