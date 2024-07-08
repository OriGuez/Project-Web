const express = require('express');
const authenticateToken = require('../utils/auth');
const checkUser = require('../utils/checkUser');
const uploadImage = require('../utils/uploadImages');
const {
    getUserVideos,
    getUserVideosByUsername,
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo,
    get20videos,
    likeVideo,
    unlikeVideo,
    searchVideos
} = require('../controllers/videoController');

const router = express.Router();
//public routes:
router.get('/users/:id/videos', getUserVideos);
router.get('/:username/videos', getUserVideosByUsername);
router.get('/users/:id/videos/:pid', getVideo);
router.get('/videos/:pid', getVideo);
router.get('/videos', get20videos);
router.get('/searchvideo', searchVideos);

//private routes - only for logged User:
router.post('/users/:id/videos', authenticateToken, checkUser, createVideo);
router.put('/users/:id/videos/:pid', authenticateToken, checkUser,uploadImage, updateVideo);
router.patch('/users/:id/videos/:pid', authenticateToken, checkUser,uploadImage, updateVideo);
router.delete('/users/:id/videos/:pid', authenticateToken, checkUser, deleteVideo);
//likes
router.post('/users/:id/videos/:pid/likes', authenticateToken, checkUser, likeVideo);
router.delete('/users/:id/videos/:pid/likes', authenticateToken, checkUser, unlikeVideo);

module.exports = router;