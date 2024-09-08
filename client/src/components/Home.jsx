import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import bcrypt from 'bcryptjs';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');




  return (
    <div className='login-container'>
      <div className="header">
        <div className='title'>im in other page</div>
        <div className="user-info">
          <i className="fas fa-user"></i>
          <span className="user_name">USER </span>
        </div>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {error && <p>{error}</p>}
      </form>
      <p>Dont have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default Home;
