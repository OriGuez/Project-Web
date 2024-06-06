import Comment from "./Comment";
function CommentSection({comments}) {
    return (
        <div className="comment-section">
            <h2>Comments</h2>
            {comments.map(comment => (
                <Comment
                    key={comment.id}
                    uploader={comment.publisher}
                    commentText={comment.text}
                />
            ))}
        </div>
    )
}

export default CommentSection;