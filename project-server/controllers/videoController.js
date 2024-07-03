const Video = require('../models/video');
const Comment = require('../models/comment');
const User = require('../models/user');
const upload = require('../utils/uploadVideo');
const path = require('path');

exports.createVideo = async (req, res) => {
    let user
    try {
        //not supposed to happen
        user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the username in req.user matches the username of the fetched user (a user can only add to his own videos)
        if (user.username !== req.user.username) {
            return res.status(403).json({ error: 'Forbidden: Username does not match the user ID' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
    //video file needs to be sent with "video" tag.and the rest of items in "body"
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        try {
            const fileName = path.basename(req.file.path);
            const relativePath = path.join('uploads', 'videos', fileName);
            // Create a new video with the uploaded file path and other details
            const video = new Video({
                ...req.body,
                userId: req.params.id,
                url: relativePath // Save the file path in the database
            });
            await video.save();
            res.status(201).json(video);
        } catch (error) {
            res.status(500).json({ error: 'Server error', details: error.message });
        }
    });
};

exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserVideos = async (req, res) => {
    try {
        const videos = await Video.find({ userId: req.params.id });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.pid);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!video) return res.status(404).json({ message: 'Video not found' });
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.pid);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        await Comment.deleteMany({ videoID: req.params.pid });
        res.status(200).json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
exports.get20videos = async (req, res) => {
    try {
        const mostViewedVideos = await Video.find().sort({ views: -1 }).limit(10);
        const mostViewedVideoIds = mostViewedVideos.map(video => video._id);
        const randomVideos = await Video.aggregate([
            { $match: { _id: { $nin: mostViewedVideoIds } } },
            { $sample: { size: 10 } }
        ]);
        const combinedVideos = mostViewedVideos.concat(randomVideos);
        const shuffledVideos = shuffleArray(combinedVideos);
        res.status(200).json(shuffledVideos);
    } catch (err) {
        console.error('Error fetching videos:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.likeVideo = async (req, res) => {
    try {
        const videoId = req.params.pid;
        const userId = req.params.id; // Assuming the user ID is passed in the request body
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (!video.likes.includes(userId)) {
            video.likes.push(userId);
            await video.save();
            return res.status(200).json({ message: 'Video liked successfully', video });
        } else {
            return res.status(400).json({ error: 'User has already liked this video' });
        }
    } catch (error) {
        console.error('Error liking video:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
exports.unlikeVideo = async (req, res) => {
    try {
        const videoId = req.params.pid;
        const userId = req.params.id;
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (video.likes.includes(userId)) {
            video.likes.pull(userId);
            await video.save();
            return res.status(200).json({ message: 'Video unliked successfully', video });
        } else {
            return res.status(400).json({ error: 'User has not liked this video in the first place' });
        }
    } catch (error) {
        console.error('Error unliking video:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};