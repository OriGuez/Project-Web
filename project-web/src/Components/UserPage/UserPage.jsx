import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';
import './UserPage.css';

function UserPage({ loggedUser, handleSignOut, isDarkMode, setIsDarkMode, videoList, setVideoList, setFilteredVideoList, filteredVideoList, usersList }) {
  const { username } = useParams();
  const [user, setUser] = useState(null); // State to hold user data
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  console.log('UserPage component mounted');
  console.log('Username from params:', username);

//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const response = await fetch(`/api/users/${username}`);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch user data: ${response.statusText}`);
//         }
        
//         const userData = await response.json();
//         console.log('Fetched user data:', userData);

//         // Update user state with fetched data
//         setUser(userData);

//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUserData();
//   }, [username]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

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
          <img src={user.image} alt="User" className="user-image" />
          <p>{user.username}</p>
          <p>{user.bio}</p>
        </div>
      )}

      <div className="user-videos">
        {userVideos.length > 0 ? (
          userVideos.map((video) => (
            <VideoPrev key={video._id} video={video} />
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
}

export default UserPage;
