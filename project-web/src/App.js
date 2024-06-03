import './App.css';
import Home from './Components/Home/Home';
import AppLogin from './Components/Login Page/Login';
import React, {useState} from 'react';
import Registration from './Components/Register Page/websiteRegistration';
import users from './data/userdb.json';
import { Routes, Route, BrowserRouter} from 'react-router-dom';


function App() {
  const [loggedUser, setLoggedUser] = useState(null)
  const [usersList, setUsersList] = useState(users)

  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AppLogin usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser}/>} />
            <Route path="/register" element={<Registration usersList={usersList} setUsersList={setUsersList}/>} />
            <Route path="/" element={<Home usersList={usersList} loggedUser={loggedUser} setLoggedUser={setLoggedUser}/>} />
          </Routes>
        </BrowserRouter>
  
    </div>
  );
}

export default App;

