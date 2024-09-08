import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png'; 
import '../css/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleEnter = async (e) => {
    e.preventDefault();
    
    navigate('/login', { state: { manager: true } }); // הנחה שהנתיב לעמוד הלוגין הוא '/login'
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="manager-login">
          <button onClick={handleEnter} type="submit" className="login-button">
            כניסת מנהל
          </button>
        </div>
        <div className="logo-container">
          <img src={logo} alt="לוגו" className="logo" />
        </div>
      </div>
    </>
  );
};

export default Header;
