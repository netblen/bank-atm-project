import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditUserAdmin.css';

const securityQuestions = [
  "What is your mother's maiden name?",
  'What was the name of your first pet?',
  'What is your favorite color?',
  'What is your favorite book?',
  'What is your hometown?',
  'What is your dream job?',
  'What is your favorite movie?',
  'What is your favorite food?',
  'What is your favorite animal?',
];

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    id: Number(userId),
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    city: '',
    postal_code: '',
    profession: '',
    security_question: '',
    security_answer: '',
    date_of_birth: '',
    rol: 'User',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://localhost:7243/api/Users/${userId}`);
        const fetchedUser = response.data;
        const phone = fetchedUser.telephone || '';

        setUser({
          ...fetchedUser,
          confirmPassword: fetchedUser.password || '',
          telephone: phone.startsWith('+1') ? phone.slice(2) : phone,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setMessage('Error loading user details.');
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((current) => ({ ...current, [name]: value }));
  };

  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validatePassword(user.password)) {
      setMessage('Password needs 6+ characters, one uppercase letter, one number, and one special character.');
      return;
    }

    if (user.password !== user.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!validatePhoneNumber(user.telephone)) {
      setMessage('Telephone must be 10 digits long and contain only numbers.');
      return;
    }

    const today = new Date();
    const birthDate = new Date(user.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setMessage('User must be at least 18 years old.');
      return;
    }

    const updatedUser = {
      ...user,
      id: Number(userId),
      telephone: `+1${user.telephone}`,
    };

    setLoading(true);
    try {
      await axios.put(`https://localhost:7243/api/Users/UpdateUserbyAdmin?id=${userId}`, updatedUser);
      alert('User updated successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage(error.response?.data?.message || 'Error saving user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-edit-page">
      <section className="admin-edit-shell">
        <div className="admin-edit-info">
          <p className="admin-edit-eyebrow">Admin edit</p>
          <h1>Update user profile.</h1>
          <p>Adjust account details, security fields, and role information for this simulator user.</p>
        </div>

        <form className="admin-edit-form" onSubmit={handleSave}>
          <div className="admin-edit-form-heading">
            <span>User #{userId}</span>
            <h2>Profile details</h2>
          </div>

          <div className="admin-edit-grid">
            <label className="admin-edit-field">
              <span>First name</span>
              <input type="text" name="first_name" value={user.first_name} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field">
              <span>Last name</span>
              <input type="text" name="last_name" value={user.last_name} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field admin-edit-wide">
              <span>Email</span>
              <input type="email" name="email" value={user.email} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field">
              <span>Password</span>
              <input type="password" name="password" value={user.password} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="admin-edit-field">
              <span>Telephone</span>
              <input type="text" name="telephone" value={user.telephone} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field">
              <span>Date of birth</span>
              <input
                type="date"
                name="date_of_birth"
                value={user.date_of_birth ? user.date_of_birth.slice(0, 10) : ''}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="admin-edit-field">
              <span>City</span>
              <select name="city" value={user.city} onChange={handleInputChange} required>
                <option value="">Select City</option>
                <option value="Montreal">Montreal</option>
                <option value="Quebec City">Quebec City</option>
                <option value="Laval">Laval</option>
                <option value="Gatineau">Gatineau</option>
                <option value="Longueuil">Longueuil</option>
                <option value="Sherbrooke">Sherbrooke</option>
                <option value="Trois-Rivieres">Trois-Rivieres</option>
                <option value="Saguenay">Saguenay</option>
                <option value="Repentigny">Repentigny</option>
              </select>
            </label>

            <label className="admin-edit-field">
              <span>Postal code</span>
              <input type="text" name="postal_code" value={user.postal_code} onChange={handleInputChange} required />
            </label>

            <label className="admin-edit-field">
              <span>Profession</span>
              <select name="profession" value={user.profession} onChange={handleInputChange} required>
                <option value="">Select Profession</option>
                <option value="employed">Employed</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </label>

            <label className="admin-edit-field">
              <span>Role</span>
              <select name="rol" value={user.rol} onChange={handleInputChange} required>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label className="admin-edit-field admin-edit-wide">
              <span>Security question</span>
              <select name="security_question" value={user.security_question} onChange={handleInputChange} required>
                <option value="">Select Security Question</option>
                {securityQuestions.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-edit-field admin-edit-wide">
              <span>Security answer</span>
              <input
                type="text"
                name="security_answer"
                value={user.security_answer}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          {message && <p className="admin-edit-message">{message}</p>}

          <div className="admin-edit-actions">
            <button type="button" className="secondary" onClick={() => navigate('/users')}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditUser;
