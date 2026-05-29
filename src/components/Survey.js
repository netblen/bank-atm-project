import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from './UserContext';
import './Survey.css';

const serviceOptions = [
  { value: '1', label: 'Cash withdrawal' },
  { value: '2', label: 'Balance inquiry' },
  { value: '3', label: 'Fund transfer' },
  { value: '4', label: 'Bill payments' },
  { value: '6', label: 'Deposits' },
];

const Survey = () => {
  const { userEmail } = useUser();
  const [userId, setUserId] = useState(null);
  const [satisfactionLevel, setSatisfactionLevel] = useState('');
  const [usageFrequency, setUsageFrequency] = useState('');
  const [locationConvenience, setLocationConvenience] = useState('');
  const [frequentlyUsedServices, setFrequentlyUsedServices] = useState([]);
  const [transactionSpeedSatisfaction, setTransactionSpeedSatisfaction] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserId = async () => {
      if (!userEmail) {
        setError('User email not found. Please sign in again.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7243/api/Users/details', {
          params: { email: userEmail },
        });
        setUserId(response.data.id);
      } catch (err) {
        setError('Error loading user details. Please try again.');
      }
    };

    fetchUserId();
  }, [userEmail]);

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setFrequentlyUsedServices((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (frequentlyUsedServices.length === 0) {
      setError('Please select at least one frequently used service.');
      return;
    }

    if (!userId) {
      setError('User information is still loading. Please try again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://localhost:7243/api/Users/survey-yes', null, {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="survey-page">
      <motion.section
        className="survey-shell"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <header className="survey-header">
          <p className="survey-eyebrow">Customer survey</p>
          <h1>Help shape the ATM experience.</h1>
          <p>Answer a few quick questions about service quality, access, and transaction speed.</p>
        </header>

        {error && <div className="survey-message error">{error}</div>}
        {successMessage && <div className="survey-message success">{successMessage}</div>}

        <form className="survey-form" onSubmit={handleSubmit}>
          <label className="survey-field">
            <span>1. Overall ATM service</span>
            <select value={satisfactionLevel} onChange={(event) => setSatisfactionLevel(event.target.value)} required>
              <option value="">Select</option>
              <option value="1">Very satisfied</option>
              <option value="2">Satisfied</option>
              <option value="3">Neutral</option>
              <option value="4">Dissatisfied</option>
              <option value="5">Very dissatisfied</option>
            </select>
          </label>

          <label className="survey-field">
            <span>2. ATM service usage</span>
            <select value={usageFrequency} onChange={(event) => setUsageFrequency(event.target.value)} required>
              <option value="">Select</option>
              <option value="1">Multiple times a week</option>
              <option value="2">Once a week</option>
              <option value="3">Multiple times a month</option>
              <option value="4">Once a month</option>
              <option value="5">Less than once a month</option>
            </select>
          </label>

          <label className="survey-field">
            <span>3. ATM location convenience</span>
            <select
              value={locationConvenience}
              onChange={(event) => setLocationConvenience(event.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="1">Very convenient</option>
              <option value="2">Somewhat convenient</option>
              <option value="3">Neutral</option>
              <option value="4">Not very convenient</option>
              <option value="5">Not at all convenient</option>
            </select>
          </label>

          <fieldset className="survey-services">
            <legend>4. Services you frequently use</legend>
            <div>
              {serviceOptions.map((service) => (
                <label key={service.value}>
                  <input
                    type="checkbox"
                    value={service.value}
                    onChange={handleCheckboxChange}
                    checked={frequentlyUsedServices.includes(service.value)}
                  />
                  <span>{service.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="survey-field">
            <span>5. Transaction speed</span>
            <select
              value={transactionSpeedSatisfaction}
              onChange={(event) => setTransactionSpeedSatisfaction(event.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="1">Very satisfied</option>
              <option value="2">Satisfied</option>
              <option value="3">Neutral</option>
              <option value="4">Dissatisfied</option>
              <option value="5">Very dissatisfied</option>
            </select>
          </label>

          <button type="submit" disabled={loading || !userId}>
            {loading ? 'Submitting...' : 'Submit survey'}
          </button>
        </form>
      </motion.section>
    </main>
  );
};

export default Survey;
