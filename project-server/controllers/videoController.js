const Video = require('../models/video');
const Comment = require('../models/comment');
const User = require('../models/user');
const upload = require('../utils/uploadVideo');
const path = require('path');

exports.createVideo = async (req, res) => {
    //video file needs to be sent with "video" tag.and the rest of items in "body"
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err });
        }

        if (!req.files || !req.files.video || !req.files.image) {
            return res.status(400).json({ error: 'Both video and thumbnail files are required' });
        }

        try {
            const videoFile = req.files.video[0];
            const imageFile = req.files.image[0];

            const videoFileName = path.basename(videoFile.path);
            const imageFileName = path.basename(imageFile.path);

            const videoRelativePath = path.join('uploads', 'videos', videoFileName);
            const imageRelativePath = path.join('uploads', 'images', imageFileName);
            // Create a new video with the uploaded file path and other details
            const video = new Video({
                ...req.body,
                userId: req.params.id,
                views: 0,
                thumbnail: imageRelativePath,
                url: videoRelativePath // Save the file path in the database
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
exports.getUserVideosByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json({ error: 'user Not Found' })
        const videos = await Video.find({ userId: user._id });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getVideo = async (req, res) => {
    //make here a check if the id of user that was attached is valid to this video or not
    try {
        const video = await Video.findById(req.params.pid);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        // Increment the views count
        video.views = (video.views || 0) + 1;
        // Save the updated video
        await video.save();
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Set the profilePic URL if an image was uploaded
        if (req.file) {
            updateData.thumbnail = `/uploads/images/${req.file.filename}`;
        }
        const video = await Video.findByIdAndUpdate(req.params.pid, updateData, { new: true });
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
        //delete all comments of the video
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


exports.searchVideos = async (req, res) => {
    try {
        let { query } = req.query; // Extract query from req.query
        if (query) {
            query = decodeURIComponent(query); // Decode the query string
        }
        const criteria = {
            $or: []
        };

        if (query) {
            criteria.$or.push({ title: { $regex: query, $options: 'i' } });
            criteria.$or.push({ description: { $regex: query, $options: 'i' } });
        }

        const videos = await Video.find(criteria);
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Server error in search', details: error.message });
    }
};