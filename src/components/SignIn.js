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

      console.log(response.data); // Verifica qué datos recibes

      if (response.status === 200) {
        setUserEmail(signInEmail);
        const userRole = response.data.rol || response.data.role; // Asegúrate de que este sea el campo correcto

        if (userRole === ROLE_USER) {
          navigate('/atm-simulator'); // Redirige al simulador ATM para usuarios
        } else if (userRole === ROLE_ADMIN) {
          navigate('/adminDashboard'); // Redirige al panel de administración para administradores
        } else {
          alert('Unrecognized role.'); // Manejo de roles no reconocidos
        }
      } else {
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
