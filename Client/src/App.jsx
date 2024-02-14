// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';
import UserPosts from './components/UserPosts';
import Homepage from './components/Homepage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/userData" element={<UserList />} />
        <Route path="/userPosts/:userId/:company" element={<UserPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
