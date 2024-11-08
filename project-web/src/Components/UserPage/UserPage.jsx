import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import VideoPrev from '../Home/VideoPrev';
import './UserPage.css';
import { FaEdit } from 'react-icons/fa';

function UserPage({ loggedUser, setLoggedUser, isDarkMode, setIsDarkMode }) {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProfilePic, setNewProfilePic] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userUrl = `/api/users/${userid}`;
        const response = await fetch(userUrl);
        if (!response.ok) {
          if (response.status === 404) {
            setUser(null)
            return;
          }
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        if (!userData) {
          setUser(null);
          return;
        }
        setUser(userData);
        setNewDisplayName(userData.displayName);
        const videosUrl = `/api/users/${userid}/videos`;
        const videosResponse = await fetch(videosUrl);
        if (!videosResponse.ok) {
          throw new Error(`Failed to fetch user videos: ${videosResponse.statusText}`);
        }
        const userVideosData = await videosResponse.json();
        setUserVideos(userVideosData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userid]);

  useEffect(() => {
    if (user && loggedUser && loggedUser._id === user._id) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [user, loggedUser]);

  const handleEdit = (videoId) => {
    navigate(`/video/${videoId}/edit`);
  };

  const handleEditUser = async () => {
    const token = localStorage.getItem('jwt'); // Get the JWT token from localStorage
    try {
      const vidPayload = new FormData();
      vidPayload.append('displayName', newDisplayName);
      if (newProfilePic)
        vidPayload.append('image', newProfilePic);
      const response = await fetch(`/api/users/${userid}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: vidPayload,
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      //to update the navbar:
      setLoggedUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your user?");
    if (!confirmed) return;
    const token = localStorage.getItem('jwt');
    const userID = localStorage.getItem('loggedUserID');
    const response = await fetch(`/api/users/${userID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete video: ${errorMessage}`);
    }
    else {
      localStorage.removeItem("jwt");
      localStorage.removeItem("loggedUserID");
      setLoggedUser(null);
      navigate(`/`);
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!user) {
    return (
      <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <p>User not found.</p>
        <Link to="/">
          <p>Go back home</p>
        </Link>
      </div>
    );
  }
  return (
    <div className={`user-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <NavBar
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      {user && (

        <div className="userpage-info">
          <img src={user.profilePic} alt="User" className="userpage-image" />
          <div className="user-details">
            <p className="channelName">{user.displayName}</p>
            <p>@{user.username}</p>
          
          {canEdit && !editing && (
            <>
            <div className="edit-actions">
              <button onClick={() => setEditing(true)} className="edit-user-button">
                Edit User
              </button>
              <button onClick={handleDeleteUser} className="edit-user-button">
                Delete User
              </button>
              </div>
            </>
          )}
          </div>
        </div>
      )}
      {editing && (
        <div className="edit-user-form">
          <label>
            Insert New Channel Name:
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
          </label>
          <label>
            New Profile Picture:
            <input
              type="file"
              accept=".jpeg,.jpg,.png,.gif,.svg,.webp"
              onChange={(e) => setNewProfilePic(e.target.files[0])}
            />
          </label>
          <button onClick={handleEditUser} className="edit-user-button" >Save</button>
          <button onClick={() => setEditing(false)} className="edit-user-button" >Cancel</button>
        </div>
      )}
      <main className="main-content-user-grid">
        <section className="video-grid-user">
          {userVideos.length > 0 ? (
            userVideos.map((video) => (
              <div key={video._id} className="video-item-user">
                <VideoPrev
                  title={video.title}
                  publisher={user._id}
                  description={video.description}
                  vidID={video._id}
                  thumbnailUrl={video.thumbnail}
                  upload_date={video.createdAt}
                  views={video.views}
                />
                {canEdit && (
                  <div className="edit-delete-actions-user">
                    <button onClick={() => handleEdit(video._id)} className="edit-button">
                      <FaEdit /> {"Edit/Delete"}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
          <p>No videos found!</p>
        )}
          </section>
          </main>

      </div>
    // </div>
  );
}

export default UserPage;
