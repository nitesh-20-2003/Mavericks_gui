import express from 'express';
import { getAllPosts, addPost, likePost, addComment, deletePost, deleteComment } from '../controllers/postController.js';
import { verifyToken } from "../middleware/authMiddleware.js";  // Corrected here

const router = express.Router();

router.get('/', verifyToken, getAllPosts); // Fetch all posts
router.post('/', verifyToken, addPost); // Add a new post
router.post('/like', likePost); // Like a post
router.post('/comment', verifyToken, addComment); // Add a comment to a post
router.delete('/:postId', verifyToken, deletePost); // Delete a post
router.delete('/:postId/comment/:commentId', verifyToken, deleteComment); // Delete a comment

export default router;
