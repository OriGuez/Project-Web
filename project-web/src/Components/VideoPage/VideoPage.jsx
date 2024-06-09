import React, { useState, useEffect } from 'react';

import { useParams, Link, Navigate } from 'react-router-dom';
import CommentSection from "./CommentSection";
import ShareButton from './ShareButton';
import NavBar from '../NavBar/NavBar';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './VideoPage.css';
import VideoPrevNar from './VideoPrevNar';
import videosData from '../../data/vidDB.json';

function VideoPage({ loggedUser, handleSignOut, videoList, setVList, isDarkMode, setIsDarkMode }) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [videoNotFound, setVideoNotFound] = useState(false);
    const vidInPage = videoList.find(vid => vid.vidID === id);
    const isEditable = loggedUser ? "1" : "0";
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
            publisher: loggedUser ? loggedUser.channelName : "Anonymous",
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

    if (videoNotFound) {
        return (
            <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <NavBar
                    loggedUser={loggedUser}
                    handleSignOut={handleSignOut}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
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
                    <p className="video-description">{vidInPage.description}</p>
                </div>
                <div className="video-actions">
                    <ShareButton />
                    {loggedUser && (
                        <button onClick={toggleLikedList} className={`like-button ${hasLiked ? "liked" : ""}`}>
                            {hasLiked ? <FaThumbsDown /> : <FaThumbsUp />}
                            {hasLiked ? "Unlike" : "Like"}
                        </button>
                    )}
                </div>
            </div>
            <div className="comment-section">
                <CommentSection
                    vidId={id}
                    comments={vidInPage.comments}
                    isEditable={!!loggedUser}
                    loggedUser={loggedUser}
                    videoList={videoList}
                    setVList={setVList}
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
                <div className="video-grid-narrow">
          {videosData.map((video) => (
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
            <Link to="/">
                <p>Go back to home</p>
            </Link>
        </div>
    );
}

export default VideoPage;
