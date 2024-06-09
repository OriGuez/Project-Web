import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import VideoPrev from './VideoPrev';
import videosData from '../../data/vidDB.json';

function Home({ loggedUser, handleSignOut, isDarkMode, setIsDarkMode }) {

  const [videos, setVideos] = useState([]);


  useEffect(() => {
    const storedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    setVideos(storedVideos);
  }, []);

  

  const handleRemoveVideo = (vidID) => {
    const updatedVideos = videos.filter(video => video.vidID !== vidID);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    setVideos(updatedVideos);
  };

  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <NavBar
        loggedUser={loggedUser}
        handleSignOut={handleSignOut}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="main-content">
        <section className="video-grid">
          {videosData.map((video) => (
            <VideoPrev
              key={video.url}
              title={video.title}
              publisher={video.publisher}
              vidID={video.vidID}
              thumbnailUrl={video.thumbnailUrl}
              upload_date={video.upload_date}
            />
          ))}
          {videos.map((video) => (
            <div key={video.vidID}>
              <Link to={`/video/${video.vidID}`}>
                <VideoPrev
                  title={video.title}
                  publisher={video.publisher}
                  vidID={video.vidID}
                  thumbnailUrl={video.thumbnailUrl}
                  upload_date={video.upload_date}
                />
              </Link>
              <button onClick={() => handleRemoveVideo(video.vidID)}>Remove</button>
            </div>
          ))}
        </section>
        <section className="suggested-videos"></section>
      </main>
      
    </div>
  );
}

export default Home;
