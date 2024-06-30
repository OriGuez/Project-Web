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

router.get('/users/:id/videos', getUserVideos);
router.post('/users/:id/videos', createVideo);
router.get('/users/:id/videos/:pid', getVideo);
router.put('/users/:id/videos/:pid', updateVideo);
router.patch('/users/:id/videos/:pid', updateVideo);
router.delete('/users/:id/videos/:pid', deleteVideo);
router.get('/videos',get20videos);

module.exports = router;