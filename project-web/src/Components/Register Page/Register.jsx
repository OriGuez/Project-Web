import './Register.css';
import React, { useState } from 'react';
import users from '../../data/userdb.json';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Registration({ usersList, setUsersList }) {
  const [newUser, setNewUser] = useState({ username: '', password: '', confirmPassword: '', channelName: '', image: '' });
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [channelNameError, setChannelNameError] = useState('');
  const [imgError, setImgError] = useState('');
  const [imgPreview, setImgPreview] = useState('');

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (validateForm()) {
      setUsersList([...usersList, newUser]);
      navigate("/login");
      setImgPreview('');
      console.log("Registration Successful");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });

    // Validate the input field on change
    switch (name) {
      case 'username':
        validateUsername(value);
        break;
      case 'password':
        validatePassword(value);
        break;
      case 'confirmPassword':
        validateConfirmPassword(value);
        break;
      case 'channelName':
        validateChannelName(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setNewUser({
          ...newUser,
          image: reader.result
        });
        setImgError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateUsername = (value) => {
    if (value.trim() === '') {
      setUsernameError('Username cannot be empty');
      return false;
    } else if (usersList.some(user => user.username === value)) {
      setUsernameError('Username already exists');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = (value) => {
    if (value.length < 8 || !/\D/.test(value)) {
      setPasswordError('Use at least 8 characters and one non-digit letter');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== newUser.password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateChannelName = (value) => {
    if (value.trim() === '') {
      setChannelNameError('Channel Name cannot be empty');
      return false;
    }
    setChannelNameError('');
    return true;
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateUsername(newUser.username)) isValid = false;
    if (!validatePassword(newUser.password)) isValid = false;
    if (!validateConfirmPassword(newUser.confirmPassword)) isValid = false;
    if (!validateChannelName(newUser.channelName)) isValid = false;

    if (!imgPreview) {
      setImgError('Please upload an image');
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className="create-account-container">
      <div className="create-account-box">
        <div className="left-section">
          <div className="logoRegister">
            <Link to="/">
              <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
            </Link>ViewTube
            {/* <span> ViewTube </span> */}
          </div>
          <div className="create">Create a ViewTube account</div>
          <div className="Enter">Enter your details, <br />
            <span> password must contain at least 8 characters </span>
            <br />
            <span> and at least one non-digit letter</span> 
          </div>
          <div className='LoginReg'>
            Already have an account?
            <br />
            <Link to="/login">
              <button className="small-button">Login</button>
            </Link>
          </div>
        </div>
        <div className="right-section">
          <form>
            <div className="input-group">
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={newUser.username} 
                onChange={handleChange} 
                onBlur={() => validateUsername(newUser.username)} 
                placeholder="Username" 
                required 
              />
              {usernameError && <div className="error-message">{usernameError}</div>}
            </div>
            <div className="input-group">
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={newUser.password} 
                onChange={handleChange} 
                onBlur={() => validatePassword(newUser.password)} 
                placeholder="Password" 
                required 
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <div className="input-group">
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={newUser.confirmPassword} 
                onChange={handleChange} 
                onBlur={() => validateConfirmPassword(newUser.confirmPassword)} 
                placeholder="Confirm Password" 
                required 
              />
              {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
            </div>
            <div className="input-group">
              <input 
                type="text" 
                id="channelName" 
                name="channelName" 
                value={newUser.channelName} 
                onChange={handleChange} 
                onBlur={() => validateChannelName(newUser.channelName)} 
                placeholder="Channel Name" 
                required 
              />
              {channelNameError && <div className="error-message">{channelNameError}</div>}
            </div>
            <div className="input-group">
              <input className="input-group" type="file" onChange={handleImageChange} />
              {imgError && <div className="error-message">{imgError}</div>}
            </div>
            <div className="image-container">
              {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Profile Preview" />}
            </div>
            <button type="button" onClick={handleSubmit}>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registration;
