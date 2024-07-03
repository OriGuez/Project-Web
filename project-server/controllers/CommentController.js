const mongoose = require('mongoose');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require("jsonwebtoken")
exports.addComment = async (req, res) => {
    try {
        //I have in req.user the username of the uploader.
        //I need to find the ID of the user.
        const username = req.user.username
        const user = await User.findOne({ username: username }).select('_id').exec();
        let userId
        if (!user) {
            return res.status(400).json({ error: 'Error in Finding User' });
        }
        userId = user._id;
        const { content } = req.body;
        // const userId = req.params.id;
        const videoId = req.params.pid;

        // Check if userId and videoId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: 'Invalid userId or videoId' });
        }

        const newComment = new Comment({
            content,
            userId,
            videoId
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        //I have in req.user the username of the uploader.
        //I need to find the ID of the user.
        const username = req.user.username
        const user = await User.findOne({ username: username }).select('_id').exec();
        let userId
        if (!user) {
            return res.status(400).json({ error: 'Error in Finding User' });
        }
        userId = user._id;
        const commentId = req.params.cid;
        const { content } = req.body;

        // Check if commentId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Invalid commentId' });
        }
        const comment = await Comment.findById(commentId).exec();
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You do not have permission to update this comment' });
        }
        //applying new content to comment.
        comment.content = content;
        const updatedComment = await comment.save();

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        //I have in req.user the username of the uploader.
        //I need to find the ID of the user.
        const username = req.user.username
        const user = await User.findOne({ username: username }).select('_id').exec();
        let userId
        if (!user) {
            return res.status(400).json({ error: 'Error in Finding User' });
        }
        userId = user._id;


        const commentId = req.params.cid;
        // Check if commentId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Invalid commentId' });
        }

        const comment = await Comment.findById(commentId).exec();
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.userID.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You do not have permission to delete this comment' });
        }
        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.getVideoComments = async (req, res) => {
    try {
        const videoId = req.params.pid;
        // Check if videoId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: 'Invalid videoId' });
        }
        const comments = await Comment.find({ videoId });
        if (comments.length === 0) {
            return res.status(204).json(comments);
        }
        else
            res.status(200).json(comments);
    } catch (error) {
        console.error('Error getting video comments:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};