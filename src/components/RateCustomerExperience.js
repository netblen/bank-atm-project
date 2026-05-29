import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './RateCustomerExperience.css';

const ratingLabels = {
  1: 'Needs attention',
  2: 'Could be better',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

const RateCustomerExperience = ({ userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!rating) {
      setMessage('Please choose a rating before submitting.');
      return;
    }

    if (comment.trim().length < 8) {
      setMessage('Please add a short comment with at least 8 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('https://localhost:7243/api/Users/rate', {
        id: userId,
        rating: Number(rating),
        comment: comment.trim(),
      });

      alert('Thank you for your feedback!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Could not submit your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="experience-page">
      <section className="experience-shell">
        <motion.div
          className="experience-info"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="experience-eyebrow">Customer experience</p>
          <h1>Your feedback helps improve every banking session.</h1>
          <p>
            Rate the simulator and share what worked well or what should feel smoother next time.
          </p>

          <div className="experience-summary">
            <div>
              <strong>5</strong>
              <span>Rating levels</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>One minute feedback</span>
            </div>
          </div>
        </motion.div>

        <motion.form
          className="experience-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="experience-form-heading">
            <span>Rate your visit</span>
            <h2>How did it feel?</h2>
          </div>

          <fieldset className="experience-rating">
            <legend>Select a rating</legend>
            <div className="experience-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  className={`experience-star ${star <= rating ? 'is-filled' : ''}`}
                  aria-label={`${star} out of 5`}
                  onClick={() => setRating(star)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.15 }}
                >
                  &#9733;
                </motion.button>
              ))}
            </div>
            <p>{rating ? ratingLabels[rating] : 'No rating selected yet'}</p>
          </fieldset>

          <label className="experience-field">
            <span>Comment</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what made the experience easy or what could be better..."
              maxLength={500}
            />
          </label>

          <div className="experience-meta">
            <span>{comment.trim().length}/500 characters</span>
          </div>

          {message && <p className="experience-message">{message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit feedback'}
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default RateCustomerExperience;
