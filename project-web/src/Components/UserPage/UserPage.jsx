import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';
import './UserPage.css';

function UserPage({ loggedUser, setLoggedUser, handleSignOut, isDarkMode, setIsDarkMode, videoList, setVideoList, setFilteredVideoList, filteredVideoList, usersList }) {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // //const loggedUserID = localStorage.getItem('loggedUserID');

        // if (!loggedUserID) {
        //   throw new Error('No logged user ID found in localStorage');
        // }

        const userUrl = `/api/users/${userid}`;
        const response = await fetch(userUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setUser(userData);

        const videosUrl = `/api/users/${userid}/videos`;
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
  }, [userid]);


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
        setLoggedUser={setLoggedUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      {user && (
        <div className="user-info">
          <img src={user.profilePic} alt="User" className="userpage-image" />
          <p className="username">@{user.username}</p>
          <p>{user.displayName}</p>
        </div>
      )}

      <div className="user-videos">
        {userVideos.length > 0 ? (
          userVideos.map((video) => {
            // const thumbnailUrl = video.thumbnail ? `/uploads/images/${video.thumbnail}` : "/default.png";
            return (
              <VideoPrev
                key={video._id}
                title={video.title}
                publisher={user._id}  // Use the username of the user as the publisher
                description={video.description}
                vidID={video._id}
                thumbnailUrl={"/" + video.thumbnail}
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
