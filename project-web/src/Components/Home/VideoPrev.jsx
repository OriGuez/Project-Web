import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './VideoPrev.css';

function VideoPrev({
  title,
  publisher,
  vidID,
  thumbnailUrl,
  upload_date,
  views
}) {
  const url = `/video/${vidID}`;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${publisher}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Call the function to fetch data
    fetchUserData();
  }, [publisher]); // Re-run the effect if 'publisher' changes

  // Handling different states: loading, error, and successful data fetch
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found.</div>;
  const formatDate = (isoString) => {
    // Check if isoString is undefined or null
    if (!isoString) {
      return null;
    }
    // Extract the date part (YYYY-MM-DD)
    const datePart = isoString.split('T')[0];
    return datePart;
  };
  return (
    <div className="video-prev">
      <div>
        <Link to={url}  style={{ textDecoration: 'none', color: 'inherit' }} className="video-link">
          <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
          <div className="video-info">
            <h3 className="video-title">{title}</h3>


            <Link to={`/userpage/${userData._id}`} className="link-no-style">
              <p className="video-publisher">
                <img src={userData.profilePic} alt={`profile pic`} className="user-image" />
                {userData.displayName}
              </p>

            </Link>

            <p className="video-views-upload-date">{views} views • {formatDate(upload_date)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default VideoPrev;
