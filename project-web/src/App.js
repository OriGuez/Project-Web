import './App.css';
import Registration from './Components/Register Page/websiteRegistration';
import React, { useState } from 'react';
import users from './data/userdb.json';
function App() {
  // creating the list of all users so I will Access It from all components
  const [usersList, setUsersList] = useState(users)

  return (
    <div className="App">
      <Registration usersList={usersList} setUsersList={setUsersList}/>
{/*       \\<lOGIN usersList={usersList}
 */}    </div>
  );
}

export default App;
