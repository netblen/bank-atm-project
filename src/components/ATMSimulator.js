import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './ATMSimulator.css';

Chart.register(ArcElement, Tooltip, Legend);

const ATMSimulator = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [checkingBalance, setCheckingBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/users/getUserInfo', {
          params: { email: userEmail },
        });

        const userData = response.data.$values?.[0];

        if (response.status === 200 && userData) {
          setUserName(userData.name);
          setCurrentBalance(userData.totalBalance);
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

  const handleRedirect = (path, options) => {
    navigate(path, options);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  const handleLogout = () => {
    const confirmation = window.confirm('Are you sure you want to log out?');
    if (confirmation) {
      alert('Log out completed');
      navigate('/');
    }
  };

  const chartData = {
    labels: ['Checking', 'Savings'],
    datasets: [
      {
        label: 'Balances',
        data: [checkingBalance, savingsBalance],
        backgroundColor: ['#2a9d8f', '#d8aa3c'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#17211d',
          font: { weight: 700 },
          boxWidth: 12,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <motion.main
      className="atm-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <section className="atm-dashboard">
        <header className="atm-dashboard-header">
          <div>
            <p className="atm-eyebrow">ATM dashboard</p>
            <h1>
              Welcome, <span>{userName || 'Guest'}</span>
            </h1>
            <p>Manage account balances, payments, learning tools, and security tasks from one place.</p>
          </div>

          <div className="atm-header-actions">
            <div className="atm-menu">
              <button type="button" onClick={() => toggleDropdown('profile')}>
                Profile
              </button>
              {openDropdown === 'profile' && (
                <div className="atm-dropdown">
                  <button type="button" onClick={() => handleRedirect('/UserEdit')}>
                    Contact information
                  </button>
                  <button type="button" onClick={() => handleRedirect('/security')}>
                    Security and password
                  </button>
                  <button type="button" onClick={() => handleRedirect('/FeedbacknIssueReports')}>
                    Feedback and issues
                  </button>
                  <button type="button" onClick={() => handleRedirect('/RecentActivity', { state: { email: userEmail } })}>
                    Recent activity
                  </button>
                  <button type="button" onClick={() => handleRedirect('/Survey')}>
                    Survey
                  </button>
                  <button type="button" onClick={() => handleRedirect('/FinancialGoals')}>
                    Financial goals
                  </button>
                </div>
              )}
            </div>

            <div className="atm-menu">
              <button type="button" onClick={() => toggleDropdown('learning')}>
                Learning
              </button>
              {openDropdown === 'learning' && (
                <div className="atm-dropdown">
                  <button type="button" onClick={() => handleRedirect('/TransactionGlossary')}>
                    Transaction glossary
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        'You are about to be redirected to a PDF on Financial Literacy. Do you wish to continue?'
                      );
                      if (confirmed) {
                        window.open('https://lincs.ed.gov/sites/default/files/TSTMFinancLiterBrief-rev-508.pdf', '_blank');
                      }
                    }}
                  >
                    Financial literacy
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="atm-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <section className="atm-overview">
          <article className="atm-balance-card">
            <span>Total current balance</span>
            <strong>${currentBalance.toFixed(2)}</strong>
            <p>Combined balance across your available accounts.</p>
          </article>

          <article className="atm-balance-card">
            <span>Checking</span>
            <strong>${checkingBalance.toFixed(2)}</strong>
            <p>Use checking for bills, transfers, and everyday spending.</p>
          </article>

          <article className="atm-balance-card">
            <span>Savings</span>
            <strong>${savingsBalance.toFixed(2)}</strong>
            <p>Track savings goals and protected account funds.</p>
          </article>
        </section>

        <section className="atm-main-grid">
          <article className="atm-chart-card">
            <div>
              <p className="atm-eyebrow">Balances</p>
              <h2>Account split</h2>
            </div>
            <div className="atm-chart">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </article>

          <article className="atm-actions-card">
            <p className="atm-eyebrow">Quick actions</p>
            <h2>Choose your next task.</h2>
            <div className="atm-action-grid">
              <button type="button" onClick={() => handleRedirect('/checking')}>
                Checking
              </button>
              <button type="button" onClick={() => handleRedirect('/savings', { state: { email: userEmail } })}>
                Savings
              </button>
              <button type="button" onClick={() => handleRedirect('/payments')}>
                Payments
              </button>
              <button type="button" onClick={() => handleRedirect('/RecentActivity')}>
                Activity
              </button>
              <button type="button" onClick={() => handleRedirect('/FinancialGoals')}>
                Financial goals
              </button>
            </div>
          </article>
        </section>
      </section>
    </motion.main>
  );
};

export default withAutoLogout(ATMSimulator);
