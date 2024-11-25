import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Savings.css';
import Papa from 'papaparse';
import withAutoLogout from './withAutoLogout';


const Savings = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const { userEmail } = useUser();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionCount, setTransactionCount] = useState(0);
  const transactionLimit = 12;

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

  const fetchTransactionCount = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/savingsTransactionCount`, {
        params: { email: userEmail },
      });
      setTransactionCount(response.data.count);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching transaction count');
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setError('User email not found.');
      return;
    }
    fetchTransactions();
    fetchBalance();
    fetchTransactionCount(); 
  }, [userEmail, fetchTransactions, fetchBalance, fetchTransactionCount]);

  const handleTransferToChecking = async () => {
    const transactionCountResponse = await axios.get(`https://localhost:7243/api/users/savingsTransactionCount`, {
      params: { email: userEmail },
    });

     // Límite de transacciones mensuales
    const currentTransactionCount = transactionCountResponse.data.count;

    if (currentTransactionCount >= transactionLimit) {
      alert('You have reached the transaction limit for this month.');      
      return;
    }

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0 || transferAmount > currentBalance) {
      alert('Invalid transfer amount. Please enter a valid amount within your balance.');
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
        await fetchTransactionCount();

        setAmount('');
        alert('Transfer successful!');
      } catch (err) {
        setError(err.response?.data?.title || 'Error transferring funds');
      }
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get('https://localhost:7243/api/ATM/filterTransactionsByDateSavings', {
        params: {
          email: userEmail,
          startDate,
          endDate,
        },
      });
      setTransactions(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const exportToCSV = () => {
    const csvData = transactions.map(transaction => ({
      Date: new Date(transaction.transactionDate).toLocaleDateString(),
      Description: transaction.description,
      Amount: transaction.amount.toFixed(2)
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="savings-container">
      <h1>Savings Account</h1>
      <h2>Account Balance: ${Number.isFinite(currentBalance) ? currentBalance.toFixed(2) : 'Loading...'}</h2>
      
      <div className="transaction-info">
        <h3>Transaction Info</h3>
        <p>Transactions this month: {transactionCount}/{transactionLimit}</p>
        {transactionCount >= transactionLimit && (
          <p className="alert-message">
            <strong>Alert:</strong> You have reached your monthly transaction limit!
          </p>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}

      <div className="transaction-section">
        <h3>Transaction History</h3>
        <div>
          <label>Start Date:</label>
          <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
        <button onClick={exportToCSV} disabled={!startDate || !endDate || transactions.length === 0}>
          Export to CSV
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
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

export default withAutoLogout(Savings);
