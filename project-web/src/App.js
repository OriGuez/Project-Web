import './App.css';

import AppLogin from './Login';
import React, {useState} from 'react';

 //function App({usersList, loggedUser, setLoggedUser})

import Registration from './Components/Register Page/websiteRegistration';
import users from './data/userdb.json';

function App() {
  const [loggedUser, setLoggedUser] = useState(null)
  // creating the list of all users so I will Access It from all components
  const [usersList, setUsersList] = useState(users)

  return (
    <div className="App">
      <AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser}/>
      <Registration usersList={usersList} setUsersList={setUsersList}/>
    </div>
  );
}

export default App;

