const Comment = require('../models/comment');
exports.addComment = async (req, res) => {
    //add here a check that id and pid exists. is it here????????
    try {
        const { content } = req.body;
        const userId = req.params.id;
        const videoId = req.params.pid;

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
exports.getComment = async (req, res) => {

};
exports.updateUser = async (req, res) => {

};
exports.deleteComment = async (req, res) => {

};