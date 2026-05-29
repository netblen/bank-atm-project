import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './FinancialGoals.css';

const FinancialGoals = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goalName: '',
    target_amount: '',
    due_date: '',
  });
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const motivationalMessage = 'Small goals become real progress when you track them clearly.';

  useEffect(() => {
    const fetchUserId = async () => {
      if (!userEmail) {
        setMessage('User email not found. Please sign in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:7243/api/Users/details', {
          params: { email: userEmail },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Error loading user details.');
        setLoading(false);
      }
    };

    fetchUserId();
  }, [userEmail]);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7243/api/Users/financial-userId?userId=${userId}`);
        setGoals(response.data?.$values || response.data || []);
        setMessage('');
      } catch (error) {
        console.error('Error fetching goals:', error);
        setGoals([]);
        setMessage('Error fetching goals.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  const totalTarget = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.target_amount || 0), 0),
    [goals]
  );

  const nextDueDate = useMemo(() => {
    if (!goals.length) return null;

    return goals
      .map((goal) => new Date(goal.due_date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a - b)[0];
  }, [goals]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const targetAmount = Number(formData.target_amount);

    if (!userId) {
      setMessage('User information is still loading. Please try again.');
      return;
    }

    if (targetAmount < 100 || targetAmount > 10000) {
      setMessage('The target amount must be between 100 and 10,000.');
      return;
    }

    if (new Date(formData.due_date) <= new Date()) {
      setMessage('Choose a future due date for your goal.');
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post('https://localhost:7243/api/Users/creategoal', {
        ...formData,
        target_amount: targetAmount,
        user_id: userId,
        created_at: new Date().toISOString(),
      });

      const createdGoal = response.data?.data;
      if (createdGoal) {
        setGoals((current) => [...current, createdGoal]);
      }
      setFormData({ goalName: '', target_amount: '', due_date: '' });
      setMessage('Goal created successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error creating the goal.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await axios.delete(`https://localhost:7243/api/Users/deletefinancial-id?id=${goalId}`);
      setGoals((current) => current.filter((goal) => goal.goal_id !== goalId));
      setMessage('Goal deleted successfully.');
    } catch (error) {
      console.error('Error deleting goal:', error);
      setMessage('Error deleting the goal.');
    }
  };

  return (
    <main className="goals-page">
      <section className="goals-shell">
        <header className="goals-header">
          <div>
            <p className="goals-eyebrow">Financial goals</p>
            <h1>Plan what you want your money to do next.</h1>
            <p>{motivationalMessage}</p>
          </div>

          <div className="goals-summary">
            <div>
              <strong>{goals.length}</strong>
              <span>Active goals</span>
            </div>
            <div>
              <strong>${totalTarget.toFixed(2)}</strong>
              <span>Total target</span>
            </div>
          </div>
        </header>

        {message && <div className="goals-message">{message}</div>}

        <section className="goals-grid">
          <form className="goals-form" onSubmit={handleSubmit}>
            <div className="goals-form-heading">
              <span>New goal</span>
              <h2>Create a savings target</h2>
            </div>

            <label className="goals-field">
              <span>Goal name</span>
              <input
                type="text"
                name="goalName"
                value={formData.goalName}
                onChange={handleChange}
                placeholder="Emergency fund, vacation..."
                required
              />
            </label>

            <label className="goals-field">
              <span>Target amount</span>
              <input
                type="number"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                min="100"
                max="10000"
                step="0.01"
                required
              />
            </label>

            <label className="goals-field">
              <span>Due date</span>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" disabled={saving || !userId}>
              {saving ? 'Creating...' : 'Create goal'}
            </button>
          </form>

          <section className="goals-list-card">
            <div className="goals-list-heading">
              <div>
                <span>Goal list</span>
                <h2>Your goals</h2>
              </div>
              <button type="button" onClick={() => navigate('/atm-simulator')}>
                Dashboard
              </button>
            </div>

            {nextDueDate && (
              <p className="goals-next">Next due date: {nextDueDate.toLocaleDateString()}</p>
            )}

            {loading ? (
              <p className="goals-empty">Loading goals...</p>
            ) : goals.length > 0 ? (
              <div className="goals-table-wrap">
                <table className="goals-table">
                  <thead>
                    <tr>
                      <th>Goal</th>
                      <th>Target</th>
                      <th>Due date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal) => (
                      <tr key={goal.goal_id}>
                        <td>{goal.goalName}</td>
                        <td>${Number(goal.target_amount || 0).toFixed(2)}</td>
                        <td>{formatDate(goal.due_date)}</td>
                        <td>
                          <button type="button" onClick={() => handleDelete(goal.goal_id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="goals-empty">No goals available yet.</p>
            )}
          </section>
        </section>
      </section>
    </main>
  );
};

export default withAutoLogout(FinancialGoals);
