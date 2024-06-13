import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import CommentSection from "./CommentSection";
import ShareButton from './ShareButton';
import NavBar from '../NavBar/NavBar';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import './VideoPage.css';
import VideoPrevNar from './VideoPrevNar';

function VideoPage({ loggedUser, handleSignOut, videoList, setVList, isDarkMode, setIsDarkMode ,setFilteredVideoList,usersList}) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [videoNotFound, setVideoNotFound] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const vidInPage = videoList.find(vid => vid.vidID === id);

    useEffect(() => {
        if (!vidInPage) {
            setVideoNotFound(true);
        } else {
            setVideoNotFound(false);
            if (loggedUser && vidInPage.whoLikedList.includes(loggedUser.username)) {
                setHasLiked(true);
            } else {
                setHasLiked(false);
            }
            setEditedTitle(vidInPage.title);
            setEditedDescription(vidInPage.description); // Initialize with current description
        }
    }, [loggedUser, vidInPage]);

    // Redirect to home if vidInPage is undefined
    if (!vidInPage) {
        return <Navigate to="/" />;
    }

    const toggleLikedList = () => {
        if (loggedUser) {
            const updatedVideoList = videoList.map(video => {
                if (video.vidID === id) {
                    if (video.whoLikedList.includes(loggedUser.username)) {
                        return {
                            ...video,
                            whoLikedList: video.whoLikedList.filter(username => username !== loggedUser.username)
                        };
                    } else {
                        return {
                            ...video,
                            whoLikedList: [...video.whoLikedList, loggedUser.username]
                        };
                    }
                }
                return video;
            });

            setVList(updatedVideoList);
            setHasLiked(!hasLiked);
        } else {
            alert("Please log in to like videos.");
        }
    };

    const addNewComment = () => {
        if (!newCommentText.trim()) return;

        const newComment = {
            id: `c${Date.now()}`,
            publisher: loggedUser ? loggedUser.username : "Anonymous",
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
        setVList(updatedVideoList);
        setNewCommentText('');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = () => {
        const updatedVideoList = videoList.map(video => {
            if (video.vidID === id) {
                return {
                    ...video,
                    title: editedTitle,
                    description: editedDescription
                };
            }
            return video;
        });

        setVList(updatedVideoList);
        setIsEditing(false);
    };

    const handleDeleteVideo = () => {
        const updatedVideoList = videoList.filter(video => video.vidID !== id);
        setVList(updatedVideoList);
        alert("Video deleted.");
        // Navigate to home after deletion
        return <Navigate to="/" />;
    };

    if (videoNotFound) {
        return (
            <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <NavBar
                    loggedUser={loggedUser}
                    handleSignOut={handleSignOut}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    videoList={videoList}
                    setFilteredVideoList={setFilteredVideoList}
                />
                <p>Video not found.</p>
                <Link to="/">
                    <p>Go back to home</p>
                </Link>
            </div>
        );
    }

    return (
        <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar
                loggedUser={loggedUser}
                handleSignOut={handleSignOut}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                videoList={videoList}
            />
            <div className="video-container">
                <div className="videoplay">
                    <video src={vidInPage.url} controls></video>
                </div>
                <div className="video-details">
                    <h2 className="video-title">{vidInPage.title}</h2>
                    <div className="video-meta">
                        <span className="video-publisher">{vidInPage.publisher}</span>
                        <span className="video-upload-date">{vidInPage.upload_date}</span>
                    </div>
                    {isEditing ? (
                        <div className="edit-details">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="edit-title-input"
                            placeholder="Edit Title"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="edit-description-input"
                            placeholder="Edit Description"
                        />
                            <button5 onClick={handleSaveEdit} className="save-edit-button">
                                Save
                            </button5>
                        
                        </div>
                    ) : (
                        <p className="video-description">{vidInPage.description}</p>
                    )}
                </div>
                <div className="video-actions">
                    <ShareButton />
                    {loggedUser && (
                        <button onClick={toggleLikedList} className={`like-button ${hasLiked ? "liked" : ""}`}>
                            {hasLiked ? <FaThumbsDown /> : <FaThumbsUp />}
                            {hasLiked ? "Unlike" : "Like"}
                        </button>
                    )}
                    {loggedUser && loggedUser.username === vidInPage.publisher && (
                        <div className="edit-delete-actions">
                            <button onClick={handleEditToggle} className="edit-button">
                                <FaEdit /> {isEditing ? "Cancel" : "Edit"}
                            </button>
                            <button onClick={handleDeleteVideo} className="delete-button">
                                <FaTrash /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="comment-section">
                <CommentSection
                    vidId={id}
                    comments={vidInPage.comments}
                    isEditable={isEditable}
                    loggedUser={loggedUser}
                    videoList={videoList}
                    setVList={setVList}
                    usersList={usersList}
                />
                {loggedUser && (
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
                )}

                <div className="video-grid-narrow" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {videoList.map((video) => (
                        <VideoPrevNar 
                            key={video.url}
                            title={video.title} 
                            publisher={video.publisher}
                            vidID={video.vidID}
                            thumbnailUrl={video.thumbnailUrl}
                            upload_date={video.upload_date}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default VideoPage;
