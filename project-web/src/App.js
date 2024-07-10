import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import Registration from './Components/Register Page/Register';
import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import VideoPage from './Components/VideoPage/VideoPage';
import VideoAdd from './Components/VideoAdd/VideoAdd';
import UserPage from './Components/UserPage/UserPage';
import Search from './Components/Search Page/SearchPage';
import EditVideoPage from './Components/EditVideoPage/EditVideoPage';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const loggedUserID = localStorage.getItem('loggedUserID');

    useEffect(() => {
      // Fetch the currently logged-in user data
      const fetchLoggedUser = async () => {
        if (loggedUserID) {
          try {
            const response = await fetch(`/api/users/${loggedUserID}`);
            if (!response.ok) {
              throw new Error('Failed to fetch logged user');
            }
            const userData = await response.json();
            setLoggedUser(userData);
          } catch (error) {
            console.error('Error fetching logged user:', error);
          }
        }
        else {
          setLoggedUser(null);
        }
      };

      fetchLoggedUser();
    }, [loggedUserID]);

    useEffect(() => {
      const darkModeData = localStorage.getItem('isDarkMode');
      if (!darkModeData)
        setIsDarkMode(false);
      else
        setIsDarkMode(true);
    }, []);
    
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AppLogin loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} videoList={videoList} setVideoList={setVideoList}/>} />
          <Route path="/video/:id" component={VideoPage} element={<VideoPage loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/videoadd" element={<VideoAdd loggedUser={loggedUser} />} />
          <Route path="/userpage/:userid" component={UserPage} element={<UserPage loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/search/:query" component={Search} element={<Search loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/video/:id/edit" component={EditVideoPage} element={<EditVideoPage loggedUser={loggedUser} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
