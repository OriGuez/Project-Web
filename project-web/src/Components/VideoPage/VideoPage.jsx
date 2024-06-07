import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from "./CommentSection";
import VideoPlayer from "./VideoPlayer";
import ShareButton from './ShareButton';
import './VideoPage.css';

function VideoPage({ loggedUser, videoList, setVList }) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState("");
    const [hasLiked, setHasLiked] = useState(false);
    const vidInPage = videoList.find(vid => vid.vidID === id);
    const isEditable = loggedUser ? "1" : "0";
    // Check if the logged user has already liked the video
    useEffect(() => {
        if (loggedUser && vidInPage.whoLikedList.includes(loggedUser.username)) {
            setHasLiked(true);
        } else {
            setHasLiked(false);
        }
    }, [loggedUser, vidInPage]);
    if (!vidInPage) {
        console.log("failed")
        return null;
    }

    const toggleLikedList = () => {
        // Check if user is logged in
        if (loggedUser) {
            // Find the video in the videoList
            const updatedVideoList = videoList.map(video => {
                if (video.vidID === id) {
                    // Check if the user already liked the video
                    if (video.whoLikedList.includes(loggedUser.username)) {
                        // If yes, remove user from whoLikedList
                        return {
                            ...video,
                            whoLikedList: video.whoLikedList.filter(username => username !== loggedUser.username)
                        };
                    } else {
                        // If not, add user to whoLikedList
                        return {
                            ...video,
                            whoLikedList: [...video.whoLikedList, loggedUser.username]
                        };
                    }
                }
                return video;
            });

            // Update the state with the updated videoList
            setVList(updatedVideoList);
            setHasLiked(!hasLiked); // Toggle the hasLiked state
        } else {
            console.log("User is not logged in.");
        }
    };

    const addNewComment = () => {
        if (!newCommentText.trim()) {
            return; // Do nothing if the comment text is empty or only whitespace
        }
        const newComment = {
            id: `c${Date.now()}`, // Generate a unique ID for the comment (not guaranteed to be unique in all cases, but works for this example)
            publisher: loggedUser.channelName,
            text: newCommentText.trim()
        };
        const updatedVideoList = videoList.map(video => {
            if (video.vidID === id) {
                return {
                    ...video,
                    comments: [...video.comments, newComment]
                };
            }
            return video;
        });
        console.log("")
        setVList(updatedVideoList);
        setNewCommentText(""); // Clear the comment input field
    }
    return (
        <div className="video-page-container">
            <div className="video-container">
                <VideoPlayer videoURL={vidInPage.url} />
                <div className="video-details">
                    <h2 className="video-title">{vidInPage.title}</h2>
                    <p className="video-publisher">{vidInPage.publisher}</p>
                    <p className="video-upload-date">{vidInPage.upload_date}</p>
                    <p className="video-description">{vidInPage.description}</p>
                </div>
            </div>
            <div>
                <ShareButton />
                {loggedUser && (
                    <button onClick={toggleLikedList} className={hasLiked ? "liked-button" : ""}>
                        {hasLiked ? "Unlike" : "Like"}
                    </button>
                )}
            </div>
            <div className="comment-section">
                <CommentSection vidId={id} comments={vidInPage.comments} isEditable={isEditable} loggedUser={loggedUser} videoList={videoList} setVList={setVList} />
                {loggedUser ? (
                    <>
                        <div className="add-comment-container">
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="comment-input"
                            />
                            <button onClick={addNewComment} className="add-comment-button">
                                Add Comment
                            </button>
                        </div>
                    </>
                ) : (<></>)}
            </div>
            <Link to="/">
                <p>hereeee</p>
            </Link>
        </div>
    )
}

export default VideoPage;