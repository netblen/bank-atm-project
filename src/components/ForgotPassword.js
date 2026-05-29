import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [contactInfo, setContactInfo] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const email = contactInfo.trim();

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('Password needs 6+ characters, one uppercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('https://localhost:7243/api/users/reset-password', {
        contactInfo: email,
        securityCode: securityCode.trim(),
        newPassword,
      });

      if (response.status === 200) {
        alert('Password changed successfully.');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <section className="forgot-shell">
        <div className="forgot-info">
          <p className="forgot-eyebrow">Account recovery</p>
          <h1>Reset your password securely.</h1>
          <p>
            Confirm your email and recovery code, then create a stronger password for your account.
          </p>

          <div className="forgot-rules">
            <span>Uppercase letter</span>
            <span>Number</span>
            <span>Special character</span>
            <span>6+ characters</span>
          </div>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form-heading">
            <span>Recovery form</span>
            <h2>Create a new password</h2>
          </div>

          <label className="forgot-field">
            <span>Email</span>
            <input
              type="email"
              value={contactInfo}
              onChange={(event) => setContactInfo(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="forgot-field">
            <span>Security code</span>
            <input
              type="text"
              value={securityCode}
              onChange={(event) => setSecurityCode(event.target.value)}
              placeholder="Enter recovery code"
              required
            />
          </label>

          <label className="forgot-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>

          <label className="forgot-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {message && <p className="forgot-message">{message}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>

          <p className="forgot-return">
            Remembered it? <Link to="/signin">Back to sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default ForgotPassword;
