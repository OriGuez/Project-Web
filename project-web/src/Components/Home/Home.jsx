import React, { useState, useEffect } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import VideoPrev from './VideoPrev';

function Home({ loggedUser, setLoggedUser, isDarkMode, setIsDarkMode, videoList, setVideoList }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
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
        setVideoList(data);  // Update the videoList state
        setLoading(false);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <NavBar
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        <section className="video-grid">
          {videoList && videoList.length > 0 ? (
            videoList.map((video) => (
              <VideoPrev
                key={video.url}
                title={video.title}
                publisher={video.userId}
                vidID={video._id}
                thumbnailUrl={video.thumbnail}
                upload_date={video.createdAt}
                views={video.views}
              />
            ))
          ) : (
            <p>No videos found</p>
          )}
        </section>
        <section className="suggested-videos"></section>
      </main>
    </div>
  );
}

export default Home;
