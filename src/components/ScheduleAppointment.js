import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ScheduleAppointment.css';

const ScheduleAppointment = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const minimumDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 15);
    return now.toISOString().slice(0, 16);
  }, []);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleScheduleAppointment = async (event) => {
    event.preventDefault();
    setMessage('');

    const trimmedEmail = email.trim();
    const trimmedReason = reason.trim();

    if (!trimmedEmail || !trimmedReason || !appointmentDate) {
      setMessage('Please fill in all fields before scheduling.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (trimmedReason.length < 10 || trimmedReason.length > 600) {
      setMessage('Reason must be between 10 and 600 characters.');
      return;
    }

    const selectedDate = new Date(appointmentDate);
    const now = new Date();

    if (Number.isNaN(selectedDate.getTime()) || selectedDate <= now) {
      setMessage('Appointment date must be in the future.');
      return;
    }

    const appointmentData = {
      userEmail: trimmedEmail,
      reason: trimmedReason,
      appointmentDate: selectedDate.toISOString(),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('https://localhost:7243/api/Users/Appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        alert('Appointment scheduled successfully');
        navigate('/');
        return;
      }

      const errorData = await response.json().catch(() => ({}));
      setMessage(`Error scheduling appointment: ${errorData.message || 'Please try again.'}`);
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="appointment-page">
      <section className="appointment-shell">
        <motion.div
          className="appointment-info"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="appointment-eyebrow">Bank support</p>
          <h1>Schedule time with a representative.</h1>
          <p>
            Choose a future appointment time and tell the team what you need help with so they can
            prepare before your session.
          </p>

          
        </motion.div>

        <motion.form
          className="appointment-form"
          onSubmit={handleScheduleAppointment}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="appointment-form-heading">
            <span>Appointment request</span>
            <h2>Tell us how we can help.</h2>
          </div>

          <label className="appointment-field">
            <span>Email address</span>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="appointment-field">
            <span>Preferred date and time</span>
            <input
              type="datetime-local"
              value={appointmentDate}
              min={minimumDateTime}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </label>

          <label className="appointment-field">
            <span>Reason for appointment</span>
            <textarea
              placeholder="Describe your question or banking need..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={600}
            />
          </label>

          <div className="appointment-meta">
            <span>{reason.trim().length}/600 characters</span>
          </div>

          {message && <p className="appointment-message">{message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule appointment'}
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default ScheduleAppointment;
