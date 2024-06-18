import './Comment.css';
import { useState,useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';



function Comment({ vidID, commentId, commentText, uploader, isDarkMode, isEditable, videoList, setVList,usersList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(commentText);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [picURL, setPicURL] = useState(null);
    useEffect(() => {
        const user = usersList.find(user => user.username === uploader);
        if (user) {
          setPicURL(user.image);
        } else {
          setPicURL('/default.png'); // Set default picture URL if user not found
        }
      }, [usersList, uploader]);
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
                            return { ...comment, text: editedComment };
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

    const handleLike = () => {
        setLikeCount(likeCount + 1);
    };

    const handleDislike = () => {
        setDislikeCount(dislikeCount + 1);
    };

    return (
        <div className={`comment ${isDarkMode ? 'dark-mode' : ''}`}>
            <img src={picURL} alt="Profile" />
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
                <div className="comment-actions">
                    {isEditable === "1" && (
                        <>
                            {isEditing ? (
                                <button className="save-button" onClick={handleSaveEdit}><FaCheck /> Save</button>
                            ) : (
                                <button className="edit-button" onClick={handleEdit}><FaEdit /> Edit</button>
                            )}
                            <button className="delete-button" onClick={handleDelete}><FaTrash /> Delete</button>
                        </>
                    )}
                    <div className="likes-dislikes">
                        <button className="like-button" onClick={handleLike}>
                            <FaThumbsUp /> {likeCount}
                        </button>
                        <button className="dislike-button" onClick={handleDislike}>
                            <FaThumbsDown /> {dislikeCount}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
