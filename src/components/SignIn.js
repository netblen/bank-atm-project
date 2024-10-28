// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './SignIn.css';

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const navigate = useNavigate();
  const { setUserEmail } = useUser();
  const ROLE_USER = 'User';
  const ROLE_ADMIN = 'Admin';
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7243/api/users/signin', {
        email: signInEmail,
        password: signInPassword,
      });

      if (response.status === 200 ) {
        setUserEmail(signInEmail);
        if (response.data.rol === ROLE_USER) {
          navigate('/atm-simulator'); // Redirige al simulador ATM para usuarios
        } else if (response.data.rol === ROLE_ADMIN) {
          navigate('/admin-dashboard'); // Redirige al panel de administración para administradores
        }
      }else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert(error.response?.data?.message || 'An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      <form onSubmit={handleSignInSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
            required
          />
        </div>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit">Sign In</button>
      </form>
      <div className="create-account">
        <p>Don't have an account? <Link to="/signup">Create new account</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
