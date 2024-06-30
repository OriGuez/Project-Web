const Video = require('../models/video');

const index = (req, res) => {
    res.render("../views/articles", { articles: Article.getArticles() });
}

exports.createVideo = async (req, res) => {
    try {
        const video = new Video({ ...req.body, userId: req.params.id });
        await video.save();
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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

module.exports = {
    index
};