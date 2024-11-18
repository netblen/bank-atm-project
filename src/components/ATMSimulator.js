import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ATMSimulator.css';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const ATMSimulator = () => {
  const { userEmail } = useUser();
  const [userName, setUserName] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [checkingBalance, setCheckingBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
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

    const fetchBalances = async () => {
      try {
        const checkingResponse = await axios.get(`https://localhost:7243/api/users/checkingbalance?email=${userEmail}`);
        const savingsResponse = await axios.get(`https://localhost:7243/api/users/savingsbalance?email=${userEmail}`);

        if (checkingResponse.status === 200) {
          setCheckingBalance(checkingResponse.data.balance);
        }
        if (savingsResponse.status === 200) {
          setSavingsBalance(savingsResponse.data.balance);
        }
      } catch (error) {
        console.error('Error fetching balances:', error.response?.data || error.message);
      }
    };
    if (userEmail) {
      fetchUserName();
      fetchBalances();
    }
  }, [userEmail]);

  const handleRedirect = (path) => {
    navigate(path);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev); 
  };

  const handleLogout = () => {
    const confirmation = window.confirm('Are you sure you want to log out?');
    if (confirmation) {
      alert('Log out completed');
      navigate('/');
    }
  };
  

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  const data = {
    labels: ['Checking', 'Savings'],
    datasets: [
      {
        label: 'Balances',
        data: [checkingBalance, savingsBalance],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div 
      className="atm-simulator-container" 
      variants={container} 
      initial="hidden" 
      animate="visible"
    >
      <header className="atm-header">
        <div className="logo">
          {/* Add logo here */}
        </div>

        <div className="profile-dropdown-container">
          <button className="profile-button" onClick={toggleProfileDropdown}>
            Profile and Preferences
          </button>
          {showProfileDropdown && (
            <motion.div className="profile-dropdown" variants={item}>
              <ul>
                <motion.li variants={item}>
                  <button onClick={() => handleRedirect('/UserEdit')}>Change contact information</button>
                </motion.li>
                <motion.li variants={item}>
                  <button onClick={() => handleRedirect('/security')}>Security and password</button>
                </motion.li>
                <motion.li variants={item}>
                  <button onClick={() => handleRedirect('/Feedback')}>Feedback</button>
                </motion.li>
                <motion.li variants={item}>
                <button onClick={() => handleRedirect('/RecentActivity', { state: { email: userEmail } })}>
                  Recent Activity
                </button>
                </motion.li>

              </ul>
            </motion.div>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </header>
      <h1>
        Welcome, 
        <motion.span 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          {userName || 'Guest'}!
        </motion.span>
      </h1>
      <p>You can now perform secure transactions, manage your accounts, and view real-time updates.</p>

      <div className="card-info">

        <div className="balance-section">
          <p>Total Current balance</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <h3>${currentBalance.toFixed(2)}</h3>
          </motion.h3>
        </div>
        <div className="chart-container">
        <h2>Account Balances</h2>
        <Pie data={data} width={300} height={200} />
        </div>
        <div className="actions">
          <button className="Payments" onClick={() => handleRedirect('/payments')}>Payments</button>
        </div>
      </div>

      <div className="atm-buttons">
        <motion.button className="atm-button" onClick={() => handleRedirect('/checking')} variants={item}>
          Checking
        </motion.button>
        <motion.button className="atm-button" onClick={() => handleRedirect('/savings', { state: { email: userEmail } })} variants={item}>
          Savings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default withAutoLogout(ATMSimulator);
