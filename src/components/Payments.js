import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './Payments.css';

const billOptions = ['Fido', 'Netflix', 'Membership'];

const Payments = () => {
  const { userEmail } = useUser();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [billType, setBillType] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (!userEmail) {
      setError('User email not found.');
      return;
    }

    fetchBalance();
  }, [userEmail, fetchBalance]);

  const handlePayment = async (event) => {
    event.preventDefault();
    setMessage('');
    setError(null);

    const transactionAmount = parseFloat(amount);

    if (!billType) {
      setError('Please select a bill type.');
      return;
    }

    if (Number.isNaN(transactionAmount) || transactionAmount <= 0) {
      setError('Please enter an amount greater than zero.');
      return;
    }

    if (transactionAmount > currentBalance) {
      setError('Enter an amount less than or equal to your checking balance.');
      return;
    }

    const confirmTransfer = window.confirm(`Are you sure you want to pay $${transactionAmount.toFixed(2)} for ${billType}?`);
    if (!confirmTransfer) return;

    try {
      setIsProcessing(true);
      await axios.post('https://localhost:7243/api/ATM/ExecuteTransactionChecking', {
        email: userEmail,
        amount: transactionAmount,
        description: `Payment - ${billType}`,
        transaction_type: 'P',
      });

      await fetchBalance();
      setAmount('');
      setBillType('');
      setMessage(`The payment of $${transactionAmount.toFixed(2)} for ${billType} was successful.`);
    } catch (err) {
      setError(err.response?.data?.title || 'Error processing payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="payments-page">
      <section className="payments-shell">
        <div className="payments-info">
          <p className="payments-eyebrow">Bill payment</p>
          <h1>Pay bills from checking.</h1>
          <p>Select a bill, confirm the amount, and the payment will be processed as a checking transaction.</p>
          <div className="payments-balance-card">
            <span>Checking balance</span>
            <strong>${currentBalance.toFixed(2)}</strong>
          </div>
        </div>

        <form className="payments-form" onSubmit={handlePayment}>
          <div className="payments-form-heading">
            <span>Payment details</span>
            <h2>Complete payment</h2>
          </div>

          <label className="payments-field">
            <span>Bill type</span>
            <select value={billType} onChange={(event) => setBillType(event.target.value)} required>
              <option value="">Choose a bill type</option>
              {billOptions.map((bill) => (
                <option key={bill} value={bill}>
                  {bill}
                </option>
              ))}
            </select>
          </label>

          <label className="payments-field">
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError(null);
                setMessage('');
              }}
              placeholder="Enter amount"
              required
            />
          </label>

          {(error || message) && (
            <p className={`payments-message ${error ? 'is-error' : 'is-success'}`}>
              {error || message}
            </p>
          )}

          <button type="submit" disabled={!amount || !billType || isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay bill'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default withAutoLogout(Payments);
