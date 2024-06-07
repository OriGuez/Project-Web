import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from '../SideBar/Dropdown';
import videosData from '../../data/vidDB.json';
import VideoPrev from './VideoPrev';

function Home({ loggedUser, handleSignOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    const root = document.documentElement;
    if (!isDarkMode) {
      root.style.setProperty('--background-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#fff');
    } else {
      root.style.removeProperty('--background-color');
      root.style.removeProperty('--text-color');
    }
    const homeContainer = document.querySelector('.home-container');
    homeContainer.classList.toggle('dark-mode');
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleImageClick = () => {
    setShowSignOutDialog(!showSignOutDialog);
  };

  const handleSignOutConfirm = () => {
    setShowSignOutDialog(false);
    handleSignOut();
  };

  return (
//     <div className="home-container">
//       <Link to="/video/5">
//       <p>hereeee</p>
//       </Link>
//       <header className="navbar navbar-expand-lg navbar-light bg-light">
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
          </Link>
          <span2 className={isDarkMode ? 'text-white' : 'text-black'}>ViewTube</span2>
          <button
            className={`btn ${isDarkMode ? 'btn-dark' : 'btn-light'} d-flex align-items-center dropdownToggle`}
            onClick={handleDropdownClick}
          >
            <i className="bi bi-list" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Explore
          </button>
          <form className="d-flex w-100 me-3" role="search">
            <input
              type="search"
              className={`form-control ${isDarkMode ? 'bg-dark text-white' : ''}`}
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <div className={`user-info ${isDarkMode ? 'dark-mode' : ''}`}>
            {loggedUser ? (
              <div className="signOut">
                <span1>{loggedUser.username}</span1>
                <div style={{ position: 'relative' }}>
                  <img src={loggedUser.image} alt="Profile" className="user-image" onClick={handleImageClick} />
                  {showSignOutDialog && (
                    <div className="signOutDialog">
                      <button className="btn btn-secondary" onClick={handleSignOutConfirm}>Sign Out</button>
                    </div>
                  )}
                </div>
                <span1>{loggedUser.channelName}</span1>
              </div>
            ) : (
              <div className="signIn">
                <Link to="/login" style={{ color: isDarkMode ? 'white' : 'black', textDecoration: 'none' }}>
                  <div className="signInContent">
                    <img src="/default.png" alt="Sign in" className="signInImage" />
                    <span></span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="video-grid">
          {videosData.map((video) => (
            <VideoPrev
              key={video.url}
              title={video.title}
              publisher={video.publisher}
              url={video.url}
              thumbnailUrl={video.thumbnailUrl}
              upload_date={video.upload_date}
            />
          ))}
        </section>
        <section className="suggested-videos"></section>
      </main>
      <Dropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  );
}

export default Home;
