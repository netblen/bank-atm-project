import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './FeedbacknIssueReports.css';
import withAutoLogout from './withAutoLogout';
import { motion } from 'framer-motion';

const Feedback = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [issueType, setIssueType] = useState('feedback'); // 'feedback' or 'technical-issue'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (feedback.trim().length < 10) {
      setErrorMessage('The comment must be at least 10 characters long.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://localhost:7243/api/Users/Feedback', {
        email: userEmail,
        comments: feedback,
        type: issueType,
      });

      setSuccessMessage(
        issueType === 'feedback' 
          ? 'Feedback submitted successfully!' 
          : 'Technical issue reported successfully!'
      );
      alert(
        issueType === 'feedback' 
          ? 'Thank you for your feedback!' 
          : 'Your technical issue has been reported!'
      );
      setFeedback('');
      navigate('/atm-simulator');
    } catch (error) {
      console.error('Error submitting:', error);
      setErrorMessage('Error sending: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="feedback-form"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Send Your Feedback or Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="feedback">Feedback</option>
            <option value="technical-issue">Report Technical Issue</option>
          </select>
        </label>

        <motion.textarea
          name="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          placeholder="Write your comment here..."
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? 'Sending...' : 'Submit'}
        </motion.button>

        {errorMessage && (
          <motion.div 
            className="message error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}
        {successMessage && (
          <motion.div 
            className="message success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {successMessage}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default withAutoLogout(Feedback);
