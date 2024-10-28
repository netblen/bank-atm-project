// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ATMSimulator from './components/ATMSimulator';
import ForgotPassword from './components/ForgotPassword';
import Checking from './components/Checking';
import Savings from './components/Savings';
import Payments from './components/Payments';
import ChangeContactInfo from './components/ChangeContactInfo';

import SecurityPassword from './components/SecurityPassword';
import AlertService from './components/AlertService';
import ManageAccountAccess from './components/ManageAccountAccess';
import { UserProvider } from './components/UserContext';


import Privacy from './components/Privacy';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/atm-simulator" element={<ATMSimulator />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checking" element={<Checking />} /> 
          <Route path="/savings" element={<Savings />} />
          <Route path="/ChangeContactInfo" element={<ChangeContactInfo />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/security" element={<SecurityPassword />} />
          <Route path="/alert-service" element={<AlertService />} />
          <Route path="/manage-account" element={<ManageAccountAccess />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
