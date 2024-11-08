import './Register.css';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaAddressCard } from 'react-icons/fa';

function Registration() {
  const [newUser, setNewUser] = useState({ username: '', password: '', confirmPassword: '', channelName: '', image: '' });
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [channelNameError, setChannelNameError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [picFile, setPicFile] = useState('');
  const [imgError, setImgError] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to true for initial render

  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      setIsAuthenticated(true);
    }
    else
    setIsAuthenticated(false);
  }, []);
  const handleSubmit = async () => {
    if (validateForm()) {

      try {
        // Map newUser to the desired field names
        const userPayload = new FormData();
        userPayload.append('username', newUser.username);
        userPayload.append('password', newUser.password);
        userPayload.append('displayName', newUser.channelName);
        userPayload.append('image', picFile);
        // userPayload.append('profilePic', newUser.image);
        const response = await fetch('/api/users', {
          method: 'POST',
          body: userPayload,
        });
        //if user created successfully
        if (response.status === 201) {
          //const result = await response.json();
          navigate("/login");
          setImgPreview('');
          setPicFile('');
          console.log("Registration Successful");
        } else {
          switch (response.status) {
            case 409:
              {
                setRegisterError('Username Already Exists');
                break;
              }
            case 403:
              {
                setRegisterError('No Profile Picture');
                break;
              }
            case 500:
              {
                setRegisterError('Internal Server Error');
                break;
              }
            default:
              setRegisterError('Something went wrong');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
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
      setPicFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setNewUser({
          ...newUser,
          image: file
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

  if (isAuthenticated) {
    return (
      <div className="main-container">
        <div className="video-add-container">
          <h2>You Are Already Logged-In</h2>
          <Link to="/">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="create-account-container">
      <div className="create-account-box">
        <div className="left-section">
          <div className="logoRegister">
            <Link to="/">
              <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
            </Link>ViewTube
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
              <button className="small-button"><FaSignInAlt /> Login</button>
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
              <input className="input-group" type="file" accept=".jpeg,.jpg,.png,.gif,.svg,.webp" onChange={handleImageChange} />
              {imgError && <div className="error-message1">{imgError}</div>}
            </div>
            <div className="image-container">
              {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Profile Preview" />}
            </div>
            <button type="button" onClick={handleSubmit}><FaAddressCard /> Register</button>
          </form>
          {registerError && <div className="error-message">{registerError}</div>}
        </div>
      </div>
    </div>
  )
}

export default Registration;
