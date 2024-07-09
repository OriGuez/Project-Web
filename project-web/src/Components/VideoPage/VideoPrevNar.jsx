import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VideoPrevNar.css'

function VideoPrevNar({ title, publisher, vidID, thumbnailUrl, upload_date }) {
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
        <div className="video-prev-nar" style={{ marginTop: '20px' }} >
            <div className="video-wrapper">
                <Link to={url} className="video-link-scroll">
                    <img src={thumbnailUrl} alt={title} className="video-thumbnail-scroll" />
                </Link>
                <div className="video-info-scroll">
                    <div class="title-container">
                        <h1 className="title" >{title}</h1>
                    </div>
                    <p className="video-publisher-scroll">{userData.displayName}</p>
                    <p className="video-upload-date-scroll">{formatDate(upload_date)}</p>
                    {/* <p className="video-views-scroll">{views} views</p>  */}
                </div>
            </div>
        </div>
    );
}

export default VideoPrevNar;