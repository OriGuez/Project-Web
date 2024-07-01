const mongoose = require('mongoose');
const Comment = require('../models/comment');
const jwt = require("jsonwebtoken")
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.params.id;
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
        const userId = req.params.id;
        const commentId = req.params.commentId;
        const { content } = req.body;

        // Check if userId and commentId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Invalid userId or commentId' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const userId = req.params.id;
        const commentId = req.params.commentId;

        // Check if userId and commentId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Invalid userId or commentId' });
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.getVideoComments = async (req, res) => {
    try {
        const userId = req.params.id;
        const videoId = req.params.pid;

        // Check if userId and videoId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ error: 'Invalid userId or videoId' });
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