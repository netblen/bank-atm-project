// src/components/ActivityLog.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './ActivityLog.css';

const ActivityLog = () => {
  const [userActivityLog, setUserActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserActivityLog = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/UserActivityLogs');
        setUserActivityLog(response.data.$values || []);
      } catch (fetchError) {
        console.error('Error fetching user activity log:', fetchError);
        setError('Error loading user activity log.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivityLog();
  }, []);

  const filteredActivity = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return userActivityLog;
    }

    return userActivityLog.filter((activity) =>
      `${activity.email || ''} ${activity.activityType || ''}`.toLowerCase().includes(query)
    );
  }, [searchTerm, userActivityLog]);

  const totalAmount = userActivityLog.reduce((sum, activity) => sum + Number(activity.amount || 0), 0);

  const handleExport = () => {
    const csv = Papa.unparse(filteredActivity);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_activity_log.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="activity-log-page">
      <section className="activity-log-shell">
        <header className="activity-log-header">
          <div>
            <p className="activity-log-eyebrow">Audit trail</p>
            <h1>User activity log.</h1>
            <p>Review account actions, payment events, and transaction activity across the simulator.</p>
          </div>

          <div className="activity-log-summary">
            <div>
              <strong>{userActivityLog.length}</strong>
              <span>Events</span>
            </div>
            <div>
              <strong>${totalAmount.toFixed(2)}</strong>
              <span>Total amount</span>
            </div>
          </div>
        </header>

        <section className="activity-log-toolbar">
          <label>
            <span>Search activity</span>
            <input
              type="search"
              value={searchTerm}
              placeholder="Search email or activity type..."
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <button type="button" onClick={handleExport} disabled={filteredActivity.length === 0}>
            Export CSV
          </button>
        </section>

        {error && <div className="activity-log-message">{error}</div>}

        <section className="activity-log-table-card">
          {loading ? (
            <p className="activity-log-empty">Loading activity...</p>
          ) : filteredActivity.length > 0 ? (
            <div className="activity-log-table-wrap">
              <table className="activity-log-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Activity type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.email}</td>
                      <td>
                        <span className="activity-log-type">{activity.activityType}</span>
                      </td>
                      <td>${Number(activity.amount || 0).toFixed(2)}</td>
                      <td>{new Date(activity.activityDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="activity-log-empty">No activity logs found.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default ActivityLog;
