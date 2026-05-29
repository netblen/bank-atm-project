import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './Checking.css';

const Checking = () => {
  const { userEmail } = useUser();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/checkingsTransactionsByEmail?email=${userEmail}`);
      setTransactions(response.data?.$values || []);
      setError(null);
    } catch (err) {
      setTransactions([]);
      setError(err.response?.data?.title || err.message || 'Error fetching transactions');
    }
  }, [userEmail]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/checkingbalance?email=${userEmail}`);
      setCurrentBalance(response.data.balance || 0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.title || err.message || 'Error fetching balance');
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
      await Promise.all([fetchTransactions(), fetchBalance()]);
      setIsLoading(false);
    };

    loadAccount();
  }, [userEmail, fetchTransactions, fetchBalance]);

  const refreshAccount = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  const validateAmount = (allowOverBalance = false) => {
    const transactionAmount = parseFloat(amount);

    if (Number.isNaN(transactionAmount) || transactionAmount <= 0) {
      setError('Please enter an amount greater than zero.');
      return null;
    }

    if (!allowOverBalance && transactionAmount > currentBalance) {
      setError('Enter an amount less than or equal to your current balance.');
      return null;
    }

    return transactionAmount;
  };

  const handleTransferToSavings = async () => {
    const transferAmount = validateAmount(false);
    if (!transferAmount) return;

    const confirmTransfer = window.confirm(`Are you sure you want to transfer $${transferAmount.toFixed(2)} to Savings?`);
    if (!confirmTransfer) return;

    try {
      setIsProcessing(true);
      await axios.post('https://localhost:7243/api/ATM/transferBetweenAccountsChecking', {
        email: userEmail,
        amount: transferAmount,
        description: 'Internet Transfer',
        transaction_type: 'T',
      });

      await refreshAccount();
      setAmount('');
      setError(null);
      setSuccess('Transfer to savings completed.');
    } catch (err) {
      setError(err.response?.data?.title || 'Error transferring funds');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteTransactionCheckings = async (transactionType, description) => {
    const transactionAmount = validateAmount(transactionType === 'D');
    if (!transactionAmount) return;

    const action = transactionType === 'D' ? 'deposit' : 'withdraw';
    const confirmTransfer = window.confirm(`Are you sure you want to ${action} $${transactionAmount.toFixed(2)}?`);
    if (!confirmTransfer) return;

    try {
      setIsProcessing(true);
      await axios.post('https://localhost:7243/api/ATM/ExecuteTransactionChecking', {
        email: userEmail,
        amount: transactionAmount,
        description,
        transaction_type: transactionType,
      });

      await refreshAccount();
      setAmount('');
      setError(null);
      setSuccess(`${description} completed.`);
    } catch (err) {
      setError(err.response?.data?.title || 'Error in transaction');
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
      const response = await axios.get('https://localhost:7243/api/ATM/filterTransactionsByDateChecking', {
        params: {
          email: userEmail,
          startDate,
          endDate,
        },
      });
      const filteredTransactions = response.data.$values || [];
      setTransactions(filteredTransactions);
      setError(filteredTransactions.length === 0 ? 'No checking transactions found for that date range.' : null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('An error occurred while fetching transactions.');
    }
  };

  const exportToCSV = () => {
    const csvData = transactions.map((transaction) => ({
      Date: new Date(transaction.transactionDate).toLocaleDateString(),
      Description: transaction.description,
      Amount: Number(transaction.amount || 0).toFixed(2),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'checking-transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="checking-page">
      <section className="checking-shell">
        <header className="checking-header">
          <div>
            <p className="checking-eyebrow">Checking account</p>
            <h1>Manage everyday transactions.</h1>
            <p>Deposit, withdraw, transfer to savings, and review account history from one focused workspace.</p>
          </div>
          <div className="checking-balance-card">
            <span>Available balance</span>
            <strong>${currentBalance.toFixed(2)}</strong>
          </div>
        </header>

        {(error || success) && (
          <div className={`checking-message ${error ? 'is-error' : 'is-success'}`}>
            {error || success}
          </div>
        )}

        <section className="checking-grid">
          <article className="checking-panel">
            <div className="checking-panel-heading">
              <span>Transaction processing</span>
              <h2>Move money</h2>
            </div>

            <label className="checking-field">
              <span>Amount</span>
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

            <div className="checking-actions">
              <button type="button" onClick={handleTransferToSavings} disabled={!amount || isProcessing}>
                Transfer to savings
              </button>
              <button
                type="button"
                onClick={() => handleExecuteTransactionCheckings('D', 'Deposit')}
                disabled={!amount || isProcessing}
              >
                Deposit
              </button>
              <button
                type="button"
                onClick={() => handleExecuteTransactionCheckings('W', 'Withdrawal')}
                disabled={!amount || isProcessing}
              >
                Withdraw
              </button>
            </div>
          </article>

          <article className="checking-panel checking-history">
            <div className="checking-panel-heading">
              <span>History</span>
              <h2>Checking transactions</h2>
            </div>

            <div className="checking-filters">
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
              <p className="checking-empty">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="checking-table-wrap">
                <table className="checking-table">
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
                        <td>{transaction.description}</td>
                        <td>${Number(transaction.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="checking-empty">No checking transactions to display.</p>
            )}
          </article>
        </section>
      </section>
    </main>
  );
};

export default withAutoLogout(Checking);
