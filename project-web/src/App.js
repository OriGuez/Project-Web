import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import Registration from './Components/Register Page/Register';
import React, { useState } from 'react';
import users from './data/userdb.json';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import VideoPage from './Components/VideoPage/VideoPage';
import VideoAdd from './Components/VideoAdd/VideoAdd';
import videos from './data/vidDB.json';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [usersList, setUsersList] = useState(users);
  const [videoList, setVideoList] = useState(videos);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredVideoList, setFilteredVideoList] = useState(videoList);

  const handleSignOut = () => {
    // Clear the token from local storage
    localStorage.removeItem('jwt');
    setLoggedUser(null);
    //navigate('/login');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Registration usersList={usersList} setUsersList={setUsersList} />} />
          <Route path="/" element={<Home loggedUser={loggedUser} handleSignOut={handleSignOut} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} videoList={videoList} setVideoList={setVideoList} filteredVideoList={filteredVideoList} setFilteredVideoList={setFilteredVideoList} usersList={usersList} />} />
          <Route path="/video/:id" component={VideoPage} element={<VideoPage loggedUser={loggedUser} videoList={videoList} setVList={setVideoList} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setFilteredVideoList={setFilteredVideoList} usersList={usersList} handleSignOut={handleSignOut} />} />
          <Route path="/videoadd" element={<VideoAdd loggedUser={loggedUser} videoList={videoList} setVideoList={setVideoList} setFilteredVideoList={setFilteredVideoList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
