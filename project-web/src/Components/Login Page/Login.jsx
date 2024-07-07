import React, { useState, useRef, useEffect } from 'react';
import '../../App.css';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';


function AppLogin({ usersList, loggedUser, setLoggedUser }) {
  const usernameInput = useRef();
  const passwordInput = useRef();
  const [foundUser, setFoundUser] = useState({ username: '', password: '' });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logged User:", loggedUser);
  }, [loggedUser]);

  const validateUsername = () => {
    const val = usernameInput.current.value;
    if (val.length < 1) {
      setUsernameError('Username cannot be empty');
      return false;
    }
    // const user = usersList.find(user => user.username === val);
    // if (!user) {
    //   //setUsernameError('Username not found');
    //   return false;
    // }
    // setFoundUser(user);
    setUsernameError('');
    return true;
  };

  const validatePassword = () => {
    const pwval = passwordInput.current.value;
    if (pwval.length < 8) {
      setPasswordError('Password must contain at least 8 characters');
      return false;
    }
    if (!/\D/.test(pwval)) {
      setPasswordError('Password must contain at least one non-numeric character.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleUsernameChange = () => {
    setUsernameError('');
  };

  const handlePasswordChange = () => {
    setPasswordError('');
  };

  const signIn = async (event) => {
    event.preventDefault();
    setLoginError('');
    if (validatePassword()) {
      try {
        const response = await fetch('/api/tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: usernameInput.current.value, password: passwordInput.current.value })
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          //saving the token that we got inside localStorage
          localStorage.setItem('jwt', token);
          const responseID = await fetch(`/api/users/getID/${usernameInput.current.value}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          if (responseID.ok) {
            const data = await responseID.json();
            const userID = data.userID;
            //saving the userID inside localStorage
            localStorage.setItem('loggedUserID', userID);
            const user='';
            user.username=usernameInput.current.value;
            user._id=userID;
            setFoundUser(user);

          } else {
            const errorData = await responseID.json();
            console.error('Error:', errorData.message);
          }
          setLoggedUser(foundUser);
          navigate("/");
        } else {
          // Handle different status codes
          switch (response.status) {
            case 400:
              {
                setLoginError('Invalid Credentials');
                break;
              }
            case 404:
              {
                setLoginError('User Not Found');
                break;
              }
            case 500:
              {
                setLoginError('Internal Server Error');
                break;
              }
            default:
              setLoginError('Something went wrong');
          }
        }
      } catch (error) {
        setLoginError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="App-login-page">
      <div className="login-form">
        <div className="logoLogin">
          <Link to='/'>
            <img src="/logo.png" alt="ViewTube Logo" width="100px" height="auto" />
          </Link>ViewTube
        </div>
        <form>
          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              onBlur={validateUsername}
              onChange={handleUsernameChange}
              ref={usernameInput}
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onBlur={validatePassword}
              onChange={handlePasswordChange}
              ref={passwordInput}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          <button type="submit" onClick={signIn}> <FaSignInAlt /> Sign in</button>
          {loginError && <div className="error-message">{loginError}</div>}
        </form>
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

export default AppLogin;
