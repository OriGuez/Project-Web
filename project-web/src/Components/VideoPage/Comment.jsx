import './Comment.css';
import { useState } from 'react';

function Comment({ vidID, commentId, commentText, uploader, ProfilePicURL, isEditable, videoList, setVList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(commentText);
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleSaveEdit = () => {
        const updatedVideoList = videoList.map(video => {
            if (video.vidID === vidID) {
                return {
                    ...video,
                    comments: video.comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                text: editedComment
                            };
                        }
                        return comment;
                    })
                };
            }
            return video;
        });
        setVList(updatedVideoList);
        setIsEditing(false);
    };
    const handleInputChange = (e) => {
        setEditedComment(e.target.value);
    };
    const handleDelete = () => {
        const updatedVideoList = videoList.map(video => {
            if (video.vidID === vidID) {
                return {
                    ...video,
                    comments: video.comments.filter(comment => comment.id !== commentId)
                };
            }
            return video;
        });
        setVList(updatedVideoList);
    };
    return (
        <div className="comment">
            <img src={ProfilePicURL} alt="Profile" />
            <div className="comment-details">
                <p className="uploader">{uploader}</p>
                {isEditing ? (
                    <input
                        type="text"
                        className="comment-text-input"
                        value={editedComment}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p className="commentText">{commentText}</p>
                )}
                {isEditable === "1" && (
                    <div className="comment-actions">
                        {isEditing ? (
                            <button className="save-button" onClick={handleSaveEdit}>Save</button>
                        ) : (
                            <button className="edit-button" onClick={handleEdit}>Edit</button>
                        )}
                        <button className="delete-button" onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment;