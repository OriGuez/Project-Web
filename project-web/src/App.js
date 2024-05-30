import './App.css';

import AppLogin from './Login';
import React, {useState} from 'react';

// const [loggedUser, setLoggedUser] = useState(null)
// function App({usersList, loggedUser, setLoggedUser})

import Registration from './Components/Register Page/websiteRegistration';
import React, { useState } from 'react';
import users from './data/userdb.json';

function App() {
  // creating the list of all users so I will Access It from all components
  const [usersList, setUsersList] = useState(users)

  return (
    <AppLogin/>
    <div className="App">
      <Registration usersList={usersList} setUsersList={setUsersList}/>
    </div>
  );
}

export default App;

