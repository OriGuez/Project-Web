import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import './Home.css';

function Home({ loggedUser }) {
let content; 
if (loggedUser)
  {content=<p> <h1>Welcome to ViewTube</h1> </p> ;
  console.log("logged");

}
else {
  content= <p> <h1>Not logged</h1> </p>;
  console.log("hello");

}

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

          <div className="dropdown">
            <a
              href="#"
              className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="mdo"
                width="32"
                height="32"
                className="rounded-circle"
              />
            </a>
            <ul className="dropdown-menu text-small shadow">
              <li><a className="dropdown-item" href="#">New project...</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </header>
      
      <div className="home-screen">
         {/* <h1>Welcome to ViewTube</h1> */}
         {content}
        <Link to="/login">
          <button>Login</button>
        </Link>
        <div className="create-account">
          <p>
            New to ViewTube?
            <Link to="/register">
              <button>Create an account</button>
            </Link>
          </p>
          
        </div>
      </div>

    </div>
      
  );
}

export default Home;