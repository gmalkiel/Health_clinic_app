import React, { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = `/dashboard/${data.userId}`;
      } else {
        setErrorMessage(data.message || 'Username or password is incorrect');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="admin-entry">כניסת מנהל</div>
        <div className="logo">לגוף ולנפש</div>
      </div>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="input-group">
            <label htmlFor="username">
              <span className="icon">👤</span>
              <input
                type="text"
                id="username"
                placeholder="shira_cohen___"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <span className="icon">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="show-password">👁️</span>
            </label>
          </div>
          <button type="submit" className="login-btn">Login Now</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="signup">
          Don't have an account? <a href="#">Signup</a>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
