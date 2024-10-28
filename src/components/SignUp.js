import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpProfession, setSignUpProfession] = useState('');
  const [signUpSecurityQuestion, setSignUpSecurityQuestion] = useState('');
  const [signUpSecurityAnswer, setSignUpSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga
    try {
      const response = await axios.post('https://localhost:7243/api/users/signup', {
        username: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        city: signUpCity,
        profession: signUpProfession,
        security_question: signUpSecurityQuestion,
        security_answer: signUpSecurityAnswer,
      });

      if (response.status === 200) {
        alert('Sign up successful. You can now sign in.');
        navigate('/signin'); // Redirigir a la página de inicio de sesión
      } else {
        alert('Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.response?.status === 400) { // Asumiendo que 400 es el código de estado para correo duplicado
        alert('Email already in use. Please use a different email.');
      } else {
        alert(error.response?.data?.message || 'An error occurred during sign-up. Please try again.');
      }
    } finally {
      setLoading(false); // Resetea el estado de carga
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUpSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={signUpName}
            onChange={(e) => setSignUpName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label><br />
          <select value={signUpCity} onChange={(e) => setSignUpCity(e.target.value)} required>
            <option value="">Select City</option>
            {/* Add your city options here */}
          </select>
        </div>
        <div>
          <label>Profession:</label><br />
          <select value={signUpProfession} onChange={(e) => setSignUpProfession(e.target.value)} required>
            <option value="">Select Profession</option>
            {/* Add your profession options here */}
          </select>
        </div>
        <div>
          <label>Security Question:</label><br />
          <select value={signUpSecurityQuestion} onChange={(e) => setSignUpSecurityQuestion(e.target.value)} required>
            <option value="">Select Security Question</option>
            {/* Add your security question options here */}
          </select>
        </div>
        <div>
          <label>Security Answer:</label><br />
          <input
            type="text"
            value={signUpSecurityAnswer}
            onChange={(e) => setSignUpSecurityAnswer(e.target.value)}
            required
          />
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
