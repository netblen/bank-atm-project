import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import withAutoLogout from './withAutoLogout';
import './RecentActivity.css';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const { userEmail } = useUser();

  const fetchRecentActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://localhost:7243/api/Users/recent-activity?email=${userEmail}`);
      const values = response.data.$values || [];
      const activitiesWithReadStatus = values.map((item) => ({
        ...item,
        isRead: item.isRead || false,
      }));
      setActivity(activitiesWithReadStatus);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.title || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  const handleMarkAsRead = async (index, isRead) => {
    try {
      const updatedActivity = [...activity];
      updatedActivity[index].isRead = isRead;
      await axios.put('https://localhost:7243/api/Users/mark-activity', {
        id: updatedActivity[index].id,
        isRead,
      });

      setActivity(updatedActivity);
    } catch (err) {
      setError(err.response?.data?.title || 'Error updating activity');
    }
  };

  const handleMarkAllRead = async () => {
    const unreadActivity = activity.filter((item) => !item.isRead);

    if (unreadActivity.length === 0) {
      return;
    }

    try {
      setIsMarkingAll(true);
      await Promise.all(
        unreadActivity.map((item) =>
          axios.put('https://localhost:7243/api/Users/mark-activity', {
            id: item.id,
            isRead: true,
          })
        )
      );

      setActivity((currentActivity) =>
        currentActivity.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data?.title || 'Error marking all activity as read');
    } finally {
      setIsMarkingAll(false);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setError('User email not found.');
      setIsLoading(false);
      return;
    }

    fetchRecentActivity();
  }, [userEmail, fetchRecentActivity]);

  const unreadCount = activity.filter((item) => !item.isRead).length;

  return (
    <main className="activity-page">
      <section className="activity-shell">
        <header className="activity-header">
          <div>
            <p className="activity-eyebrow">Notifications</p>
            <h1>Recent activity</h1>
            <p>Review account events and mark notifications when you are finished with them.</p>
          </div>

          <div className="activity-summary">
            <div>
              <strong>{activity.length}</strong>
              <span>Total</span>
            </div>
            <div>
              <strong>{unreadCount}</strong>
              <span>Unread</span>
            </div>
          </div>
        </header>

        <div className="activity-toolbar">
          <span>{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up'}</span>
          <button type="button" onClick={handleMarkAllRead} disabled={unreadCount === 0 || isMarkingAll}>
            {isMarkingAll ? 'Marking...' : 'Mark all read'}
          </button>
        </div>

        {error && <div className="activity-message">{error}</div>}

        {isLoading ? (
          <div className="activity-empty">Loading recent activity...</div>
        ) : activity.length > 0 ? (
          <ul className="activity-list">
            {activity.map((item, index) => (
              <li key={item.id || index} className={`activity-item ${item.isRead ? 'is-read' : 'is-unread'}`}>
                <div className="activity-content">
                  <span className="activity-status">{item.isRead ? 'Read' : 'Unread'}</span>
                  <strong>{item.activityType}</strong>
                  <span>{new Date(item.activityDate).toLocaleString()}</span>
                </div>
                <div className="activity-side">
                  <strong>${Number(item.amount || 0).toFixed(2)}</strong>
                  <button type="button" onClick={() => handleMarkAsRead(index, !item.isRead)}>
                    {item.isRead ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="activity-empty">No recent activity found.</div>
        )}
      </section>
    </main>
  );
};

export default withAutoLogout(RecentActivity);
