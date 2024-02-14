// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import UserPosts from './UserPosts';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        data.forEach((user) => {
          fetch(`https://handsome-cyan-goat.cyclic.app/checkUser/${user.id}`)
            .then((response) => response.json())
            .then((result) => {
              setUsers((prevUsers) =>
                prevUsers.map((prevUser) =>
                  prevUser.id === user.id ? { ...prevUser, isPresent: result.isPresent } : prevUser
                )
              );
            })
            .catch((error) => console.error(`Error checking user presence for ${user.id}:`, error));
        });
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleAddPost = (user) => {
    // Make a request to save user details in the cointabuser table
    fetch('https://handsome-cyan-goat.cyclic.app/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Update the user data with the presence information after adding
        setUsers((prevUsers) =>
          prevUsers.map((prevUser) =>
            prevUser.id === user.id ? { ...prevUser, isPresent: result.isPresent } : prevUser
          )
        );
      })
      .catch((error) => console.error(`Error adding user for ${user.id}:`, error));
  };

  const handleOpenPosts = (userId) => {
    // Use the navigate function from useNavigate
    navigate(`/user/${userId}`);
  };

  return (
    <div className="user-list-container">
      <h1>Cointab SE-ASSIGNMENT</h1>
  
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Website: {user.website}</p>
            <p>City: {user.address.city}</p>
            <p>Company: {user.company.name}</p>
            {user.isPresent ? (
              <Link to={`/userPosts/${user.id}/${user.company.name}`}>
                <button>Open</button>
              </Link>
            ) : (
              <button onClick={() => handleAddPost(user)}>Add</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
