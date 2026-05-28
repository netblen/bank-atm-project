import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [signUpData, setSignUpData] = useState({
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{6,}$/.test(password);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone); // Validación: debe tener exactamente 10 dígitos
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseña
    if (!validatePassword(signUpData.password)) {
      alert('Password must contain at least one uppercase letter, one special character, and one number.');
      return;
    }

    // Confirmación de contraseña
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Validación de número de teléfono
    if (!validatePhoneNumber(signUpData.telephone)) {
      alert('Telephone must be 10 digits long and contain only numbers.');
      return;
    }

    // Validación de edad
    const today = new Date();
    const birthDate = new Date(signUpData.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      alert('You must be at least 18 years old to create an account.');
      return;
    }

    // Agregar el prefijo de país al número de teléfono
    const phoneWithCountryCode = `+1${signUpData.telephone}`;
    const updatedSignUpData = { ...signUpData, telephone: phoneWithCountryCode };

    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7243/api/users/signup', updatedSignUpData);
      if (response.status === 200) {
        alert('Sign up successful. You can now sign in.');
        navigate('/signin');
      } else {
        alert('Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.response?.status === 400) {
        alert('Email already in use. Please use a different email.');
      } else {
        alert(error.response?.data?.message || 'An error occurred during sign-up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUpSubmit}>
        <div>
          <label>First Name:</label><br />
          <input type="text" name="first_name" value={signUpData.first_name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Last Name:</label><br />
          <input type="text" name="last_name" value={signUpData.last_name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={signUpData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={signUpData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label><br />
          <input
            type="password"
            name="confirmPassword"
            value={signUpData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Telephone:</label><br />
          <input type="text" name="telephone" value={signUpData.telephone} onChange={handleInputChange} required />
        </div>
        <div>
          <label>City:</label><br />
          <select name="city" value={signUpData.city} onChange={handleInputChange} required>
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
            value={signUpData.postal_code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Profession:</label><br />
          <select name="profession" value={signUpData.profession} onChange={handleInputChange} required>
            <option value="">Select Profession</option>
            <option value="employed">Employed</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>
        <div>
          <label>Security Question:</label><br />
          <select name="security_question" value={signUpData.security_question} onChange={handleInputChange} required>
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
          <input type="text" name="security_answer" value={signUpData.security_answer} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Date of Birth:</label><br />
          <input type="date" name="date_of_birth" value={signUpData.date_of_birth} onChange={handleInputChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div className="already-account">
        <p>Already have an account? <a href="/signin">Sign In</a></p>
      </div>
    </div>
  );
};

export default SignUp;
