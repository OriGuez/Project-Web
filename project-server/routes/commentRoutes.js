const express = require('express');

const {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

const router = express.Router();
router.get('/users/:id/videos/:pid/comments', getVideoComments);
router.post('/users/:id/videos/:pid/comments', addComment);
router.put('/users/:id/videos/:pid/:cid', updateComment);
router.patch('/users/:id/videos/:pid/:cid', updateComment);
router.delete('/users/:id/videos/:pid/:cid', deleteComment);
module.exports = router;