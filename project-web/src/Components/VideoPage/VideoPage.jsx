import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from "./CommentSection";
import VideoPlayer from "./VideoPlayer";
import ShareButton from './ShareButton';
import './VideoPage.css';

function VideoPage({ loggedUser, videoList, setVList }) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState("");
    const vidInPage = videoList.find(vid => vid.vidID === id);
    const isEditable = loggedUser ? "1" : "0";
    if (!vidInPage) {
        console.log("failed")
        return null;
    }
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
            </div>
            <div className="comment-section">
                <CommentSection vidId={id} comments={vidInPage.comments} isEditable={isEditable} videoList={videoList} setVList={setVList} />
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