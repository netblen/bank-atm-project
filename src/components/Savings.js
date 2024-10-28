import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Savings.css';

const Savings = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const { userEmail } = useUser();
  const [currentBalance, setCurrentBalance] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/savingstransactionsByEmail?email=${userEmail}`);
      setTransactions(response.data.$values || []);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching transactions');
    }
  }, [userEmail]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/savingsbalance?email=${userEmail}`);
      setCurrentBalance(response.data.balance);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching balance');
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setError('User email not found.');
      return;
    }
    fetchTransactions();
    fetchBalance();
  }, [userEmail, fetchTransactions, fetchBalance]);

  const handleTransferToChecking = async () => {
    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0 || transferAmount > currentBalance) {
      setError('Invalid transfer amount. Please enter a valid amount within your balance.');
      return;
    }

    const confirmTransfer = window.confirm(`Are you sure you want to transfer $${amount} to Checking?`);
    if (confirmTransfer) {
      try {
        await axios.post(`https://localhost:7243/api/ATM/transferBetweenAccountsSavings`, {
          email: userEmail,
          amount: transferAmount,
          description: "Internet Transfer",
          transaction_type: "Transfer"
        });

        await fetchBalance();
        await fetchTransactions();

        setAmount('');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.title || 'Error transferring funds');
      }
    }
  };

  return (
    <div className="savings-container">
      <h1>Savings Account</h1>
      <h2>Account Balance: ${Number.isFinite(currentBalance) ? currentBalance.toFixed(2) : 'Loading...'}</h2>
      
      {error && <div className="error-message">{error}</div>} {/* Mostrar mensaje de error */}

      <div className="transaction-section">
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td>{transaction.transactionType}</td>
                <td>${transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="transaction-form">
        <h3>Transfer Funds</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button onClick={handleTransferToChecking} disabled={!amount || parseFloat(amount) <= 0}>
          Transfer to Checking
        </button>
      </div>
    </div>
  );
};

export default Savings;