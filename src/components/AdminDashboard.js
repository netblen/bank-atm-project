// src/components/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/users">Manage User</Link></li>
          <li><Link to="/activityLog">User Activity Log</Link></li>
          <li><Link to="/SystemPerformanceDashboard">System Performance Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
