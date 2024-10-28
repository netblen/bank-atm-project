import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Checking.css';

const Checking = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const { userEmail } = useUser();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/checkingsTransactionsByEmail?email=${userEmail}`);
      if (response.data && response.data.$values) {
        setTransactions(response.data.$values);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError(err.response?.data?.title || err.message || 'Error fetching transactions');
    }
  }, [userEmail]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/users/checkingbalance?email=${userEmail}`);
      setCurrentBalance(response.data.balance);
    } catch (err) {
      setError(err.response?.data?.title || err.message || 'Error fetching balance');
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

  const handleTransferToSavings = async () => {
    const transferAmount = parseFloat(amount);

    if (transferAmount <= 0 || transferAmount > currentBalance) {
      setError('Invalid transfer amount. Please enter an amount less than or equal to your current balance.');
      return;
    }

    const confirmTransfer = window.confirm(`Are you sure you want to transfer $${amount} to Savings?`);
    if (confirmTransfer) {
      try {
        await axios.post(`https://localhost:7243/api/ATM/transferBetweenAccountsChecking`, {
          email: userEmail,
          amount: transferAmount,
          description: "Internet Transfer",
          transaction_type: "T"
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

  const handleExecuteTransactionCheckings = async (transaction_type, description) => {
    const transactionAmount = parseFloat(amount);

    if (transaction_type !== "D" && transactionAmount > currentBalance) {
      setError('Invalid amount. Enter an amount less than or equal to your current balance.');
      return;
    }

    if (transactionAmount <= 0) {
      setError('Invalid amount. Please enter an amount greater than zero.');
      return;
    }

    const confirmTransfer = window.confirm(`Are you sure you want to ${transaction_type === "D" ? "deposit" : "withdraw"} $${amount}?`);
    if (confirmTransfer) {
      try {
        await axios.post(`https://localhost:7243/api/ATM/ExecuteTransactionChecking`, {
          email: userEmail,
          amount: transactionAmount,
          description: description,
          transaction_type: transaction_type
        });
  
        await fetchBalance();
        await fetchTransactions();

        setAmount('');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.title || 'Error in transaction');
      }
    }
  };

  return (
    <div className="checkings-container">
      <h1>Checking Account</h1>
      <h2>Account Balance: ${currentBalance.toFixed(2)}</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="transaction-section">
        <h3>Transaction History</h3>
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
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="transaction-form">
        <h3>Transaction Processing</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(null);
          }}
          placeholder="Enter amount"
        />
        <button onClick={handleTransferToSavings} disabled={!amount}>Transfer to Savings</button>
        <button onClick={() => handleExecuteTransactionCheckings('D','Deposit')} disabled={!amount}>Deposit</button>
        <button onClick={() => handleExecuteTransactionCheckings('W','Withdrawal')} disabled={!amount}>Withdrawal</button>
      </div>
    </div>
  );
};

export default Checking;
