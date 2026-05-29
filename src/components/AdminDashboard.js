// src/components/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const adminActions = [
  {
    title: 'Manage users',
    description: 'Review customer profiles, edit user records, and keep account details current.',
    path: '/users',
    meta: 'User directory',
  },
  {
    title: 'Activity log',
    description: 'Monitor user activity, account events, and important transaction notifications.',
    path: '/activityLog',
    meta: 'Audit trail',
  },
  {
    title: 'System performance',
    description: 'Check API response time, memory usage, and system health indicators.',
    path: '/SystemPerformanceDashboard',
    meta: 'Operations',
  },
];

const AdminDashboard = () => {
  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-hero">
          <div>
            <p className="admin-eyebrow">Admin workspace</p>
            <h1>Manage users, logs, and system health.</h1>
            <p>
              A focused dashboard for keeping the ATM simulator organized, monitored, and ready for users.
            </p>
          </div>

          <div className="admin-summary" aria-label="Admin dashboard summary">
            <div>
              <strong>3</strong>
              <span>Admin tools</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>System views</span>
            </div>
          </div>
        </header>

        <section className="admin-actions-grid">
          {adminActions.map((action) => (
            <Link className="admin-action-card" to={action.path} key={action.title}>
              <span>{action.meta}</span>
              <h2>{action.title}</h2>
              <p>{action.description}</p>
              <strong>Open</strong>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
};

export default AdminDashboard;
