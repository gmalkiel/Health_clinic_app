import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Login.css';      
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useUser } from '../components/UserContext'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const[manger,setManager] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  useEffect(() => {
    if (location.state && location.state.manager !== undefined) {
      setManager(location.state.manager);
    }
  }, [location.state]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Fetch user details by username
        let response;
        if(!manger){
                response = await fetch(`http://localhost:8080/user/${username}`);
          }
        else{
          //במידה ונרצה כניסת מנהל נחפש בטבלה המתאימה
            response = await fetch(`http://localhost:8080/manager_/${password}`);
        }

        if (response.ok) {
           const user = await response.json();
           console.log(user);
           
           if (!manger && password === user.T_Password) {    
            setUser({ username, manger });     
            navigate(`/home/therapist/${username}`);
          


           } 
          else if(manger){
            setUser({ username, manger });
            navigate(`/home/admin/${username}`);
          }
           else {
               setError('Invalid password');
           }
        } else {
            const errorText = await response.text(); 
            console.error('Fetch error:', errorText);
            setError(errorText);
        }
    } catch (error) {
       console.error('Login error:', error);
       setError('An error occurred during login');
    }
};

  return (
    <>
    <div className='login-container'>
      <h2>התחברות למערכת</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="הכנס שם משתמש" 
          />
        </div>
        <div className="form-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הכנס סיסמה"
          />
        </div>
        <button type="submit" className="login-button">התחבר</button>
        {error && <p>{error}</p>}
      </form>
      <p>
  <a 
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setManager(!manger); 
    }}
    className={manger ? 'manager-active' : 'manager-inactive'} // מיישם את הסגנון בהתאם למצב
  >
    {manger ? 'כניסה כמטפל' : 'כניסה כמנהל'}
  </a>
</p>

    </div>
    </>
  );
};

export default Login;
