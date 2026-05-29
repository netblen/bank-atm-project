// src/components/Navbar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
        <span className="navbar-mark" aria-hidden="true">BA</span>
        <span>
          <strong>Bank ATM</strong>
          <small>Digital Banking</small>
        </span>
      </NavLink>

      <button
        className={`navbar-toggle ${isOpen ? 'is-open' : ''}`}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar-links ${isOpen ? 'is-open' : ''}`}>
        <li>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/AboutPage" onClick={closeMenu}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/SignIn" onClick={closeMenu}>
            Sign In
          </NavLink>
        </li>
        <li>
          <NavLink className="navbar-cta" to="/SignUp" onClick={closeMenu}>
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
