import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './UserEdit.css';

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

const UserEdit = () => {
  const navigate = useNavigate();
  const { userEmail } = useUser();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    city: '',
    postal_code: '',
    profession: '',
    security_question: '',
    security_answer: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/details', {
          params: { email: userEmail },
        });

        setUser({
          city: response.data.city || '',
          postal_code: response.data.postal_code || '',
          profession: response.data.profession || '',
          security_question: response.data.security_question || '',
          security_answer: response.data.security_answer || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        setMessage('Error loading user details: ' + (error.response?.data?.message || error.message));
      }
    };

    if (userEmail) {
      fetchUser();
    }
  }, [userEmail]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!password) {
      setMessage('Please enter your password to save changes.');
      return;
    }

    setLoading(true);
    try {
      await axios.put('https://localhost:7243/api/Users/UpdateUser', {
        email: userEmail,
        password,
        city: user.city,
        postalCode: user.postal_code,
        profession: user.profession,
        securityquestion: user.security_question,
        securityanswer: user.security_answer,
      });

      alert('User updated successfully');
      navigate('/atm-simulator');
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error saving user: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile-edit-page">
      <section className="profile-edit-shell">
        <div className="profile-edit-info">
          <p className="profile-edit-eyebrow">Profile settings</p>
          <h1>Update your contact preferences.</h1>
          <p>
            For security reasons, your name, email, and phone number stay locked. Use this form to
            update account profile details and confirm changes with your password.
          </p>
        </div>

        <form className="profile-edit-form" onSubmit={handleSave}>
          <div className="profile-edit-form-heading">
            <span>Editable details</span>
            <h2>Profile information</h2>
          </div>

          <label className="profile-edit-field">
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

          <label className="profile-edit-field">
            <span>Postal code</span>
            <input
              type="text"
              name="postal_code"
              value={user.postal_code}
              onChange={handleInputChange}
              required
              pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
              title="Please enter a valid postal code, like H1A 1A1."
              placeholder="H1A 1A1"
            />
          </label>

          <label className="profile-edit-field">
            <span>Profession</span>
            <select name="profession" value={user.profession} onChange={handleInputChange} required>
              <option value="">Select Profession</option>
              <option value="employed">Employed</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </label>

          <label className="profile-edit-field">
            <span>Security question</span>
            <select
              name="security_question"
              value={user.security_question}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Security Question</option>
              {securityQuestions.map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </label>

          <label className="profile-edit-field">
            <span>Security answer</span>
            <input
              type="text"
              name="security_answer"
              value={user.security_answer}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="profile-edit-field">
            <span>Confirm password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {message && <p className="profile-edit-message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default withAutoLogout(UserEdit);
