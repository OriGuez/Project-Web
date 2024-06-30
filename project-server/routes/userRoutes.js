const express = require('express');
const {
    getUser,
    updateUser,
    deleteUser
} = require('../../controllers/user/userController');

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;