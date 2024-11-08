import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import './NavBar.css';

function NavBar({ loggedUser, setLoggedUser, isDarkMode, setIsDarkMode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('loggedUserID');
  const linkStyle = {
    color: isDarkMode ? 'white' : 'black',
    textDecoration: 'none',
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleSignOut = () => {
    // Clear the token from local storage
    localStorage.removeItem('jwt');
    localStorage.removeItem('loggedUserID');
    setLoggedUser(null);
    //navigate('/login');
  };
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchInput.toLowerCase();
    if (query === '') {
      return; // Break if input is empty
    }
    const encodedQuery = encodeURIComponent(query);
    navigate(`/search/${encodedQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const toggleDarkMode = () => {
    if (isDarkMode)
      localStorage.removeItem('isDarkMode');
    else
      localStorage.setItem('isDarkMode', 1);
    setIsDarkMode(!isDarkMode);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleImageClick = () => {
    setShowSignOutDialog(!showSignOutDialog);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSignOutConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSignOutDialog(false);
      handleSignOut();
    }, 300);
  };

  return (
    <div>
      <header className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button
              className={`btn ${isDarkMode ? 'btn-dark' : 'btn-light'} dropdownToggle`}
              onClick={handleDropdownClick}
            >
              <span className="tooltipMenu">Menu</span>
              <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
            </button>
            <Link to="/" className="navbar-brand ms-2">
              <span className="tooltipLogo">Home</span>
              <img src="/logo.png" alt="ViewTube Logo" width="40px" height="auto" />
            </Link>
            <span5 className={`span5 ${isDarkMode ? 'text-white' : 'text-black'}`}>ViewTube</span5>
          </div>
          <div className="search-container">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyPress}
            />
            <button type="submit" className="search-button" onClick={handleSearch}>
              <span className="tooltipSearch">Search</span>
              <i className="bi bi-search"></i>
            </button>
          </div>
          <div className="user-info">
            {loggedUser ? (
              <>
                <div className="addVideo">
                  <Link to="/videoadd" className="menu-item">
                    <div className="icon-circle">
                      <i className="bi bi-camera-video"></i>
                      <i className="bi bi-plus icon-plus"></i>
                      <span className="tooltipAdd">Create</span>
                    </div>
                  </Link>
                </div>
                <div className="signOut" style={{ position: 'relative' }}>
                  <img src={loggedUser.profilePic} alt="Profile" className="user-image" onClick={handleImageClick} />
                  <div className={`signOutDialog ${showSignOutDialog ? 'showSignOutDialog' : 'hideSignOutDialog'}`}>
                    <div className="dialogChannelName" title={loggedUser.displayName}>{loggedUser.displayName} </div>
                    <br />
                    <span>@{loggedUser.username}</span>
                    <br />
                    <Link to={`/userpage/${loggedUser._id}`} className="myChannelButton">
                      <span className="tooltip">My Channel</span>

                      <img src="/channel.png" alt="My Channel" width="40px" height="auto" />
                    </Link>
                    <br />
                    <button className="btn btn-secondary" onClick={handleSignOutConfirm}>
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="signIn">
                <Link to="/login" className="signInLink">
                  <span className="tooltipSignIn">Sign In</span>
                  <div className="signInContent">
                    <img src="/default.png" alt="Sign in" className="signInImage" />

                    <FaSignInAlt />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="dropdown-container">
        <div className={`offcanvas offcanvas-start ${isDropdownOpen ? 'show' : ''}`}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title"> Menu</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={handleClose}
            />
          </div>
          <div className="offcanvas-body">
            <ul className="list-group">
              <Link to="/" style={linkStyle} className="menu-item">
                <li className="list-group-item d-flex justify-content-start align-items-center">
                  <i className="bi bi-house-door"></i>
                  <span className="ms-2">Home</span>
                </li>
              </Link>
              <Link to="/videoadd" style={linkStyle} className="menu-item" >
                <li className="list-group-item d-flex justify-content-start align-items-center"  >
                  <i className="bi bi-plus-circle"></i>
                  <span className="ms-2">Add Video</span>
                </li>
              </Link>
              <li className="list-group-item d-flex justify-content-start align-items-center">
                <i className="bi bi-moon"></i>
                <span className="ms-2">View Mode</span>
                <button className={`btn btn-sm ms-auto ${isDarkMode ? 'btn-light' : 'btn-dark'}`} onClick={toggleDarkMode}>
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
