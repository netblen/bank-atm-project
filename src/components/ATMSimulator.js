import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ATMSimulator.css';

const ATMSimulator = () => {
  const { userEmail } = useUser();
  const [userName, setUserName] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/users/getUserInfo', {
          params: { email: userEmail },
        });

        if (response.status === 200) {
          const userData = response.data.$values[0];

          if (userData) {
            setUserName(userData.name);
            setCurrentBalance(userData.totalBalance);
          } else {
            console.error('No user data found');
          }
        } else {
          console.error('Failed to fetch user name', response.data);
        }
      } catch (error) {
        console.error('Error fetching user name:', error.response?.data || error.message);
        alert('Could not fetch user name. Please try again.');
      }
    };

    if (userEmail) fetchUserName();
  }, [userEmail]);

  const handleRedirect = (path) => {
    navigate(path);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev); // Toggle profile dropdown
  };

  const handleLogout = () => {
    alert('Log out completed');
    navigate('/');
  };

  return (
    <div className="atm-simulator-container">
      <header className="atm-header">
        <div className="logo">
          {/* Add logo here */}
        </div>

        {/* New Profile and Preferences button */}
        <div className="profile-dropdown-container">
          <button className="profile-button" onClick={toggleProfileDropdown}>Profile and Preferences</button>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <ul>
                <li><button onClick={() => handleRedirect('/changecontactinfo')}>Change contact information</button></li>
                <li><button onClick={() => handleRedirect('/privacy')}>Your privacy</button></li>
                <li><button onClick={() => handleRedirect('/security')}>Security and password</button></li>
                <li><button onClick={() => handleRedirect('/alert-service')}>Alert service</button></li>
                <li><button onClick={() => handleRedirect('/manage-account')}>Manage account access</button></li>
              </ul>
            </div>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </header>

      <h1>Welcome, {userName || 'Guest'}!</h1>
      <p>You can now perform secure transactions, manage your accounts, and view real-time updates.</p>

      <div className="card-info">
        <p>1028</p>
        <div className="balance-section">
          <p>Total Current balance</p>
          <h3>${currentBalance.toFixed(2)}</h3>
        </div>
        <div className="actions">
          <button className="Payments" onClick={() => handleRedirect('/payments')}>Payments</button>
          <button className="More options">More options</button>
        </div>
      </div>

      <div className="atm-buttons">
        <button className="atm-button" onClick={() => handleRedirect('/checking')}>Checking</button>
        <button className="atm-button" onClick={() => handleRedirect('/savings', { state: { email: userEmail } })}>Savings</button>
      </div>

      <div className="tabs-container">
        <button className="tab">Statements</button>
        <button className="tab">Information</button>
        <button className="tab">Benefits</button>
      </div>

    </div>
  );
};

export default ATMSimulator;
