const express = require('express');
const authenticateToken = require('../utils/auth');

const {
    getUserVideos,
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo,
    get20videos,
    likeVideo
} = require('../controllers/videoController');

const router = express.Router();
//public routes:
router.get('/users/:id/videos', getUserVideos);
router.get('/users/:id/videos/:pid', getVideo);
router.get('/videos',get20videos);

//private routes - only for logged User:
router.post('/users/:id/videos',authenticateToken, createVideo);
router.put('/users/:id/videos/:pid',authenticateToken, updateVideo);
router.patch('/users/:id/videos/:pid',authenticateToken, updateVideo);
router.delete('/users/:id/videos/:pid',authenticateToken, deleteVideo);
router.delete('/users/:id/videos/:pid',authenticateToken, likeVideo);
module.exports = router;