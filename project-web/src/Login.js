import React, { useState, useRef } from 'react';
import './App.css';
function AppLogin({ usersList, loggedUser, setLoggedUser }) {
  const usernameInput = useRef();
  const passwordInput = useRef();
  var logged = null;

  const validateUsername = (event) => {
    const val = event.target.value;
    if (val.length < 1) {
      usernameInput.current.classList.add('invalidInput');
      usernameInput.current.setCustomValidity('Username must contain at least 1 character');
      return;
    }
    logged = (usersList.find(user => user.username === usernameInput.current.value));
    console.log("aaaaaaaaaaaaaaaaaaa" + logged);

    if (logged == null) {
      usernameInput.current.classList.add('invalidInput');
      usernameInput.current.setCustomValidity('Username not found');
      return;
    }
  };

  const validatePassword = (event) => {
    const pwval = event.target.value;
    let hasNonNumeric = false;

    if (pwval.length < 8) {
      passwordInput.current.classList.add('invalidInput');
      passwordInput.current.setCustomValidity('Password must contain at least 8 characters');
      return;
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
    } else {
      passwordInput.current.classList.remove('invalidInput');
      passwordInput.current.setCustomValidity('');
    }
  }
  const signIn = (event) => {
    console.log(logged.password)

    if (logged != null && logged.password == passwordInput.current.value) {
      setLoggedUser(logged)
      console.log("WOWWWWWWWWWWWWWWWWWWW")
      //move to homepage with loggedUser data
    }
    else {
      logged.current.classList.add('invalid input');
      logged.current.setCustomValidity('incorrect username or password, try again');
      return;
    }
  }

  return (
    <div className="App login-page">
      <div className="login-form">
        <h1 className="logo">ViewTube</h1>
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
        <a href="#">Forgot password?</a>
      </div>
      <div className="create-account">
        <p>
          New to ViewTube? <a href="#">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default AppLogin;
