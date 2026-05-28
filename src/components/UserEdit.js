import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import withAutoLogout from './withAutoLogout';

const UserEdit = () => {
  const navigate = useNavigate();
  const { userEmail } = useUser();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({
    city: '',
    postal_code: '',
    profession: '',
    security_question: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://localhost:7243/api/Users/details`, {
          params: { email: userEmail },
        });
        setUser({
          city: response.data.city,
          postal_code: response.data.postal_code,
          profession: response.data.profession,
          security_question: response.data.security_question,
          security_answer : response.data.security_answer
        });
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        alert('Error loading user details: ' + (error.response?.data?.message || error.message));
      }
    };
    fetchUser();
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!password) {
      alert('Please enter your password to save changes');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`https://localhost:7243/api/Users/UpdateUser`, {
        email: userEmail,
        password,
        city: user.city,
        postalCode: user.postal_code,
        profession: user.profession,
        securityquestion: user.security_question,
        securityanswer: user.security_answer
      });
      alert('User updated successfully');
      navigate('/atm-simulator');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error saving user: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Edit User</h2>
      <p>For security reasons, your name, email, and phone number cannot be changed. Please contact support.</p>
      <form onSubmit={handleSave}>
        <div>
          <label>City:</label><br />
          <select name="city" value={user.city} onChange={handleInputChange} required>
            <option value="">Select City</option>
            <option value="Montreal">Montreal</option>
            <option value="Quebec City">Quebec City</option>
            <option value="Laval">Laval</option>
            <option value="Gatineau">Gatineau</option>
            <option value="Longueuil">Longueuil</option>
            <option value="Sherbrooke">Sherbrooke</option>
            <option value="Trois-Rivières">Trois-Rivières</option>
            <option value="Saguenay">Saguenay</option>
            <option value="Repentigny">Repentigny</option>
          </select>
        </div>
        <div>
          <label>Postal Code:</label><br />
          <input
            type="text"
            name="postal_code"
            value={user.postal_code}
            onChange={handleInputChange}
            required
            pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
            title="Please enter a valid postal code."
          />
        </div>
        <div>
          <label>Profession:</label><br />
          <select name="profession" value={user.profession} onChange={handleInputChange} required>
            <option value="">Select Profession</option>
            <option value="employed">Employed</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>
        <div>
          <label>Security Question:</label><br />
          <select name="security_question" value={user.security_question} onChange={handleInputChange} required>
            <option value="">Select Security Question</option>
            <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
            <option value="What is your favorite color?">What is your favorite color?</option>
            <option value="What is your favorite book?">What is your favorite book?</option>
            <option value="What is your hometown?">What is your hometown?</option>
            <option value="What is your dream job?">What is your dream job?</option>
            <option value="What is your favorite movie?">What is your favorite movie?</option>
            <option value="What is your favorite food?">What is your favorite food?</option>
            <option value="What is your favorite animal?">What is your favorite animal?</option>
          </select>
        </div>
        <div>
          <label>Security Answer:</label><br />
          <input type="text" name="security_answer" value={user.security_answer} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Confirm your Password:</label><br />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default withAutoLogout(UserEdit);
