import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from "./CommentSection";
import ShareButton from './ShareButton';
import NavBar from '../NavBar/NavBar';
import { FaThumbsUp, FaThumbsDown, FaCommentDots, FaTimes } from 'react-icons/fa';
import './VideoPage.css';
import VideoPrevNar from './VideoPrevNar';

function VideoPage({ loggedUser,setLoggedUser, isDarkMode, setIsDarkMode }) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState('');
    const [isCommentFocused, setIsCommentFocused] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [videoNotFound, setVideoNotFound] = useState(false);
    const [vidFromServer, setVidFromServer] = useState('');
    const [userFromServer, setUserFromServer] = useState('');
    const [commentsFromServer, setCommentsFromServer] = useState('');
    const [vidPrevList, setvidPrevList] = useState([]);

    /////////note that he does a lot of things twice so maybe to split it to loggedUser in seperate and id in seperate.
    useEffect(() => {
        const loadVideo = async () => {
            const videoData = await fetchVideoById(id);
            if (!videoData) {
                setVideoNotFound(true);
                return;
            }
            const userData = await fetchUser(videoData.userId);
            const commentData = await fetchComments(id);
            setCommentsFromServer(commentData);
            setUserFromServer(userData);
            setVidFromServer(videoData);
            setVideoNotFound(false);
        };

        const fetchVideoById = async (videoId) => {
            try {
                const response = await fetch(`/api/videos/${videoId}`);
                if (!response.ok) {
                    throw new Error('Video not found');
                }
                const videoData = await response.json();
                return videoData;
            } catch (error) {
                console.error('Error fetching video:', error);
                return null;
            }
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
        const fetchComments = async (videoId) => {
            try {
                const response = await fetch(`/api/videos/${videoId}/comments`);
                if (!response.ok) {
                    throw new Error('Video Comments Not Found');
                }
                //if i receive this status it means that the list is empty
                if(response.status === 204)
                    return [];
                const commentData = await response.json();
                return commentData;
            } catch (error) {
                console.error('Error fetching Video Comments:', error);
                return null;
            }
        };
        loadVideo();
        //reset the new comment if i passed a video
        //setNewCommentText('');
        // setShouldNavigate(false);
    }, [id]);
    //}, [id, loggedUser]);

    useEffect(() => {
        if (vidFromServer && loggedUser) {
            setHasLiked(vidFromServer.likes.includes(loggedUser._id));
        } else {
            setHasLiked(false);
        }
        setNewCommentText('');
    }, [loggedUser, vidFromServer]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPreviewVideos = async () => {
            try {
                const response = await fetch('/api/videos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                setvidPrevList(data);  // Update the videoList state
                setLoading(false);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchPreviewVideos();
    }, [id]);

    const toggleLikedList = async () => {
        if (loggedUser && vidFromServer) {

            try {
                const uid = loggedUser._id;
                //if user already liked so delete and if not so like
                const method = hasLiked ? 'DELETE' : 'POST';
                const token = localStorage.getItem('jwt');
                // Make the request to the server
                const response = await fetch(`/api/users/${uid}/videos/${id}/likes`, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}` // Include JWT token in the headers
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Toggle the like state
                setHasLiked(!hasLiked);
            } catch (error) {
                // Handle any errors
                console.error('Error updating like status:', error);
            }
        }
    };

    const addNewComment = async () => {
        if (!newCommentText.trim()) return;

        const newComment = {
            userId: loggedUser._id,
            videoId: id,
            content: newCommentText.trim()
        };
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(`/api/videos/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include JWT token in the headers
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok)
                throw new Error('Failed to post comment');

            const createdComment = await response.json();
            setCommentsFromServer(prevComments => {
                // Ensure prevComments is an array before spreading
                const pcomments = prevComments || [];
                return [...pcomments, createdComment];
            });
        } catch (error) {
            console.error(error);
        }
        setNewCommentText('');
    };

    const formatDate = (isoString) => {
        // Check if isoString is undefined or null
        if (!isoString) {
          return null;
        }
        // Extract the date part (YYYY-MM-DD)
        const datePart = isoString.split('T')[0];
        return datePart;
      };

      const numberWithCommas = (num) => {
        if(!num)
            return num;
        return num.toLocaleString();
      };
  
    if (videoNotFound) {
        return (
            <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <p>Video not found.</p>
                <Link to="/">
                    <p>Go back home</p>
                </Link>
            </div>
        );
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar
                loggedUser={loggedUser}
                setLoggedUser={setLoggedUser}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />
            <div className="video-container">
                <div className="videoplay">
                    <video src={vidFromServer.url} controls autoPlay muted></video>
                </div>
                <div className="video-details">
                    <h2 className="video-title">{vidFromServer.title}</h2>
                    <div className="video-meta">
                        <Link to={`/userpage/${userFromServer._id}`} className="link-no-style">
                            <div className="publisherDetails">
                                <img src={userFromServer.profilePic} alt="profile pic" width="40px" height="auto" />
                                <span className="video-publisher">{userFromServer.displayName}</span>
                            </div>
                        </Link>
                        <span className="video-upload-date">{formatDate(vidFromServer.createdAt)}</span>
                        <span className="video-views">{numberWithCommas(vidFromServer.views)} views</span>
                    </div>
                    <p className="video-description">{vidFromServer.description}</p>
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
                {loggedUser && (
                    <div className="add-comment-container">
                        <div className="comment-input-wrapper">
                            <img src={loggedUser.profilePic} alt="Profile" className="comment-profile-image" />
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                onFocus={() => setIsCommentFocused(true)}
                                onBlur={() => setIsCommentFocused(!!newCommentText)}
                                placeholder="Add a comment..."
                                className="comment-input"
                            />
                        </div>
                        {isCommentFocused && (
                            <div className="comment-buttons">
                                <button onClick={addNewComment} className="add-comment-button">
                                    <FaCommentDots /> Comment
                                </button>
                                <button onClick={() => setNewCommentText('')} className="cancel-comment-button">
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <CommentSection
                    comments={commentsFromServer}
                    loggedUser={loggedUser}
                    setComments={setCommentsFromServer}
                />
                <div className="video-grid-narrow">
                    {vidPrevList.map((video) => (
                        <VideoPrevNar
                            key={video.url}
                            title={video.title}
                            publisher={video.userId}
                            vidID={video._id}
                            thumbnailUrl={video.thumbnail}
                            upload_date={video.createdAt}
                            views={video.views || 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VideoPage;