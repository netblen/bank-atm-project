// src/components/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Bank ATM Simulator</h1>
        <p>Your personal online banking experience, designed to help you manage your finances with ease.</p>
        <a href="/auth" className="cta-button">Get Started</a>
      </header>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-list">
          <div className="feature">
            <h3>Secure Transactions</h3>
            <p>Experience secure and seamless transactions with our state-of-the-art encryption technology.</p>
          </div>
          <div className="feature">
            <h3>Account Management</h3>
            <p>Easily check your balance, withdraw, deposit, and transfer money anytime, anywhere.</p>
          </div>
          <div className="feature">
            <h3>Real-time Updates</h3>
            <p>Receive instant updates on your account activity and transaction history.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>Join us and simulate real banking transactions in a secure environment.</p>
        <a href="/auth" className="cta-button">Create Account</a>
      </footer>
    </div>
  );
};

export default Home;
