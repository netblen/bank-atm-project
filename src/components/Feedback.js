import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './Feedback.css';
import withAutoLogout from './withAutoLogout';
import { motion } from 'framer-motion';

const Feedback = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (feedback.trim().length < 10) { 
      setErrorMessage('The comment must be at least 10 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Sending feedback to the server
      await axios.post('https://localhost:7243/api/Users/Feedback', {
        email: userEmail,
        comments: feedback,
      });
      setSuccessMessage('Feedback submitted successfully!');
      setFeedback(''); // Clear the feedback field
      navigate('/atm-simulator'); // Navigate to the ATM simulator page
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage('Error sending feedback: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false); // Set loading state back to false
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
      <h2>Send Your Feedback</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Sending...' : 'Submit Feedback'}
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
