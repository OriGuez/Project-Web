const express = require('express');
const authenticateToken = require('../utils/auth');
const checkUser = require('../utils/checkUser');
const uploadImage = require('../utils/uploadImages');
const {
    getUser,
    getUserID,
    updateUser,
    deleteUser,
    addUser,
    login
} = require('../controllers/userController');

const router = express.Router();
//it will be localhost:xx/users/...
//public routes:
router.post('/users', uploadImage, addUser);
router.get('/users/:id', getUser);
router.get('/users/getID/:username', getUserID);

router.post('/tokens', login);
// router.get('/tokens', login);
//authorized routes:
router.put('/users/:id', authenticateToken, checkUser, uploadImage, updateUser);
router.patch('/users/:id', authenticateToken, checkUser, uploadImage, updateUser);
router.delete('/users/:id', authenticateToken, checkUser, deleteUser);

module.exports = router;