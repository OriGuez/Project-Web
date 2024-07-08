import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import CommentSection from "./CommentSection";
import ShareButton from './ShareButton';
import NavBar from '../NavBar/NavBar';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaCheck, FaCommentDots, FaTimes } from 'react-icons/fa';
import './VideoPage.css';
import VideoPrevNar from './VideoPrevNar';

function VideoPage({ loggedUser, handleSignOut, videoList, isDarkMode, setIsDarkMode, setFilteredVideoList }) {
    const { id } = useParams();
    const [newCommentText, setNewCommentText] = useState('');
    const [isCommentFocused, setIsCommentFocused] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [videoNotFound, setVideoNotFound] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [vidFromServer, setVidFromServer] = useState('');
    const [userFromServer, setUserFromServer] = useState('');
    const [commentsFromServer, setCommentsFromServer] = useState('');
    const [vidPrevList, setvidPrevList] = useState([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();


    //const loggedUser=1;
    //const isEditable = loggedUser ? "1" : "0";
    const isEditable = "0"

    useEffect(() => {
        const loadVideo = async () => {
            const videoData = await fetchVideoById(id);
            if (!videoData) {
                setVideoNotFound(true);
                return null;
            }
            const userData = await fetchUser(videoData.userId);
            const commentData = await fetchComments(id);
            setCommentsFromServer(commentData);
            setUserFromServer(userData);
            if (videoData) {
                setVidFromServer(videoData);
                setEditedTitle(videoData.title);
                setEditedDescription(videoData.description);
                setVideoNotFound(false);
                if (loggedUser && videoData.likes.includes(loggedUser.userId)) {
                    setHasLiked(true);
                } else {
                    setHasLiked(false);
                }
            } else {
                setVideoNotFound(true);
            }
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
                const userData = await response.json();
                return userData;
            } catch (error) {
                console.error('Error fetching Video Comments:', error);
                return null;
            }
        };
        loadVideo();

        //reset the new comment if i passed a video
        setNewCommentText('');
        //reset isEditing if i passed a video
        setIsEditing(false);
        //reset edited title and description
        setEditedTitle('');
        setEditedDescription('');
        setShouldNavigate(false);
    }, [id]);
    //}, [id, loggedUser]);

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







    // useEffect(() => {
    //     if (!vidInPage) {
    //         setVideoNotFound(true);
    //     } else {
    //         setVideoNotFound(false);
    //         if (loggedUser && vidInPage.whoLikedList.includes(loggedUser.username)) {
    //             setHasLiked(true);
    //         } else {
    //             setHasLiked(false);
    //         }
    //         setEditedTitle(vidInPage.title);
    //         setEditedDescription(vidInPage.description);
    //     }
    // }, [loggedUser, vidInPage]);

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
                //const newHasLiked = !hasLiked;
                setHasLiked(!hasLiked);
            } catch (error) {
                // Handle any errors
                console.error('Error updating like status:', error);
                // Optionally, revert the like state if the request fails
                //setHasLiked(!hasLiked);
            }




            //setHasLiked(!hasLiked);
        }




        // if (loggedUser) {
        //     const updatedVideoList = videoList.map(video => {
        //         if (video.vidID === id) {
        //             if (video.whoLikedList.includes(loggedUser.username)) {
        //                 return {
        //                     ...video,
        //                     whoLikedList: video.whoLikedList.filter(username => username !== loggedUser.username)
        //                 };
        //             } else {
        //                 return {
        //                     ...video,
        //                     whoLikedList: [...video.whoLikedList, loggedUser.username]
        //                 };
        //             }
        //         }
        //         return video;
        //     });

        //     setVList(updatedVideoList);
        //     setHasLiked(!hasLiked);
        // } else {
        //     alert("Please log in to like videos.");
        // }





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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = async () => {

        const token = localStorage.getItem('jwt');
        const response = await fetch(`/api/users/${vidFromServer.userId}/videos/${vidFromServer._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: editedTitle,
                description: editedDescription
            })
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update comment: ${errorMessage}`);
        }
        else {
            setIsEditing(false);
            updateVidFromServer(editedTitle, editedDescription);
        }



        const updateVidFromServer = (newTitle, newDescription) => {
            setVidFromServer(prevState => ({
                ...prevState,
                title: newTitle,
                description: newDescription
            }));
        };

    };

    const handleDeleteVideo = async () => {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`/api/users/${vidFromServer.userId}/videos/${vidFromServer._id}`, {
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
            setShouldNavigate(true);
            //return <Navigate to="/" />;
        }
        // alert("Video deleted.");
    };

    if (shouldNavigate) {
        navigate('/');
    }

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

    return (
        <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <NavBar
                loggedUser={loggedUser}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                videoList={videoList}
                setFilteredVideoList={setFilteredVideoList}
            />
            <div className="video-container">
                <div className="videoplay">
                    <video src={"/" + vidFromServer.url} controls></video>
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
                        <span className="video-upload-date">{vidFromServer.createdAt}</span>
                        <span className="video-views">{vidFromServer.views || 1} views</span>
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
                            <button onClick={handleSaveEdit} className="save-edit-button">
                                <FaCheck /> Save
                            </button>
                        </div>
                    ) : (
                        <p className="video-description">{vidFromServer.description}</p>
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
                    {loggedUser && loggedUser._id === userFromServer._id && (
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
                    setComments={setCommentsFromServer}
                    isEditable={isEditable}
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