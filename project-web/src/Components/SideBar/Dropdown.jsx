import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dropdown.css';

const Dropdown = ({ isDropdownOpen, setIsDropdownOpen, toggleDarkMode, isDarkMode }) => {
  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  return (
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
            onClick={handleClose}
          />
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
  );
};

export default Dropdown;
