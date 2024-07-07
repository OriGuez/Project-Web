const express = require('express');
const authenticateToken = require('../utils/auth');
const checkUser = require('../utils/checkUser');
const {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');

const router = express.Router();
//public routes:
router.get('/videos/:pid/comments', getVideoComments);
//private routes:
router.post('/videos/:pid/comments',authenticateToken, addComment);
//need to make a special check inside them
///////////////////////check User is the editor!!!!!!!!!!!!!!!!!!!///////////
router.put('/comments/:cid',authenticateToken, updateComment);
router.patch('/comments/:cid',authenticateToken, updateComment);
router.delete('/comments/:cid',authenticateToken, deleteComment);
module.exports = router;