import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './SecurityPassword.css';
import withAutoLogout from './withAutoLogout';

const SecurityPassword = () => {
  const { userEmail } = useUser();
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userEmail) {
        alert('User email is not found. Please log in again.');
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
        alert('Error loading user details: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchUserDetails();
  }, [userEmail]);

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!validatePassword(newPassword)) {
      alert('Password must contain at least one uppercase letter, one special character, and one number, and be at least 6 characters long.');
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!userEmail) {
      alert('User email is not found. Please log in again.');
      return;
    }

    setLoading(true); // Show loading state

    try {
      const response = await axios.post('https://localhost:7243/api/Users/security-password', {
        email: userEmail,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer, // Send the security answer
        newPassword,
      });

      if (response.status === 200) {
        alert('Password changed successfully.');
        // Reset form or redirect if necessary
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password: ' + (error.response?.data?.message || 'An error occurred. Please try again.'));
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="security-password-form">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Security Question:</label><br />
          <select value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} required>
            <option value="">Select Security Question</option>
            <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
            <option value="What is your favorite color?">What is your favorite color?</option>
            <option value="What is your favorite book?">What is your favorite book?</option>
            <option value="What is your hometown?">What is your hometown?</option>
            <option value="What is your dream job?">What is your dream job?</option>
            <option value="What is your favorite movie?">What is your favorite movie?</option>
            <option value="What is your favorite food?">What is your favorite food?</option>
            <option value="What is your favorite animal?">What is your favorite animal?</option>
          </select>
        </div>
        <div>
          <label>Security Answer:</label><br />
          <input
            type="password" // Change to password type
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
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
        <button type="submit" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default withAutoLogout(SecurityPassword);
