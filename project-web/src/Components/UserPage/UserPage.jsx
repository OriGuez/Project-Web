import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';
import './UserPage.css';

function UserPage({ loggedUser, handleSignOut, isDarkMode, setIsDarkMode, videoList, setVideoList, setFilteredVideoList, filteredVideoList, usersList }) {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const loggedUserID = localStorage.getItem('loggedUserID');
        
        if (!loggedUserID) {
          throw new Error('No logged user ID found in localStorage');
        }

        const userUrl = `/api/users/${loggedUserID}`;
        const response = await fetch(userUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setUser(userData);

        const videosUrl = `/api/users/${loggedUserID}/videos`;
        const videosResponse = await fetch(videosUrl);
        if (!videosResponse.ok) {
          throw new Error(`Failed to fetch user videos: ${videosResponse.statusText}`);
        }

        const userVideosData = await videosResponse.json();
        setUserVideos(userVideosData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-page">
      <NavBar
        loggedUser={loggedUser}
        handleSignOut={handleSignOut}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        videoList={videoList}
        setFilteredVideoList={setFilteredVideoList}
        usersList={usersList}
      />
      {user && (
        <div className="user-info">
          <img src={user.profilePic} alt="User" className="user-image" />
          <p className="username">@{user.username}</p>
          <p className="channelName">{user.channelName || 'Channel Name Not Set'}</p>
          <p className="bio">{user.bio}</p>
        </div>
      )}

      <div className="user-videos">
        {userVideos.length > 0 ? (
          userVideos.map((video) => {
            const thumbnailUrl = video.thumbnail ? `/uploads/images/${video.thumbnail}` : "/default.png";
            return (
              <VideoPrev
                key={video._id}
                title={video.title}
                publisher={user.username}  // Use the username of the user as the publisher
                description={video.description}
                vidID={video._id}
                thumbnailUrl={thumbnailUrl}
                upload_date={video.createdAt}
                videoList={videoList}
                setVideoList={setVideoList}
                loggedUser={loggedUser}
                users={usersList}
              />
            );
          })
        ) : (
          <p>No videos found!</p>
        )}
      </div>
    </div>
  );
}

export default UserPage;
