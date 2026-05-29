import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './Savings.css';

const transactionLimit = 12;

const Savings = () => {
  const { userEmail } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionCount, setTransactionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/savingstransactionsByEmail?email=${userEmail}`);
      setTransactions(response.data.$values || []);
      setError(null);
    } catch (err) {
      setTransactions([]);
      setError(err.response?.data?.title || 'No savings transactions found yet.');
    }
  }, [userEmail]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/savingsbalance?email=${userEmail}`);
      setCurrentBalance(response.data.balance || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching balance');
    }
  }, [userEmail]);

  const fetchTransactionCount = useCallback(async () => {
    try {
      const response = await axios.get('https://localhost:7243/api/users/savingsTransactionCount', {
        params: { email: userEmail },
      });
      setTransactionCount(response.data.count || 0);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching transaction count');
    }
  }, [userEmail]);

  useEffect(() => {
    const loadAccount = async () => {
      if (!userEmail) {
        setError('User email not found.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchBalance(), fetchTransactionCount()]);
      setIsLoading(false);
    };

    loadAccount();
  }, [userEmail, fetchTransactions, fetchBalance, fetchTransactionCount]);

  const handleTransferToChecking = async () => {
    const transferAmount = parseFloat(amount);

    if (transactionCount >= transactionLimit) {
      setError('You have reached the transaction limit for this month.');
      return;
    }

    if (Number.isNaN(transferAmount) || transferAmount <= 0 || transferAmount > currentBalance) {
      setError('Please enter a valid amount within your savings balance.');
      return;
    }

    const confirmTransfer = window.confirm(`Are you sure you want to transfer $${transferAmount.toFixed(2)} to Checking?`);
    if (!confirmTransfer) return;

    try {
      setIsProcessing(true);
      await axios.post('https://localhost:7243/api/ATM/transferBetweenAccountsSavings', {
        email: userEmail,
        amount: transferAmount,
        description: 'Internet Transfer',
        transaction_type: 'Transfer',
      });

      await Promise.all([fetchBalance(), fetchTransactions(), fetchTransactionCount()]);
      setAmount('');
      setError(null);
      setSuccess('Transfer to checking completed.');
    } catch (err) {
      setError(err.response?.data?.title || 'Error transferring funds');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      await fetchTransactions();
      setError(null);
      return;
    }

    try {
      const response = await axios.get('https://localhost:7243/api/ATM/filterTransactionsByDateSavings', {
        params: {
          email: userEmail,
          startDate,
          endDate,
        },
      });
      const filteredTransactions = response.data.$values || [];
      setTransactions(filteredTransactions);
      setError(filteredTransactions.length === 0 ? 'No savings transactions found for that date range.' : null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('An error occurred while fetching transactions.');
    }
  };

  const exportToCSV = () => {
    const csvData = transactions.map((transaction) => ({
      Date: new Date(transaction.transactionDate).toLocaleDateString(),
      Description: transaction.description || transaction.transactionType,
      Amount: Number(transaction.amount || 0).toFixed(2),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'savings-transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const remainingTransactions = Math.max(transactionLimit - transactionCount, 0);

  return (
    <main className="savings-page">
      <section className="savings-shell">
        <header className="savings-header">
          <div>
            <p className="savings-eyebrow">Savings account</p>
            <h1>Protect savings while staying flexible.</h1>
            <p>Track monthly transfer limits, move funds to checking, and review savings history.</p>
          </div>
          <div className="savings-balance-card">
            <span>Available balance</span>
            <strong>${currentBalance.toFixed(2)}</strong>
          </div>
        </header>

        {(error || success) && (
          <div className={`savings-message ${error ? 'is-error' : 'is-success'}`}>
            {error || success}
          </div>
        )}

        <section className="savings-grid">
          <article className="savings-panel">
            <div className="savings-panel-heading">
              <span>Monthly limit</span>
              <h2>{remainingTransactions} transfers left</h2>
            </div>
            <div className="savings-limit-bar">
              <span style={{ width: `${Math.min((transactionCount / transactionLimit) * 100, 100)}%` }} />
            </div>
            <p className="savings-muted">
              Transactions this month: {transactionCount}/{transactionLimit}
            </p>

            <label className="savings-field">
              <span>Transfer amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError(null);
                  setSuccess('');
                }}
                placeholder="Enter amount"
              />
            </label>

            <button
              type="button"
              className="savings-transfer-button"
              onClick={handleTransferToChecking}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing || transactionCount >= transactionLimit}
            >
              Transfer to checking
            </button>
          </article>

          <article className="savings-panel savings-history">
            <div className="savings-panel-heading">
              <span>History</span>
              <h2>Savings transactions</h2>
            </div>

            <div className="savings-filters">
              <label>
                <span>Start date</span>
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </label>
              <label>
                <span>End date</span>
                <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </label>
              <button type="button" onClick={handleFilter}>
                Filter
              </button>
              <button type="button" onClick={exportToCSV} disabled={transactions.length === 0}>
                Export CSV
              </button>
            </div>

            {isLoading ? (
              <p className="savings-empty">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="savings-table-wrap">
                <table className="savings-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                        <td>{transaction.description || transaction.transactionType}</td>
                        <td>${Number(transaction.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="savings-empty">No savings transactions to display.</p>
            )}
          </article>
        </section>
      </section>
    </main>
  );
};

export default withAutoLogout(Savings);
