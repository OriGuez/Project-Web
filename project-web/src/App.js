import './App.css';

import AppLogin from './Login';
import MapVids from './Components/Home/Homepage';
import React, { useState } from 'react';
import Registration from './Components/Register Page/websiteRegistration';
import users from './data/userdb.json';

function App() {
  const [loggedUser, setLoggedUser] = useState(null)
  // creating the list of all users so I will Access It from all components
  const [usersList, setUsersList] = useState(users)

  return (
    <div className="App">
      <MapVids />
      <AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <Registration usersList={usersList} setUsersList={setUsersList} />
      {(() => {
        if (loggedUser) {
          console.log("loggedUser=" + loggedUser.username);
        }
      })()}
      {loggedUser != null && loggedUser.image && (
        <img src={loggedUser.image} alt={`${loggedUser.username}'s profile`} />
      )}
    </div>
  );
}

export default App;

