import './Comment.css';
import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';



function Comment({ commentId, commentText, uploader, isDarkMode, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [editedComment, setEditedComment] = useState(commentText);
    const [currentCommentText, setCurrentCommentText] = useState(commentText);
    // const [likeCount, setLikeCount] = useState(0);
    // const [dislikeCount, setDislikeCount] = useState(0);
    const [picURL, setPicURL] = useState('');
    const [writer, setWriter] = useState('');

    useEffect(() => {
        const loggedUserID = localStorage.getItem('loggedUserID');
        if (loggedUserID === uploader)
            setIsEditable(true);
        else
            setIsEditable(false);
        const loadUserData = async () => {
            const userData = await fetchUser(uploader);
            setWriter(userData);
        };
        const fetchUser = async (uid) => {
            try {
                const response = await fetch(`/api/users/${uid}`);
                if (!response.ok) {
                    throw new Error('User Not Found');
                }
                const userData = await response.json();
                return userData;
            } catch (error) {
                console.error('Error fetching User:', error);
                return null;
            }
        };
        loadUserData();
    }, []);


    useEffect(() => {
        if (writer) {
            setPicURL(writer.profilePic);
        } else {
            setPicURL('/default.png'); // Set default picture URL if user not found
        }
    });


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {

        async function editComment(commentId, updatedContent) {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: updatedContent })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update comment: ${errorMessage}`);
            }
            else {
                setCurrentCommentText(editedComment);
            }
        }
        editComment(commentId, editedComment);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setEditedComment(e.target.value);
    };

    const handleDelete = async () => {
        async function deleteComment(commentId) {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update comment: ${errorMessage}`);
            }
            else {
                onDelete(commentId);
            }
        }
        deleteComment(commentId);
    };

    // const handleLike = () => {
    //     setLikeCount(likeCount + 1);
    // };

    // const handleDislike = () => {
    //     setDislikeCount(dislikeCount + 1);
    // };

    return (
        <div className={`comment ${isDarkMode ? 'dark-mode' : ''}`}>
            <img src={picURL} alt="Profile" />
            <div className="comment-details">
                <p className="uploader">{writer.displayName}</p>
                {isEditing ? (
                    <input
                        type="text"
                        className="comment-text-input"
                        value={editedComment}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p className="commentText">{currentCommentText}</p>
                )}
                <div className="comment-actions">
                    {isEditable && (
                        <>
                            {isEditing ? (
                                <button className="save-button" onClick={handleSaveEdit}><FaCheck /> Save</button>
                            ) : (
                                <button className="edit-button" onClick={handleEdit}><FaEdit /> Edit</button>
                            )}
                            <button className="delete-button" onClick={handleDelete}><FaTrash /> Delete</button>
                        </>
                    )}
                    {/* <div className="likes-dislikes">
                        <button className="like-button" onClick={handleLike}>
                            <FaThumbsUp /> {likeCount}
                        </button>
                        <button className="dislike-button" onClick={handleDislike}>
                            <FaThumbsDown /> {dislikeCount}
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Comment;