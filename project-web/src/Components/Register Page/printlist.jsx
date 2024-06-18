import './websiteRegistration.css'
import React from 'react';

function UserList({ users }) {
    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        {user.image && <img src={user.image} width="60px" height="60px" 
                         alt={`${user.username}'s profile`} className="user-profile-image" />}
                    
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Password:</strong> {user.password}</p>
                        <p><strong>Confirm Password:</strong> {user.confirmPassword}</p>
                        <p><strong>Channel Name:</strong> {user.channelName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
