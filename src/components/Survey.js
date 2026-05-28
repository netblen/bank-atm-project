import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';  // Import framer-motion
import './Survey.css';

const Survey = () => {
  const [userId] = useState(1); // Este valor debe ser dinámico, por ejemplo, basado en el usuario logueado.
  const [satisfactionLevel, setSatisfactionLevel] = useState('');
  const [usageFrequency, setUsageFrequency] = useState('');
  const [locationConvenience, setLocationConvenience] = useState('');
  const [frequentlyUsedServices, setFrequentlyUsedServices] = useState([]);
  const [transactionSpeedSatisfaction, setTransactionSpeedSatisfaction] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setFrequentlyUsedServices((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://localhost:7243/api/Users/survey-yes`,
        null,
        {
          params: {
            userId,
            satisfactionLevel,
            usageFrequency,
            locationConvenience,
            frequentlyUsedServices: frequentlyUsedServices.join(','),
            transactionSpeedSatisfaction,
          },
      });

      if (response.status === 200) {
        setSuccessMessage('Survey response saved successfully.');
        alert('Thank you for completing the survey!');
        navigate('/atm-simulator');
      }
    } catch (err) {
      setError('Error submitting survey. Please try again.');
    }
  };

  return (
    <motion.div
      className="survey-container"
      initial={{ opacity: 0 }}  // Initial state: invisible
      animate={{ opacity: 1 }}  // Animate to fully visible
      transition={{ duration: 1 }}  // Duration of the animation
    >
      <h1>Customer Satisfaction Survey</h1>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: -100 }}  // Start from above the screen
        animate={{ y: 0 }}  // Animate to the normal position
        transition={{ duration: 0.5 }}
      >
        <div className="form-group">
          <label>1. How satisfied are you with the overall ATM service?</label>
          <select value={satisfactionLevel} onChange={(e) => setSatisfactionLevel(e.target.value)} required>
            <option value="">Select</option>
            <option value="1">Very satisfied</option>
            <option value="2">Satisfied</option>
            <option value="3">Neutral</option>
            <option value="4">Dissatisfied</option>
            <option value="5">Very dissatisfied</option>
          </select>
        </div>

        <div className="form-group">
          <label>2. How often do you use the ATM services?</label>
          <select value={usageFrequency} onChange={(e) => setUsageFrequency(e.target.value)} required>
            <option value="">Select</option>
            <option value="1">Multiple times a week</option>
            <option value="2">Once a week</option>
            <option value="3">Multiple times a month</option>
            <option value="4">Once a month</option>
            <option value="5">Less than once a month</option>
          </select>
        </div>

        <div className="form-group">
          <label>3. How convenient are the ATM locations for you?</label>
          <select value={locationConvenience} onChange={(e) => setLocationConvenience(e.target.value)} required>
            <option value="">Select</option>
            <option value="1">Very convenient</option>
            <option value="2">Somewhat convenient</option>
            <option value="3">Neutral</option>
            <option value="4">Not very convenient</option>
            <option value="5">Not at all convenient</option>
          </select>
        </div>

        <div className="form-group">
          <label>4. Which of the following services do you frequently use at the ATM? (Select all that apply)</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="1"
                onChange={handleCheckboxChange}
                checked={frequentlyUsedServices.includes('1')}
              />{' '}
              Cash withdrawal
            </label>
            <label>
              <input
                type="checkbox"
                value="2"
                onChange={handleCheckboxChange}
                checked={frequentlyUsedServices.includes('2')}
              />{' '}
              Balance inquiry
            </label>
            <label>
              <input
                type="checkbox"
                value="3"
                onChange={handleCheckboxChange}
                checked={frequentlyUsedServices.includes('3')}
              />{' '}
              Fund transfer
            </label>
            <label>
              <input
                type="checkbox"
                value="4"
                onChange={handleCheckboxChange}
                checked={frequentlyUsedServices.includes('4')}
              />{' '}
              Bill payments
            </label>
            <label>
              <input
                type="checkbox"
                value="6"
                onChange={handleCheckboxChange}
                checked={frequentlyUsedServices.includes('6')}
              />{' '}
              Deposits
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>5. How satisfied are you with the speed of the ATM transactions?</label>
          <select
            value={transactionSpeedSatisfaction}
            onChange={(e) => setTransactionSpeedSatisfaction(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="1">Very satisfied</option>
            <option value="2">Satisfied</option>
            <option value="3">Neutral</option>
            <option value="4">Dissatisfied</option>
            <option value="5">Very dissatisfied</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Submit Survey</button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Survey;
