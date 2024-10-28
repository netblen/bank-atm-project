// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Bank ATM</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">About Page</Link>
        </li>
        <li>
          <Link to="/SignIn">Sign In</Link>
        </li>
        <li>
          <Link to="/SignUp">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
