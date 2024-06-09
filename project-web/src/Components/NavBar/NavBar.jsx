import './NavBar.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar({loggedUser, handleSignOut, isDarkMode, setIsDarkMode}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [videos, setVideos] = useState([]);

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

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
    if (!showSignOutDialog) {
      setShowSignOutDialog(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 100);
    } else {
      setShowSignOutDialog(false);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(true), 100);
    }
  };

  const handleSignOutConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSignOutDialog(false);
      handleSignOut();
    }, 300);
  };

  return (
    // <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
<div>
    <header className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
          </Link>
          <span className={isDarkMode ? 'text-white' : 'text-black'}>ViewTube</span>
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
                <div style={{ position: 'relative' }}>
                  <img src={loggedUser.image} alt="Profile" className="user-image" onClick={handleImageClick} />
                  <div
                    className={`signOutDialog ${isDarkMode ? 'dark-mode' : ''} ${isAnimating
                      ? showSignOutDialog
                        ? 'showSignOutDialog'
                        : 'hideSignOutDialog'
                      : showSignOutDialog
                        ? 'showSignOutDialog'
                        : ''
                      }`}
                  >
                    <span>{loggedUser.username}</span>
                    <span>{loggedUser.channelName}</span>
                    <div className="addVideo">
                      <Link to="/videoadd" className={`menu-item ${isDarkMode ? 'dark-mode' : ''}`}>
                        <i className="bi bi-plus-circle icon"></i>
                        Add a video
                      </Link>
                    </div>
                    <button className="btn btn-secondary" onClick={handleSignOutConfirm}>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="signIn">
                <Link to="/login" style={{ color: isDarkMode ? 'white' : 'black', textDecoration: 'none' }}>
                  <div className="signInContent">
                    <img src="/default.png" alt="Sign in" className="signInImage" />
                    <span>Sign in</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    <div className={`dropdown-container ${isDarkMode ? 'dark-mode' : ''}`}>
    
      <div
        className={`offcanvas offcanvas-start ${isDropdownOpen ? 'show' : ''} ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
        tabIndex="-1"
        id="offcanvasLeft"
        aria-labelledby="offcanvasLeftLabel"
      >
        <div className={`offcanvas-header ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
          <h5 className="offcanvas-title" id="offcanvasLeftLabel">Menu</h5>
          <button
            type="button"
            className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={handleClose} />
        </div>
        <div className={`offcanvas-body ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
          <ul className={`list-group ${isDarkMode ? 'list-group-dark' : 'list-group-light'}`}>
            <li className={`list-group-item d-flex justify-content-start align-items-center ${isDarkMode ? 'bg-dark text-light' : ''}`}>
              <i className="bi bi-house-door"></i>
              <span className="ms-2">Home</span>
            </li>
            <li className={`list-group-item d-flex justify-content-start align-items-center ${isDarkMode ? 'bg-dark text-light' : ''}`}>
              <i className="bi bi-film"></i>
              <span className="ms-2">Shorts</span>
            </li>
            <li className={`list-group-item d-flex justify-content-start align-items-center ${isDarkMode ? 'bg-dark text-light' : ''}`}>
              <i className="bi bi-plus-circle"></i>
              <span className="ms-2">Add Video</span>
            </li>
            <li className={`list-group-item d-flex justify-content-start align-items-center ${isDarkMode ? 'bg-dark text-light' : ''}`}>
              <i className="bi bi-moon"></i>
              <span className="ms-2">View Mode</span>
              <button
                className={`btn btn-sm ${isDarkMode ? 'btn-light border-light' : 'btn-dark border-dark'} ms-auto me-2`}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}

export default NavBar;