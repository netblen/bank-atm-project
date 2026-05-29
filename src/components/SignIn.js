// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './SignIn.css';

const SignIn = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserEmail } = useUser();
  const ROLE_USER = 'User';
  const ROLE_ADMIN = 'Admin';

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7243/api/users/signin', {
        email: signInEmail.trim(),
        password: signInPassword,
      });

      if (response.status === 200) {
        setUserEmail(signInEmail.trim());
        const userRole = response.data.rol || response.data.role;

        if (userRole === ROLE_USER) {
          navigate('/atm-simulator');
        } else if (userRole === ROLE_ADMIN) {
          navigate('/adminDashboard');
        } else {
          alert('Unrecognized role.');
        }
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      if (error.response?.status === 401) {
        alert('Invalid email or password. Create an account first if this is a new database.');
      } else {
        alert(error.response?.data?.message || 'An error occurred during sign-in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-signin" aria-labelledby="signin-title">
        <div className="auth-visual" aria-hidden="true">
          <p className="auth-kicker">Secure access</p>
          <h1>Welcome back to your banking simulator.</h1>
          <div className="auth-device">
            <div className="auth-device-header">
              <span>Current balance</span>
              <strong>$4,280.50</strong>
            </div>
            <div className="auth-progress">
              <span></span>
            </div>
            <div className="auth-device-row">
              <span>Checking</span>
              <strong>Ready</strong>
            </div>
            <div className="auth-device-row">
              <span>Savings</span>
              <strong>Protected</strong>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <p>Account access</p>
            <h2 id="signin-title">Sign in</h2>
            <span>Use your simulator credentials to continue.</span>
          </div>

          <form onSubmit={handleSignInSubmit} className="auth-fields">
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            <div className="auth-row">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            New to the simulator? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
