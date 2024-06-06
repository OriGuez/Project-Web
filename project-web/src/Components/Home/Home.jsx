import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from '../SideBar/Dropdown'; // Import the Dropdown component
import { useState } from 'react';

function Home({ loggedUser, handleSignOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility on click
  };

  return (
    <div className="home-container">
      <Link to="/video/5">
      <p>hereeee</p>
      </Link>
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
          </Link>
          <button className="btn btn-light d-flex align-items-center dropdown-toggle" onClick={handleDropdownClick}>
            <i className="bi bi-list" style={{ fontSize: '2rem', marginRight: '10px' }}></i> Explore
          </button>
          <form className="d-flex w-100 me-3" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <div className="user-info d-flex align-items-center">
            {/* Display user avatar and sign-out functionality based on loggedUser */}
            {loggedUser ? (
              <>
                <img
                  src={loggedUser.image}
                  alt="user-icon"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
                <Link to="/">
                  <button type="submit" onClick={handleSignOut} className="btn btn-link btn-link-styled">Sign out</button>
                </Link>

              </>
            ) : (
              <Link to="/login" className="btn btn-link btn-link-styled">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="video-grid">
          {/* ... your video component(s) ... */}
        </section>
        <section className="suggested-videos">
          <h2>Suggested videos</h2>
          {/* ... your video component(s) ... */}
        </section>
      </main>
      <Dropdown isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
    </div>
  );
}

export default Home;
