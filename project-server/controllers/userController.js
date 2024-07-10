const User = require('../models/user');
const Comment = require('../models/comment');
const Video = require('../models/video');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    try {
        const { username, password, displayName } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        // Hash the password before saving
        //const hashedPassword = await bcrypt.hash(password, 10);

        // Set the profilePic URL if an image was uploaded
        let profilePic = '';
        if (req.file) {
            profilePic = `/uploads/images/${req.file.filename}`;
        }
        else {
            res.status(403).json({ error: 'No Profile Picture' });
        }

        // Create and save the new user
        const user = new User({ username, password, displayName, profilePic });
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
            _id: user._id,
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
        const updateData = { ...req.body };
        // Set the profilePic URL if an image was uploaded
        if (req.file) {
            updateData.profilePic = `/uploads/images/${req.file.filename}`;
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = async (req, res) => {
    //deletes user and all of his data including comments,videos and comments on his videos.
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        //delete user comments
        await Comment.deleteMany({ userId: req.params.id });
        // Find all videos by the user
        const userVideos = await Video.find({ userId: req.params.id });
        // Delete comments on the user's videos
        const videoIds = userVideos.map(video => video._id);
        await Comment.deleteMany({ videoId: { $in: videoIds } });
        //delete user videos
        await Video.deleteMany({ userId: req.params.id });
        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { username: user.username };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};