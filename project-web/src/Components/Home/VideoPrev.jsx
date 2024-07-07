import { Link } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import './VideoPrev.css';

function VideoPrev({
  title,
  publisher,
  vidID,
  thumbnailUrl,
  upload_date,
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

  // const getPublisherPicture = (username) => {
  //   // const user = users.find(user => user.username === username);
  //   // if (user) {
  //   //   return user.image;
  //   // }
  //   // return publisherImages[username] || '/default.png'; // Use default image if not found
  //   return '/default.png'; // Use default image if not found

  // };

  // // const publisherImages = {
  // //   "NatGeo": "/natgeo.png",
  // //   "CookingChannel": "/cookingchannel.png",
  // //   "EnergyTalk": "/energytalk.png",
  // //   "HistoryChannel": "/historychannel.png",
  // //   "NASAHub": "/nasahub.png",
  // //   "PsychologyInsights": "/psychologyinsights.png",
  // //   "PhotoGuru": "/photoguru.png",
  // //   "CommunicationSkills": "/communication.png",
  // //   "Euroleague": "/euroleague.png",
  // //   "UEFA": "/uefa.png"
  // // };
  // const publisherPicture = getPublisherPicture(publisher);

  return (
    <div className="video-prev">
      <div>
        <Link to={url} className="video-link">
          <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
          <div className="video-info">
            <h3 className="video-title">{title}</h3>
            <p className="video-publisher">
              <img src={userData.profilePic} alt={`profile pic`} className="user-image" />
              {userData.displayName}
            </p>
            <p className="video-upload-date">{upload_date}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default VideoPrev;
