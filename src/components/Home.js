// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShareOnSocialMedia from './ShareOnSocialMedia';
import './Home.css';

const Home = () => {
  const featureCards = [
    {
      id: 1,
      title: 'Secure everyday banking',
      description: 'Sign in, review activity, and simulate ATM transactions in one focused workspace.',
      metric: '24/7',
      label: 'account access',
    },
    {
      id: 2,
      title: 'Balance clarity',
      description: 'Track checking and savings balances with fast views of recent account movement.',
      metric: '2',
      label: 'account types',
    },
    {
      id: 3,
      title: 'Guided money actions',
      description: 'Move through deposits, withdrawals, transfers, payments, and goals.',
      metric: '5+',
      label: 'money tools',
    },
  ];

  const quickActions = [
    { to: '/SignIn', title: 'Sign in', text: 'Continue to your account dashboard.' },
    { to: '/SignUp', title: 'Create account', text: 'Start a new profile for the simulator.' },
    { to: '/Locator', title: 'Find an ATM', text: 'View nearby ATM locations on the map.' },
    { to: '/TransactionGlossary', title: 'Learn terms', text: 'Review common banking and transaction terms.' },
  ];

  const promotions = [
    {
      id: 1,
      title: '$50 welcome bonus',
      description: 'Open your simulator profile and start practicing healthy saving habits.',
      tag: 'New members',
    },
    {
      id: 2,
      title: 'First year fee preview',
      description: 'Explore how no-fee banking changes your monthly cash flow.',
      tag: 'Planning',
    },
    {
      id: 3,
      title: 'Goal builder',
      description: 'Set a target, choose a due date, and monitor your saving progress.',
      tag: 'Savings',
    },
  ];

  return (
    <div className="home-container">
      <header className="home-hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="hero-eyebrow">Bank ATM Simulator</p>
          <h1>Welcome back to smarter, simpler banking practice.</h1>
          <p className="hero-lede">
            Manage balances, simulate transactions, schedule support, and build confidence before
            you make real banking decisions.
          </p>

          <div className="hero-actions">
            <Link to="/SignIn" className="primary-action">Get started</Link>
            <Link to="/SignUp" className="secondary-action">Create account</Link>
          </div>

          <dl className="hero-stats" aria-label="Simulator highlights">
            <div>
              <dt>Fast</dt>
              <dd>ATM-style workflows</dd>
            </div>
            <div>
              <dt>Clear</dt>
              <dd>Balance views</dd>
            </div>
            <div>
              <dt>Guided</dt>
              <dd>Financial goals</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          className="atm-preview"
          aria-label="ATM simulator preview"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="atm-screen">
            <div className="screen-topline">
              <span>Available balance</span>
              <strong>$4,280.50</strong>
            </div>
            <div className="balance-chart" aria-hidden="true">
              <span className="bar bar-checking"></span>
              <span className="bar bar-savings"></span>
              <span className="bar bar-payments"></span>
            </div>
            <div className="screen-list">
              <div>
                <span>Checking</span>
                <strong>$2,130.00</strong>
              </div>
              <div>
                <span>Savings</span>
                <strong>$2,150.50</strong>
              </div>
            </div>
          </div>

          <div className="atm-controls" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      </header>

      <section className="quick-actions-section" aria-labelledby="quick-actions-title">
        <div className="section-heading">
          <p>Choose your next step</p>
          <h2 id="quick-actions-title">Jump into the tools you need</h2>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <Link className="quick-action" key={action.title} to={action.to}>
              <span>{action.title}</span>
              <p>{action.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="features-section" aria-labelledby="features-title">
        <div className="section-heading">
          <p>Built for practice</p>
          <h2 id="features-title">A cleaner way to learn online banking</h2>
        </div>

        <div className="features-list">
          {featureCards.map((feature) => (
            <article className="feature" key={feature.id}>
              <div className="feature-metric">
                <strong>{feature.metric}</strong>
                <span>{feature.label}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="promotions-section" aria-labelledby="promotions-title">
        <div className="section-heading">
          <p>Offers and learning prompts</p>
          <h2 id="promotions-title">Explore what you can practice today</h2>
        </div>

        <div className="promotions-list">
          {promotions.map((promotion) => (
            <article key={promotion.id} className="promotion">
              <span>{promotion.tag}</span>
              <h3>{promotion.title}</h3>
              <p>{promotion.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-main">
          <h2>Ready to explore your simulator account?</h2>
          <p>Practice real banking decisions in a secure environment built for learning.</p>
          <Link to="/SignIn" className="primary-action">Open simulator</Link>
        </div>

        <div className="footer-share">
          <ShareOnSocialMedia />
        </div>
      </footer>
    </div>
  );
};

export default Home;
