// src/components/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import axios from 'axios'; // Import axios for API calls

const AuthPage = () => {
  // State for Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  // State for Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Handle Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7243/api/users/signin', {
        email: signInEmail,
        password: signInPassword,
      });

      // Check for successful response
      if (response.status === 200) {
        // Assuming you want to store the token for future requests
        // localStorage.setItem('token', response.data.token);
        navigate('/atm-simulator'); // Redirect to ATM simulator page
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert(error.response?.data?.message || 'An error occurred during sign-in. Please try again.');
    }
  };

  // Handle Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://localhost:7243/api/users/signup', {
            username: signUpName, // Change this from "name" to "username"
            email: signUpEmail,
            password: signUpPassword,
        });

        // Check for successful response
        if (response.status === 200) {
            alert('Sign up successful. You can now sign in.');
        } else {
            alert('Sign up failed. Please try again.');
        }
    } catch (error) {
        // Improved error handling to display specific backend errors
        console.error('Error during sign-up:', error);
        alert(error.response?.data?.message || 'An error occurred during sign-up. Please try again.');
    }
  };


  return (
    <div className="auth-container">
      {/* Sign In Form */}
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
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUpSubmit}>
          <div>
            <label>Name:</label><br />
            <input
              type="text"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label><br />
            <input
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
