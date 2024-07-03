const express = require('express');
const authenticateToken = require('../utils/auth');
const {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

const router = express.Router();
//public routes:
router.get('/users/:id/videos/:pid/comments', getVideoComments);
//private routes:
router.post('/users/:id/videos/:pid/comments',authenticateToken, addComment);
router.put('/users/:id/videos/:pid/:cid',authenticateToken, updateComment);
router.patch('/users/:id/videos/:pid/:cid',authenticateToken, updateComment);
router.delete('/users/:id/videos/:pid/:cid',authenticateToken, deleteComment);
module.exports = router;