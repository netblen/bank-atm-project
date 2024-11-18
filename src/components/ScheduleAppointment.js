import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ScheduleAppointment.css';

const ScheduleAppointment = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleScheduleAppointment = async () => {
    if (!email || !reason || !appointmentDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (reason.length < 10 || reason.length > 600) {
      alert("Reason must be between 10 and 600 characters.");
      return;
    }

    const selectedDate = new Date(appointmentDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (selectedDate < today || (selectedDate.toDateString() === today.toDateString() && selectedDate <= now)) {
      alert("Appointment date must be in the future, and cannot be today at or before the current time.");
      return;
    }

    const appointmentData = {
      userEmail: email,
      reason: reason,
      appointmentDate: selectedDate,
    };

    try {
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
      } else {
        const errorData = await response.json();
        alert(`Error scheduling the appointment: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <motion.div 
      className="schedule-appointment"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }} 
    >
      <h2>Schedule Your Appointment</h2>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Why do you want to speak with a bank representative? (max 100 words)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={600}
      />
      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />
      <button onClick={handleScheduleAppointment} className="schedule-button">
        Schedule Appointment
      </button>
    </motion.div>
  );
};

export default ScheduleAppointment;
