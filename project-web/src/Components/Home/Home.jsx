import { Link } from 'react-router-dom';
import '../../App.css';
import './Home.css';

function Home({ loggedUser }) {
  const signOut = (event) => {
    loggedUser = null;
    window.location.reload();
  };

  return (
    <div>
      <header className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg className="bi me-2" width="40" height="32">
                <use xlinkHref="#bootstrap"></use>
              </svg>
            </a>
            <ul className="dropdown-menu text-small shadow">
              <li><a className="dropdown-item active" href="#" aria-current="page">Overview</a></li>
              <li><a className="dropdown-item" href="#">Inventory</a></li>
              <li><a className="dropdown-item" href="#">Customers</a></li>
              <li><a className="dropdown-item" href="#">Products</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Reports</a></li>
              <li><a className="dropdown-item" href="#">Analytics</a></li>
            </ul>
          </div>

          <form className="d-flex w-100 me-3" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          <div className="user-info">
            <img
              src={loggedUser ? loggedUser.image : '/default.png'}
              alt="user-icon"
              width="32"
              height="32"
              className="rounded-circle"
            />
            {loggedUser && (
              <Link to="/">
                <button type="submit" onClick={signOut}>Sign out</button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="home-screen">
        {loggedUser ? (
          <div>
            <h1>Welcome to ViewTube, {loggedUser.username} {loggedUser.password} {loggedUser.channelName}</h1>
            <img
              src={loggedUser.image}
              alt="user"
              width="32"
              height="32"
              className="rounded-circle"
            />
          </div>
        ) : (
          <div>
            <h1>Welcome to ViewTube</h1>
            <div className="create-account">
              <p>
                <Link to="/login">
                  <button>Login</button>
                </Link>
                New to ViewTube?
                <Link to="/register">
                  <button>Create an account</button>
                </Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
