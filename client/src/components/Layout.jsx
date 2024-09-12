import Header from '../components/Header';
import Navigation from '../components/Navigation';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {

    const location = useLocation();
    // Check if the current route is '/login'
    const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  
    return (
      <div>
        <Header />
        <div style={{ display: 'flex' }}>
          {!isLoginPage && <Navigation />}
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </div>
    );
};

export default Layout;
