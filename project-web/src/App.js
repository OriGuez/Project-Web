import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import Registration from './Components/Register Page/websiteRegistration';
import MapVids from './Components/Home/MapVids';
import React, { useState } from 'react';
import users from './data/userdb.json';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Comment from './Components/VideoPage/Comment';
import VideoPage from './Components/VideoPage/VideoPage';
import VideoAdd from './Components/VideoAdd/VideoAdd';
import videos from './data/vidDB.json';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [usersList, setUsersList] = useState(users);
  const [videoList, setVideoList] = useState(videos);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = () => {
    setLoggedUser(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Registration usersList={usersList} setUsersList={setUsersList} />} />
          <Route path="/" element={<Home loggedUser={loggedUser} handleSignOut={handleSignOut} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} videoList={videoList} setVideoList={setVideoList}/>} />
          <Route path="/video/:id" component={VideoPage} element={<VideoPage loggedUser={loggedUser} videoList={videoList} setVList={setVideoList} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>} />
          <Route path="/videoadd" element={<VideoAdd loggedUser={loggedUser} videoList={videoList} setVideoList={setVideoList}/>}  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
