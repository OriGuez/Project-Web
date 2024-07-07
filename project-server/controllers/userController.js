const User = require('../models/user');
const Comment = require('../models/comment');
const Video = require('../models/video');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    try {
        const { username, password, displayName } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);


        // Set the profilePic URL if an image was uploaded
        let profilePic = '';
        if (req.file) {
            profilePic = `/uploads/images/${req.file.filename}`;
        }
        else {
            res.status(403).json({ error: 'No Profile Picture' });
        }

        // Create and save the new user
        const user = new User({ username, password: hashedPassword, displayName, profilePic });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        //public data only ,without password
        res.status(200).json({
            username: user.username,
            displayName: user.displayName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserID = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ userID: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await Comment.deleteMany({ userId: req.params.id });
        await Video.deleteMany({ userId: req.params.id });
        res.status(200).json({ message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { username: user.username };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};