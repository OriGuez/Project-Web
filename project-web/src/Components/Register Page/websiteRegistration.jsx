import './websiteRegistration.css'
import React, { useState } from 'react';
import users from '../../data/userdb.json';
import UserList from './printlist';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Registration({ usersList, setUsersList }) {
  //console.log(usersList)
  const [newUser, setNewUser] = useState({ username: '', password: '', channelName: '', image: '' })
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [imgfile, uploadImg] = useState("")
  const [imgPreview, setImgPreview] = useState('');
  const navigate = useNavigate();


  const handleSubmit = () => {
    setPasswordError('');
    setUsernameError('');
    if (validateForm()) {
      setUsersList([...usersList, newUser])
      navigate("/login")
      // resetting the newuser to the next registration that will be
      //setNewUser({ username: '', password: '', confirmPassword: '', channelName: '', image: '' });
      //resetting the image prev for the next registration that will be
      setImgPreview('');
    }
    console.log("Registration Successful");
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
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
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = () => {
    if (newUser.password.length < 8 || !/\D/.test(newUser.password)) {
      setPasswordError('Password must contain at least 8 characters and at least one letter that is not a number');
      return false;
    }
    else if (newUser.password !== newUser.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };
  const validateForm = () => {
    if (newUser.username.trim() === '') {
      setUsernameError('Username cannot be empty');
      return false;
    } else if (newUser.channelName.trim() === '') {
      setUsernameError('Channel Name cannot be empty');
      return false;
    } else if (usersList.some(user => user.username === newUser.username)) {
      setUsernameError('Username already exists');
      return false;
    } else if (validatePassword()) {
      return true;
    }
    return false;
  };

  return (
    <div className="create-account-container">
      <div className="create-account-box">
        <div className="left-section">
          <img src="/logo.png" alt="viewTube Logo" className="viewTube-logo" />
          <h1>Create a ViewTube Account</h1>
          <p>Enter your details</p>
          <p>password must contain at least 8 characters and one non-digit letter</p>
        </div>
        <div className="right-section">
          <form>
            <div className="input-group">
              <input type="text" id="username" name="username" value={newUser.username} onChange={handleChange} placeholder="Username" required />
            </div>
            <div className="input-group">
              <input type="password" id="password" name="password" value={newUser.password} onChange={handleChange} placeholder="Password" required />
            </div>
            <div className="input-group">
              <input type="password" id="confirmPassword" name="confirmPassword" value={newUser.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            </div>
            <div className="input-group">
              <input type="text" id="channelName" name="channelName" value={newUser.channelName} onChange={handleChange} placeholder="Channel Name" required />
            </div>
            <div className="input-group">
            <input className="input-group" type="file" onChange={handleImageChange} />
            {imgPreview && <img src={imgPreview} className="user-profile-image" alt="Profile Preview" />}
            </div>
            {/* <input className="input-group" type="file" onChange={handleImageChange} />
            <img src={imgfile} className="rounded-scalable-image" /> */}
            <button type="button" onClick={handleSubmit}>Register</button>
            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
            {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}

          </form>
        </div>
      </div>
      <UserList users={usersList} />
      {/* <footer>
        <a href="#">Help</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </footer> */}
    </div>
  )
}
export default Registration;