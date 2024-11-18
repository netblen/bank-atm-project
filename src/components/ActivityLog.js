// src/components/ActivityLog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ActivityLog.css';
import Papa from 'papaparse'; // Importa papaparse


const ActivityLog = () => {
  const [userActivityLog, setUserActivityLog] = useState([]);

  useEffect(() => {
    const fetchUserActivityLog = async () => {
      try {
        const response = await axios.get('https://localhost:7243/api/Users/UserActivityLogs');
        setUserActivityLog(response.data.$values);
      } catch (error) {
        console.error('Error fetching user activity log:', error);
        alert('Error loading user activity log');
      }
    };

    fetchUserActivityLog();
  }, []);
  // Función para exportar el registro de actividad a CSV
  const handleExport = () => {
    // Convertir los datos a CSV
    const csv = Papa.unparse(userActivityLog);

    // Crear un enlace para descargar el archivo CSV
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
    <div className="activitylog">
      <h3>User Activity Log</h3>
      <button onClick={handleExport}>Export to CSV</button> {/* Botón para exportar */}
      {userActivityLog.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Activity Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Sign In Date</th>
            </tr>
          </thead>
          <tbody>
            {userActivityLog.map(activity => (
              <tr key={activity.id}>
                <td>{activity.email}</td>
                <td>{activity.activityType}</td>
                <td>{activity.amount}</td>
                <td>{new Date(activity.activityDate).toLocaleString()}</td>
                <td>{new Date(activity.signInDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No activity logs found.</p>
      )}
    </div>
  );
};

export default ActivityLog;
