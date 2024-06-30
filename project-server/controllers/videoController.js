const Video = require('../models/video');

exports.createVideo = async (req, res) => {
    try {
        const video = new Video({ ...req.body, userId: req.params.id });
        await video.save();
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
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
        res.status(200).json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.get20videos = async (req, res) => {
    try {
        const videos = await Video.find().limit(20).sort({ createdAt: -1 });
        res.status(200).json(videos);
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