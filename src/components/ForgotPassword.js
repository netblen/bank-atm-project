import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importa el hook useNavigate
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [contactInfo, setContactInfo] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();  // Crea una instancia del hook para navegar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7243/api/users/forgot-password', {
        contactInfo,
      });

      if (response.status === 200) {
        setCodeSent(true);
        setMessage('A security code has been sent to your email or mobile number.');
      }
    } catch (error) {
      console.error('Error sending security code:', error);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    console.log('Entered security code:', securityCode);
    // Aquí va la lógica para verificar el código...
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <p>Please enter your email or mobile number to search for your account.</p>
        <div>
          <label>Email / Mobile Number:</label><br />
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="button" onClick={() => navigate('/signin')} className="back-button">
            ←
          </button>
          <button type="submit">Send Security Code</button>
        </div>
      </form>
      {codeSent && (
        <form onSubmit={handleVerifyCode}>
          <div>
            <label>Security Code:</label><br />
            <input
              type="text"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify Code</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
