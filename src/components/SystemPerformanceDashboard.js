import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SystemPerformanceDashboard.css';

const SystemPerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    responseTime: 0,
  });

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('https://localhost:7243/api/ATM/GetSystemMetrics');
      setMetrics({
        cpuUsage: response.data.cpuUsage,
        memoryUsage: response.data.memoryUsage,
        responseTime: response.data.responseTime,
      });
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div className="dashboard-container">
      <h2>System Performance Dashboard</h2>
      <div className="metric">
        <strong>CPU Usage:</strong>
        <span className="metric-value">{metrics.cpuUsage}%</span>
      </div>
      <div className="metric">
        <strong>Memory Usage:</strong>
        <span className="metric-value">{metrics.memoryUsage} MB</span>
      </div>
      <div className="metric">
        <strong>Response Time:</strong>
        <span className="metric-value">{metrics.responseTime} ms</span>
      </div>
    </div>
  );
};

export default SystemPerformanceDashboard;
