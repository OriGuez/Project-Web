const express = require('express');
const {
    getUserVideos,
    createVideo,
    getVideo,
    updateVideo,
    deleteVideo
} = require('../../controllers/video/videoController');

const router = express.Router();

router.get('/:id/videos', getUserVideos);
router.post('/:id/videos', createVideo);
router.get('/:id/videos/:pid', getVideo);
router.put('/:id/videos/:pid', updateVideo);
router.patch('/:id/videos/:pid', updateVideo);
router.delete('/:id/videos/:pid', deleteVideo);

module.exports = router;