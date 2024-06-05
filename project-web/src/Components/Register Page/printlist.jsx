import './websiteRegistration.css'
import React from 'react';
//this is a temporary debug list of user
function UserList({ users }) {
    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        {user.image && <img src={user.image} alt={`${user.username}'s profile`} className="user-profile-image" />}
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