import React, { useState } from 'react';
import './Payments.css';

const Payments = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    if (cardNumber && amount) {
      setMessage(`Payment of $${amount} was successful!`);
    } else {
      setMessage('Please enter valid card details and amount.');
    }
  };

  return (
    <div className="payment-container">
      <h1>ATM Payment Simulator</h1>
      <form className="payment-form" onSubmit={handlePayment}>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter your card number"
            maxLength="16"
            required
          />
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

        <button type="submit" className="submit-btn">Pay</button>
      </form>

      {message && <div className="payment-message">{message}</div>}
    </div>
  );
};

export default Payments;
