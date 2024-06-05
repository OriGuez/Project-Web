import React, { useState, useRef, useEffect } from 'react';
import '../../App.css';
import './Login.css'; 

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function AppLogin({ usersList, loggedUser, setLoggedUser }) {
  const usernameInput = useRef();
  const passwordInput = useRef();
  const [foundUser, setFoundUser] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  useEffect(() => {
    console.log("00000Logged User:", loggedUser);
  }, [loggedUser]);

  const validateUsername = (event) => {
    const val = usernameInput.current.value;
    if (val.length < 1) {
      usernameInput.current.classList.add('invalidInput');
      usernameInput.current.setCustomValidity('Username must contain at least 1 character');
      return false;
    }
    const user = usersList.find(user => user.username === val);

    if (!user) {
      usernameInput.current.classList.add('invalidInput');
      usernameInput.current.setCustomValidity('Username not found');
      return false;
    }
    setFoundUser(user);
    usernameInput.current.classList.remove('invalidInput');
    usernameInput.current.setCustomValidity('');
    return true;
  };

  const validatePassword = (event) => {
    const pwval = passwordInput.current.value;
    let hasNonNumeric = false;

    if (pwval.length < 8) {
      passwordInput.current.classList.add('invalidInput');
      passwordInput.current.setCustomValidity('Password must contain at least 8 characters');
      return false;
    }

    for (let i = 0; i < pwval.length; i++) {
      const charCode = pwval.charCodeAt(i);
      if (charCode < 48 || charCode > 57) {
        hasNonNumeric = true;
        break;
      }
    }

    if (!hasNonNumeric) {
      passwordInput.current.classList.add('invalidInput');
      passwordInput.current.setCustomValidity('Password must contain at least one non-numeric character.');
      return false;
    } else {
      passwordInput.current.classList.remove('invalidInput');
      passwordInput.current.setCustomValidity('');
      return true
    }
  }
  const signIn = (event) => {
    event.preventDefault();
    if (validateUsername() && validatePassword() && foundUser && foundUser.password === passwordInput.current.value) {
      setLoggedUser(foundUser);
      console.log("logged isnt null.his value:" + foundUser.username + " " + foundUser.password)
      if (!loggedUser)
        console.log("null")
      navigate("/");
    } else {
      usernameInput.current.classList.add('invalidInput');
      usernameInput.current.setCustomValidity('Incorrect username or password, try again');
      passwordInput.current.classList.remove('invalidInput');
      passwordInput.current.setCustomValidity('');
    }
  }

  return (
    <div className="App login-page">
      <div className="login-form">
        <h1 className="logo">ViewTube <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
        </h1>
        <form>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              onChange={validateUsername}
              ref={usernameInput}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={validatePassword}
              ref={passwordInput}
            />
          </div>
          <button type="submit" onClick={signIn}>Sign in</button>
        </form>
      </div>
      <div className="create-account">
        <p>
          New to ViewTube?
          <Link to="/register">
            <button>Create an account</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AppLogin;