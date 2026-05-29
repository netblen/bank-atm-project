import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './FeedbacknIssueReports.css';

const Feedback = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [issueType, setIssueType] = useState('feedback');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        comments: feedback.trim(),
        type: issueType,
      });

      const success =
        issueType === 'feedback' ? 'Feedback submitted successfully!' : 'Technical issue reported successfully!';
      setSuccessMessage(success);
      alert(issueType === 'feedback' ? 'Thank you for your feedback!' : 'Your technical issue has been reported!');
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
    <main className="feedback-page">
      <section className="feedback-shell">
        <motion.div
          className="feedback-info"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="feedback-eyebrow">Support center</p>
          <h1>Send feedback or report an issue.</h1>
          <p>
            Share what worked well or describe the technical problem you found so the support team
            can review it.
          </p>
        </motion.div>

        <motion.form
          className="feedback-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="feedback-form-heading">
            <span>Message type</span>
            <h2>What would you like to send?</h2>
          </div>

          <label className="feedback-field">
            <span>Category</span>
            <select value={issueType} onChange={(event) => setIssueType(event.target.value)} required>
              <option value="feedback">Feedback</option>
              <option value="technical-issue">Report Technical Issue</option>
            </select>
          </label>

          <label className="feedback-field">
            <span>Comment</span>
            <textarea
              name="feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              required
              maxLength={600}
              placeholder="Write your comment here..."
            />
          </label>

          <div className="feedback-meta">
            <span>{feedback.trim().length}/600 characters</span>
          </div>

          {errorMessage && <p className="feedback-message error">{errorMessage}</p>}
          {successMessage && <p className="feedback-message success">{successMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Submit message'}
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default withAutoLogout(Feedback);
