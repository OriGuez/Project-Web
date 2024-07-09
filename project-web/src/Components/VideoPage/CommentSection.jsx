import React from 'react';
import Comment from './Comment';
import './CommentSection.css';
import { useState, useEffect } from 'react';


function CommentSection({ loggedUser,comments,setComments }) {
    const [commentsList, setCommentsList] = useState(comments || []);
    useEffect(() => {
        if (Array.isArray(comments)) {
            setCommentsList(comments);
        } else {
            console.error('Expected comments to be an array, but got:', comments);
        }
    }, [comments]);
    const handleDeleteComment = (commentId) => {
        setCommentsList(commentsList.filter(comment => comment._id !== commentId));
        setComments(commentsList.filter(comment => comment._id !== commentId));
    };
    return (
        <div className="comment-section">
            <h2>Comments</h2>
            {commentsList.map(comment => (
                <Comment
                    key={comment._id}
                    loggedUser={loggedUser}
                    commentId={comment._id}
                    commentText={comment.content}
                    uploader={comment.userId}
                    isDarkMode={0}
                    onDelete={handleDeleteComment}
                />
            ))}
        </div>
    );
}

export default CommentSection;