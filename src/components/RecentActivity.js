import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const location = useLocation();
  const { email } = location.state || {}; // Obtiene el email de location.state

  console.log('Email in RecentActivity:', email);
  
  useEffect(() => {
    const fetchActivity = async () => {
      console.log('Fetching activity...'); // Log de inicio de la carga
      
      if (!email) {
        setError('Email is required to fetch recent activity.');
        setLoading(false); // Finaliza la carga si no hay email
        console.log('No email found. Error message set.');
        return;
      }

      try {
        console.log('Making API request with email:', email);
        const response = await axios.get(`https://localhost:7243/api/Users/recent-activity?email=${email}`);
        console.log('API response:', response.data);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setActivity(response.data); // Actualiza el estado con los datos
          console.log('Activity data set:', response.data);
        } else {
          setError('No recent activity available.');
          console.log('No recent activity available.');
        }
      } catch (error) {
        setError('Error fetching activity.');
        console.error('Error fetching activity:', error.response ? error.response : error.message);
        console.log('Error:', error.response ? error.response : error.message);
      } finally {
        setLoading(false); // Finaliza la carga
        console.log('Data fetching finished');
      }
    };

    fetchActivity();
  }, [email]); // La llamada a la API solo se hace cuando email cambia

  if (loading) {
    console.log('Loading data...');
    return <div>Loading recent activity...</div>;
  }

  console.log('Render activity:', activity);

  return (
    <div>
      <h1>Recent Activity</h1>
      {error && <div className="error-message">{error}</div>}
      {activity.length > 0 ? (
        <ul>
          {activity.map((item, index) => (
            <li key={index}>
              <p>{new Date(item.date).toLocaleString() || 'Invalid date'}</p>
              <p>{item.description}</p>
              <p>Amount: ${item.amount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity available.</p>
      )}
    </div>
  );
};

export default RecentActivity;