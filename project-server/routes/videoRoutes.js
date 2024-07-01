const express = require('express');
const {
    getUserVideos,
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo,
    get20videos
} = require('../controllers/videoController');

const router = express.Router();
//public routes:
router.get('/users/:id/videos', getUserVideos);
router.get('/users/:id/videos/:pid', getVideo);
router.get('/videos',get20videos);

//private routes:
router.post('/users/:id/videos', createVideo);
router.put('/users/:id/videos/:pid', updateVideo);
router.patch('/users/:id/videos/:pid', updateVideo);
router.delete('/users/:id/videos/:pid', deleteVideo);

module.exports = router;