const User = require('../models/user');
//this middleware checks if the user that sent the request is the user that owns the content (video,user,comment etc)
//if not
const checkUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.username !== req.user.username) {
            return res.status(403).json({ error: 'Forbidden: Username does not match the user ID' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = checkUser;