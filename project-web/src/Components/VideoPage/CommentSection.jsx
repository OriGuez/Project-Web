import React from 'react';
import Comment from './Comment';
import './CommentSection.css';

function CommentSection({ vidId, comments, isEditable, videoList, setVList }) {
    return (
        <div className="comment-section">
            <h2>Comments</h2>
            {comments.map(comment => (
                <Comment
                    key={comment.id}
                    vidID={vidId}
                    commentId={comment.id}
                    commentText={comment.text}
                    uploader={comment.publisher}
                    isEditable={isEditable}
                    videoList={videoList}
                    setVList={setVList}
                />
            ))}
        </div>
    );
}

export default CommentSection;
