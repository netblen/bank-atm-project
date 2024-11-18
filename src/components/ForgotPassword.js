import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [contactInfo, setContactInfo] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseña
    if (!validatePassword(newPassword)) {
      alert('Password must contain at least one uppercase letter, one special character, and one number, and be at least 6 characters long.');
      return;
    }

    // Confirmación de contraseña
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7243/api/users/reset-password', {
        contactInfo,
        securityCode,
        newPassword,
      });

      if (response.status === 200) {
        alert('Password changed successfully.');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <p>Please enter your email to reset your password.</p>
        <div>
          <label>Email:</label><br />
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Security Code (Enter "E2UY32"):</label><br />
          <input
            type="text"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label><br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
