const express = require('express');
const { index } = require('../controllers/videoController');
const router = express.Router();

router.get('/', index);

module.exports = router;