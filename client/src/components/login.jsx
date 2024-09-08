import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import bcrypt from 'bcryptjs';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Fetch user details by username
        const response = await fetch(`http://localhost:8080/user/${username}`);

        if (response.ok) {
           const user = await response.json();
           console.log(user);
           // Verify the password (make sure you handle password comparison client-side)
          // const isMatch = await bcrypt.compare(password, user.T_Password);
           
           if (password==user.T_Password) {
               navigate('/home');
           } else {
               setError('Invalid password');
           }
        } else {
            const errorText = await response.text(); // Get the error message
            console.error('Fetch error:', errorText);
            setError(errorText);
        }
    } catch (error) {
       console.error('Login error:', error);
       setError('An error occurred during login');
    }
};


 

  return (
    <div className='login-container'>
      <div className="header">
        <div className='title'>Login</div>
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

export default Login;
