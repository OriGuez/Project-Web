import './Comment.css';

function Comment({ commentText, uploader, ProfilePicURL }) {
    return (
        <div className="comment">
            <img src={ProfilePicURL} alt="Profile" />
            <div className="comment-details">
                <p className="uploader">{uploader}</p>
                <p className="commentText">{commentText}</p>
            </div>
        </div>
    )
}

export default Comment;