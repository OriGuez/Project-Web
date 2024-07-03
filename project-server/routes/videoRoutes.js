const express = require('express');
const authenticateToken = require('../utils/auth');
const checkUser = require('../utils/checkUser');
const {
    getUserVideos,
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo,
    get20videos,
    likeVideo,
    unlikeVideo
} = require('../controllers/videoController');

const router = express.Router();
//public routes:
router.get('/users/:id/videos', getUserVideos);
router.get('/users/:id/videos/:pid', getVideo);
router.get('/videos',get20videos);

//private routes - only for logged User:
router.post('/users/:id/videos',authenticateToken,checkUser, createVideo);
router.put('/users/:id/videos/:pid',authenticateToken,checkUser, updateVideo);
router.patch('/users/:id/videos/:pid',authenticateToken,checkUser, updateVideo);
router.delete('/users/:id/videos/:pid',authenticateToken,checkUser, deleteVideo);
router.delete('/users/:id/videos/:pid',authenticateToken, unlikeVideo);
module.exports = router;