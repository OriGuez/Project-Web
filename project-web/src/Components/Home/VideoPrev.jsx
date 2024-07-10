import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './VideoPrev.css';

function VideoPrev({ title, publisher, vidID, thumbnailUrl, upload_date, views, isDarkMode }) {
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


  const formatNum = (num) => {
    //notice that the number is limited to 2 billion views
    if(!num)
      return num;
    if (num < 1000) {
      return num.toString();
    } else if (num >= 1000 && num < 10000) {
      return (num / 1000).toFixed(1) + 'k';
    } else if (num >= 10000 && num < 1000000) {
      return (num / 1000).toFixed(0) + 'k';
    } else if (num >= 1000000 && num < 10000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 10000000 && num < 1000000000) {
      return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000000000 && num < 10000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else {
      return (num / 1000000000).toFixed(0) + 'B';
    }
  };



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
    <div className={`video-prev ${isDarkMode ? 'dark-mode' : ''}`}>
      <div>
        <Link to={url} style={{ textDecoration: 'none', color: 'inherit' }} className="video-link">
          <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
          <div className="video-info">
            <h3 className="video-title">{title}</h3>
            <Link to={`/userpage/${userData._id}`} className="link-no-style">
              <p className="video-publisher">
                <img src={userData.profilePic} alt={`profile pic`} className="user-image" />
                </p>
                </Link>
                <Link to={`/userpage/${userData._id}`} className="link-no-style">
              <p className="video-publisher-channel">
                {userData.displayName}
              </p>
            </Link>
            <p className="video-views-upload-date">{formatNum(views)} views • {formatDate(upload_date)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default VideoPrev;
