import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';
import './UserPage.css';

function UserPage({ loggedUser,setLoggedUser, isDarkMode, setIsDarkMode}) {
  const { userid } = useParams();
  const [user, setUser] = useState(''); // State to hold user data
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/users/${userid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        // Update user state with fetched data
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();


    const fetchUserVideos = async () => {
      try {
        const response = await fetch(`/api/users/${userid}/videos/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        setUserVideos(data);  // Update the videoList state
        setLoading(false);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchUserVideos();






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
          <img src={user.profilePic} alt="User" className="user-image" />
          <p>{user.username}</p>
          <p>{user.displayName}</p>
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
