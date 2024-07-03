const express = require('express');
const authenticateToken = require('../utils/auth');
const uploadImage = require('../utils/uploadImages');
const {
    getUser,
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
router.post('/tokens', login);

//authorized routes:
router.put('/users/:id',authenticateToken, updateUser);
router.patch('/users/:id',authenticateToken, updateUser);
router.delete('/users/:id',authenticateToken,deleteUser);

module.exports = router;