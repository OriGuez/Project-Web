import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import Registration from './Components/Register Page/websiteRegistration';
import MapVids from './Components/Home/Homepage';
import React, { useState } from 'react';
import users from './data/userdb.json';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [usersList, setUsersList] = useState(users);

  const handleSignOut = () => {
    setLoggedUser(null);
  };

  const handleSignOut = () => {
    setLoggedUser(null);
  };

  return (
    <div className="App">
      <MapVids />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
          <Route path="/register" element={<Registration usersList={usersList} setUsersList={setUsersList} />} />
          <Route path="/" element={<Home loggedUser={loggedUser} handleSignOut={handleSignOut} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
