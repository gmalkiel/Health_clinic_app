
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/components/Home';
import Login from '../src/components/login';
import Header from '../src/components/header';
import Therapists from '/src/components/Therapists';


function App() {
  return (
    <Router>
       <Header /> {/* Header will be displayed on all pages */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/therapists" element={<Therapists />} />
      </Routes>
    </Router>
  );
}

export default App;
