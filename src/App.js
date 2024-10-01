// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import ATMSimulator from './components/ATMSimulator';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/atm-simulator" element={<ATMSimulator />} />
      </Routes>
    </Router>
  );
};

export default App;
