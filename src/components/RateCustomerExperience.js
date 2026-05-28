// RateCustomerExperience.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './RateCustomerExperience.css';

const RateCustomerExperience = ({ userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7243/api/Users/rate', {
        id: userId,
        rating: Number(rating),
        comment,
      });
      alert('Thank you for your feedback!'); // Mostrar alerta
      navigate('/'); // Redirigir a la página principal
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div>
      <h2>Rate Your Experience</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.2 }}  // Scale up on hover
                whileTap={{ scale: 0.9 }}    // Scale down on tap
                transition={{ duration: 0.2 }} // Animation duration
              >
                ★
              </motion.span>
            ))}
          </div>
          <div>
            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Thank you for your feedback!</p>
      )}
    </div>
  );
};

export default RateCustomerExperience;
