// src/components/ATMSimulator.js
import React from 'react';
import './ATMSimulator.css';

const ATMSimulator = () => {
  return (
    <div className="atm-simulator-container">
      <h1>Welcome to the ATM Simulator</h1>
      <p>You can now perform secure transactions, manage your accounts, and view real-time updates.</p>
      
      <div className="atm-features">
        <div className="feature">
          <h3>Check Balance</h3>
          <p>View your current account balance instantly.</p>
        </div>
        <div className="feature">
          <h3>Withdraw Funds</h3>
          <p>Withdraw money securely from your account.</p>
        </div>
        <div className="feature">
          <h3>Deposit Funds</h3>
          <p>Deposit money into your account effortlessly.</p>
        </div>
        <div className="feature">
          <h3>Transfer Funds</h3>
          <p>Transfer funds between your accounts or to others.</p>
        </div>
      </div>
    </div>
  );
};

export default ATMSimulator;
