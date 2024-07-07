import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import Registration from './Components/Register Page/Register';
import React, { useState, useEffect } from 'react';
import users from './data/userdb.json';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import VideoPage from './Components/VideoPage/VideoPage';
import VideoAdd from './Components/VideoAdd/VideoAdd';
import UserPage from './Components/UserPage/UserPage';
import videos from './data/vidDB.json';
import Search from './Components/Search Page/SearchPage';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [usersList, setUsersList] = useState(users);
  const [videoList, setVideoList] = useState(videos);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredVideoList, setFilteredVideoList] = useState(videoList);
  const loggedUserID = localStorage.getItem('loggedUserID');
  // const handleSignOut = () => {
    //   // Clear the token from local storage
    //   localStorage.removeItem('jwt');
    //   localStorage.removeItem('loggedUserID');
    //   setLoggedUser(null);
    // };

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


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Registration usersList={usersList} setUsersList={setUsersList} />} />
          <Route path="/" element={<Home loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} videoList={videoList} setVideoList={setVideoList} filteredVideoList={filteredVideoList} setFilteredVideoList={setFilteredVideoList} usersList={usersList} />} />
          <Route path="/video/:id" component={VideoPage} element={<VideoPage loggedUser={loggedUser} setLoggedUser={setLoggedUser} videoList={videoList} setVList={setVideoList} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setFilteredVideoList={setFilteredVideoList} filteredVideoList = {filteredVideoList} />} />
          <Route path="/videoadd" element={<VideoAdd loggedUser={loggedUser} videoList={videoList} setVideoList={setVideoList} setFilteredVideoList={setFilteredVideoList} />} />
          <Route path="/userpage/:userid" component={UserPage} element={<UserPage loggedUser={loggedUser} setLoggedUser={setLoggedUser} videoList={videoList} setVList={setVideoList} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setFilteredVideoList={setFilteredVideoList} usersList={usersList} />} />
          <Route path="/search/:query" component={Search} element={<Search loggedUser={loggedUser} setLoggedUser={setLoggedUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
