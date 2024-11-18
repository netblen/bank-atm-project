import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
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
        setUser({ ...response.data, confirmPassword: response.data.password });
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Error loading user details');
      }
    };
  
    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    if (!validatePassword(user.password)) {
      alert('Password must contain at least one uppercase letter, one special character, and one number.');
      return;
    }
  
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    if (!validatePhoneNumber(user.telephone)) {
      alert('Telephone must be 10 digits long and contain only numbers.');
      return;
    }
  
    const today = new Date();
    const birthDate = new Date(user.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (age < 18) {
      alert('You must be at least 18 years old to create an account.');
      return;
    }
    
    const phoneWithCountryCode = `+1${user.telephone}`;
    const updatedUser = { ...user, telephone: phoneWithCountryCode };
  
    setLoading(true);
    try {
      await axios.put(`https://localhost:7243/api/Users/UpdateUserbyAdmin?id=${userId}`, updatedUser);
      alert('User updated successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error saving user');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="auth-form">
      <h2>Edit User</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>First Name:</label><br />
          <input type="text" name="first_name" value={user.first_name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Last Name:</label><br />
          <input type="text" name="last_name" value={user.last_name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={user.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={user.password} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Confirm Password:</label><br />
          <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Telephone:</label><br />
          <input type="text" name="telephone" value={user.telephone} onChange={handleInputChange} required />
        </div>
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
          <input type="text" name="postal_code" value={user.postal_code} onChange={handleInputChange} required />
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
          <label>Date of Birth:</label><br />
          <input type="date" name="date_of_birth" value={user.date_of_birth.slice(0, 10)} onChange={handleInputChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
