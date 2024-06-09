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
  const [imgError, setImgError] = useState('');
  const [imgPreview, setImgPreview] = useState("");

  const navigate = useNavigate();
  const handleSubmit = () => {
    setPasswordError('');
    setUsernameError('');
    if (validateForm()) {
      setUsersList([...usersList, newUser])
      navigate("/login")
      // resetting the newuser to the next registration that will be
      // setNewUser({ username: '', password: '', confirmPassword: '', channelName: '', image: '' });
      // resetting the image prev for the next registration that will be
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
      setImgError('');
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
    }
    else if (!imgPreview) {
      setImgError('Please Upload An Image');
      return false;
    }
    else if (validatePassword()) {
      setUsernameError('');
      return true;
    }
    return false;
  };

  return (
    <div className="create-account-container">
      <div className="create-account-box">
        <div className="left-section">
          <div className="logoRegister">
            <Link to="/">
              <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
            </Link>
            <span> ViewTube </span>
          </div>
          <div className="create">Create a ViewTube account</div>
          <div className="Enter">Enter your details, <br></br>
            <span> password must contain at least 8 characters </span>
            <br></br>
            <span> and at least one non-digit letter</span> </div>
          <div className='LoginReg'>
            Already have an account?
            <br></br>
            <Link to="/login">
              <button className="small-button">Login</button>
            </Link>
          </div>
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
            </div>
            <div className="image-container">
              {imgPreview && <img src={imgPreview} width="100px" height="100px" className='rounded-scalable-image' alt="Profile Preview" />}
            </div>
            <button type="button" onClick={handleSubmit}>Register</button>
            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
            {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
            {imgError && <div style={{ color: 'red' }}>{imgError}</div>}
          </form>
        </div>
      </div>
      <UserList users={usersList} />

    </div>
  )
}
export default Registration;