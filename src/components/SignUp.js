import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
    return /^\d{10}$/.test(phone);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(signUpData.password)) {
      alert('Password must contain at least one uppercase letter, one special character, and one number.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!validatePhoneNumber(signUpData.telephone)) {
      alert('Telephone must be 10 digits long and contain only numbers.');
      return;
    }

    if (!signUpData.date_of_birth) {
      alert('Please enter your date of birth.');
      return;
    }

    const today = new Date();
    const birthDate = new Date(signUpData.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      alert('You must be at least 18 years old to create an account.');
      return;
    }

    const phoneWithCountryCode = `+1${signUpData.telephone}`;
    const updatedSignUpData = {
      ...signUpData,
      email: signUpData.email.trim(),
      telephone: phoneWithCountryCode,
    };

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
    <main className="auth-page">
      <section className="auth-panel auth-panel-signup" aria-labelledby="signup-title">
        <div className="auth-visual" aria-hidden="true">
          <p className="auth-kicker">New profile</p>
          <h1>Start with a simulator account built for practice.</h1>
          <div className="auth-device">
            <div className="auth-device-header">
              <span>Starter savings</span>
              <strong>$50.00</strong>
            </div>
            <div className="auth-progress auth-progress-wide">
              <span></span>
            </div>
            <div className="auth-device-row">
              <span>Checking</span>
              <strong>Included</strong>
            </div>
            <div className="auth-device-row">
              <span>Financial goals</span>
              <strong>Enabled</strong>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <p>Open your simulator account</p>
            <h2 id="signup-title">Create account</h2>
            <span>Fill in your details once, then practice banking with a fresh profile.</span>
          </div>

          <form onSubmit={handleSignUpSubmit} className="auth-fields auth-fields-grid">
            <label className="auth-field">
              <span>First name</span>
              <input
                type="text"
                name="first_name"
                value={signUpData.first_name}
                onChange={handleInputChange}
                autoComplete="given-name"
                required
              />
            </label>

            <label className="auth-field">
              <span>Last name</span>
              <input
                type="text"
                name="last_name"
                value={signUpData.last_name}
                onChange={handleInputChange}
                autoComplete="family-name"
                required
              />
            </label>

            <label className="auth-field auth-field-wide">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
              />
            </label>

            <label className="auth-field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={signUpData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
              />
            </label>

            <label className="auth-field">
              <span>Telephone</span>
              <input
                type="tel"
                name="telephone"
                value={signUpData.telephone}
                onChange={handleInputChange}
                placeholder="10 digits"
                autoComplete="tel"
                required
              />
            </label>

            <label className="auth-field">
              <span>Date of birth</span>
              <input
                type="date"
                name="date_of_birth"
                value={signUpData.date_of_birth}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="auth-field">
              <span>City</span>
              <select name="city" value={signUpData.city} onChange={handleInputChange} required>
                <option value="">Select city</option>
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

            <label className="auth-field">
              <span>Postal code</span>
              <input
                type="text"
                name="postal_code"
                value={signUpData.postal_code}
                onChange={handleInputChange}
                autoComplete="postal-code"
                required
              />
            </label>

            <label className="auth-field">
              <span>Profession</span>
              <select name="profession" value={signUpData.profession} onChange={handleInputChange} required>
                <option value="">Select profession</option>
                <option value="employed">Employed</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </label>

            <label className="auth-field auth-field-wide">
              <span>Security question</span>
              <select name="security_question" value={signUpData.security_question} onChange={handleInputChange} required>
                <option value="">Select security question</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What is your favorite color?">What is your favorite color?</option>
                <option value="What is your favorite book?">What is your favorite book?</option>
                <option value="What is your hometown?">What is your hometown?</option>
                <option value="What is your dream job?">What is your dream job?</option>
                <option value="What is your favorite movie?">What is your favorite movie?</option>
                <option value="What is your favorite food?">What is your favorite food?</option>
                <option value="What is your favorite animal?">What is your favorite animal?</option>
              </select>
            </label>

            <label className="auth-field auth-field-wide">
              <span>Security answer</span>
              <input
                type="text"
                name="security_answer"
                value={signUpData.security_answer}
                onChange={handleInputChange}
                required
              />
            </label>

            <p className="auth-hint auth-field-wide">
              Passwords need 6+ characters, one uppercase letter, one number, and one special character.
            </p>

            <button type="submit" className="auth-submit auth-field-wide" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
