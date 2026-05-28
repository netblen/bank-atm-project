import React, { useState, useEffect } from 'react';
import './FinancialGoals.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withAutoLogout from './withAutoLogout';

const FinancialGoals = () => {
  const [formData, setFormData] = useState({
    goalName: '', 
    target_amount: '', 
    due_date: '', 
  });
  const [userId, setUserId] = useState(1); 
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState("You’re doing great! Keep working towards your financial goals!");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`https://localhost:7243/api/Users/financial-userId?userId=${userId}`);
        if (response.data && Array.isArray(response.data.$values)) {
          setGoals(response.data.$values);
        } else {
          console.error('Response data is missing $values or it is not an array');
          setMessage('Error fetching goals.');
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        setMessage('Error fetching goals.');
      }
    };

    fetchGoals();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.target_amount <= 0) {
        alert('The target amount must be a positive number.');
        return; 
      }
      if (formData.target_amount < 100 || formData.target_amount > 10000) {
        alert('The target amount must be between 100 and 10,000.');
        return;
      }
    try {
      const response = await axios.post('https://localhost:7243/api/Users/creategoal', {
        ...formData,
        user_id: userId, 
        created_at: new Date().toISOString(),
      });

      setMessage('Goal created successfully!');
      alert('Goal created successfully!');
      console.log(response.data);
      navigate('/atm-simulator'); 
    } catch (error) {
      console.error(error);
      setMessage('Error creating the goal.');
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await axios.delete(`https://localhost:7243/api/Users/deletefinancial-id?id=${goalId}`);
        setMessage('Goal deleted successfully!');
        alert('Goal deleted successfully!');
        console.log(response.data);
        setGoals(goals.filter(goal => goal.goal_id !== goalId));
      } catch (error) {
        console.error('Error deleting goal:', error);
        setMessage('Error deleting the goal.');
      }
    }
  };

  return (
    <div>
      <h2>Create Financial Goal</h2>
      <p>{motivationalMessage}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Goal Name:</label>
          <input
            type="text"
            name="goalName"
            value={formData.goalName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Amount:</label>
          <input
            type="number"
            name="target_amount"
            value={formData.target_amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Goal</button>
      </form>
      {message && <p>{message}</p>}
      <h3>Your Goals:</h3>
      {Array.isArray(goals) && goals.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Goal Name</th>
              <th>Target Amount</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.goal_id}>
                <td>{goal.goalName}</td>
                <td>{goal.target_amount}</td>
                <td>{formatDate(goal.due_date)}</td>
                <td>
                  <button onClick={() => handleDelete(goal.goal_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No goals available.</p>
      )}
    </div>
  );
};

export default withAutoLogout(FinancialGoals);
