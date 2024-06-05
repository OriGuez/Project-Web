import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dropdown.css'; 

const Dropdown = ({ isDropdownOpen, setIsDropdownOpen }) => {
  const handleClose = () => {
    setIsDropdownOpen(false); 
  };

  return (
    <div className="dropdown-container">
      <div
        className={`offcanvas offcanvas-start ${isDropdownOpen ? 'show' : ''}`}
        tabIndex="-1"
        id="offcanvasLeft"
        aria-labelledby="offcanvasLeftLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasLeftLabel">Menu</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleClose} />
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-start align-items-center">
              <i className="bi bi-house-door"></i>
              <span className="ms-2">Home</span>
            </li>
            <li className="list-group-item d-flex justify-content-start align-items-center">
              <i className="bi bi-film"></i>
              <span className="ms-2">Shorts</span>
            </li>
            <li className="list-group-item d-flex justify-content-start align-items-center">
              <i className="bi bi-plus-circle"></i>
              <span className="ms-2">Add Video</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
