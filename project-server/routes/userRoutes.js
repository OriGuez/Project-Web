const express = require('express');
const {
    getUser,
    updateUser,
    deleteUser,
    addUser,
    getUserVideoList
} = require('../controllers/userController');

const router = express.Router();
//it will be localhost:xx/users/...
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
//router.get('/:id/videos', getUserVideoList);
router.post('/', addUser);


module.exports = router;