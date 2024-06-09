import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../NavBar/NavBar';
import VideoPrev from './VideoPrev';

function Home({ loggedUser, handleSignOut, isDarkMode, setIsDarkMode,videoList,setVideoList }) {

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
          {videoList.map((video) => (
            <VideoPrev
              key={video.url}
              title={video.title}
              publisher={video.publisher}
              vidID={video.vidID}
              thumbnailUrl={video.thumbnailUrl}
              upload_date={video.upload_date}
            />
          ))}
        </section>
        <section className="suggested-videos"></section>
      </main>
    </div>
  );
}

export default Home;
