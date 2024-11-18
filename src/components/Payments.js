import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from './UserContext';
import './Payments.css';
import axios from 'axios';
import withAutoLogout from './withAutoLogout';


const Payments = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [billType, setBillType] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { userEmail } = useUser();
  const [error, setError] = useState(null);

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
    fetchBalance();
  }, [userEmail, fetchBalance]);

  const handlePayment = async (transaction_type, description, event) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
  
    const transactionAmount = parseFloat(amount);
  
    if (transaction_type !== "D" && transactionAmount > currentBalance) {
      setError('Invalid amount. Enter an amount less than or equal to your current balance.');
      return;
    }
  
    if (transactionAmount <= 0) {
      setError('Invalid amount. Please enter an amount greater than zero.');
      return;
    }
  
    const confirmTransfer = window.confirm(`Are you sure you want to ${transaction_type === "D" ? "deposit" : "pay"} $${amount}?`);
    if (confirmTransfer) {
      try {
        await axios.post(`https://localhost:7243/api/ATM/ExecuteTransactionChecking`, {
          email: userEmail,
          amount: transactionAmount,
          description: description,
          transaction_type: transaction_type
        });
  
        await fetchBalance();
        setAmount('');
        setError(null);
        alert(`The payment of $${transactionAmount} for ${billType} was successful!`); // Alert user about the successful payment
      } catch (err) {
        setError(err.response?.data?.title || 'Error in transaction');
      }
    }
  };
  

  return (
    <div className="payment-container">
      <h1>Bill Payment Simulator</h1>
      <form className="payment-form">
        <div className="form-group">
          <label htmlFor="accountId">Only from your Checking account you can pay!</label>
        </div>

        <div className="form-group">
          <label htmlFor="billType">Select Bill Type:</label>
          <select
            id="billType"
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            required
          >
            <option value="">Choose a bill type</option>
            <option value="Fido">Fido</option>
            <option value="Netflix">Netflix</option>
            <option value="Membership">Membership</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <button onClick={(e) => handlePayment('P', 'Payments', e)} disabled={!amount}>Payments</button>
      </form>

      {message && <div className="payment-message">{message}</div>}
    </div>
  );
};

export default withAutoLogout(Payments);
