const express = require('express');
//const auth = require('../utils/auth');
const {
    getUser,
    updateUser,
    deleteUser,
    addUser,
    getUserVideoList,
    login
} = require('../controllers/userController');

const router = express.Router();
//it will be localhost:xx/users/...
//public routes:
router.post('/users', addUser);
//authorized routes:
router.get('/users/:id',authenticateToken, getUser);
router.put('/users/:id',authenticateToken, updateUser);
router.patch('/users/:id',authenticateToken, updateUser);
router.delete('/users/:id',authenticateToken, deleteUser);
//router.get('/users/:id/videos', getUserVideoList);
router.post('/tokens', login);


module.exports = router;