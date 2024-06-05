import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/LoginPage/Login';
import Registration from './Components/Register Page/websiteRegistration';
import MapVids from './Components/Home/Homepage';
import React, { useState } from 'react';
import users from './data/userdb.json';

function App() {
  const [loggedUser, setLoggedUser] = useState(null)
  // creating the list of all users so I will Access It from all components
  const [usersList, setUsersList] = useState(users)

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

