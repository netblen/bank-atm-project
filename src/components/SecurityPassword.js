import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './SecurityPassword.css';

const securityQuestions = [
  "What is your mother's maiden name?",
  'What was the name of your first pet?',
  'What is your favorite color?',
  'What is your favorite book?',
  'What is your hometown?',
  'What is your dream job?',
  'What is your favorite movie?',
  'What is your favorite food?',
  'What is your favorite animal?',
];

const SecurityPassword = () => {
  const { userEmail } = useUser();
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userEmail) {
        setMessage('User email is not found. Please log in again.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7243/api/Users/details', {
          params: { email: userEmail },
        });

        setSecurityQuestion(response.data.security_question || '');
        setSecurityAnswer('');
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Error loading user details: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchUserDetails();
  }, [userEmail]);

  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validatePassword(newPassword)) {
      setMessage('Password needs 6+ characters, one uppercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!userEmail) {
      setMessage('User email is not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7243/api/Users/security-password', {
        email: userEmail,
        securityQuestion,
        securityAnswer,
        newPassword,
      });

      if (response.status === 200) {
        alert('Password changed successfully.');
        setSecurityAnswer('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password: ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="security-page">
      <section className="security-shell">
        <div className="security-info">
          <p className="security-eyebrow">Account security</p>
          <h1>Change your password securely.</h1>
          <p>
            Confirm your security question and answer before setting a new password for your account.
          </p>

          <div className="security-rules">
            <span>Uppercase letter</span>
            <span>Number</span>
            <span>Special character</span>
            <span>6+ characters</span>
          </div>
        </div>

        <form className="security-form" onSubmit={handleSubmit}>
          <div className="security-form-heading">
            <span>Password reset</span>
            <h2>Verify and update</h2>
          </div>

          <label className="security-field">
            <span>Security question</span>
            <select value={securityQuestion} onChange={(event) => setSecurityQuestion(event.target.value)} required>
              <option value="">Select Security Question</option>
              {securityQuestions.map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </label>

          <label className="security-field">
            <span>Security answer</span>
            <input
              type="password"
              value={securityAnswer}
              onChange={(event) => setSecurityAnswer(event.target.value)}
              required
            />
          </label>

          <label className="security-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>

          <label className="security-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {message && <p className="security-message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default withAutoLogout(SecurityPassword);
