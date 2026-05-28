import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './RecentActivity.css';
import withAutoLogout from './withAutoLogout';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);
  const { userEmail } = useUser();

  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:7243/api/Users/recent-activity?email=${userEmail}`);
      const activitiesWithReadStatus = response.data.$values.map((item) => ({
        ...item,
        isRead: item.isRead || false, // Asume que el backend envía este dato
      }));
      setActivity(activitiesWithReadStatus);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching data');
    }
  }, [userEmail]);

  const handleMarkAsRead = async (index, isRead) => {
    try {
      const updatedActivity = [...activity];
      updatedActivity[index].isRead = isRead;
      await axios.put(`https://localhost:7243/api/Users/mark-activity`, {
        id: updatedActivity[index].id,
        isRead,
      });

      setActivity(updatedActivity);
    } catch (err) {
      setError(err.response?.data?.title || 'Error updating activity');
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setError('User email not found.');
      return;
    }
    fetchRecentActivity();
  }, [userEmail, fetchRecentActivity]);

  return (
    <div className="recent-activity-container">
      <h1>Recent Notifications</h1>
      {error && <div className="error-message">{error}</div>}
      {activity.length > 0 ? (
        <ul className="notification-list">
          {activity.map((item, index) => (
            <li
              key={index}
              className={`notification-item ${item.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <span className="notification-date">{new Date(item.activityDate).toLocaleString()}</span>
                <span className="notification-type">{item.activityType}</span>
                <span className="notification-amount">${item.amount.toFixed(2)}</span>
              </div>
              <button
                className="mark-read-button"
                onClick={() => handleMarkAsRead(index, !item.isRead)}
              >
                {item.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity found.</p>
      )}
    </div>
  );
};

export default withAutoLogout(RecentActivity);
