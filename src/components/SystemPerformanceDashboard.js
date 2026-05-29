import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './SystemPerformanceDashboard.css';

const SystemPerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    responseTime: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('https://localhost:7243/api/ATM/GetSystemMetrics');
      setMetrics({
        cpuUsage: Number(response.data.cpuUsage || 0),
        memoryUsage: Number(response.data.memoryUsage || 0),
        responseTime: Number(response.data.responseTime || 0),
      });
      setLastUpdated(new Date());
      setError('');
    } catch (fetchError) {
      console.error('Error fetching system metrics:', fetchError);
      setError('Unable to load system metrics.');
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = useMemo(
    () => [
      {
        label: 'CPU usage',
        value: `${metrics.cpuUsage}%`,
        raw: metrics.cpuUsage,
        max: 100,
        detail: 'Process CPU utilization',
      },
      {
        label: 'Memory usage',
        value: `${metrics.memoryUsage} MB`,
        raw: metrics.memoryUsage,
        max: 512,
        detail: 'Current working set',
      },
      {
        label: 'Response time',
        value: `${metrics.responseTime} ms`,
        raw: metrics.responseTime,
        max: 500,
        detail: 'Synthetic API timing',
      },
    ],
    [metrics]
  );

  return (
    <main className="performance-page">
      <section className="performance-shell">
        <header className="performance-header">
          <div>
            <p className="performance-eyebrow">System performance</p>
            <h1>Monitor API health.</h1>
            <p>Metrics refresh every five seconds so admins can keep an eye on the running backend.</p>
          </div>

          <div className="performance-refresh-card">
            <span>Last updated</span>
            <strong>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Waiting...'}</strong>
          </div>
        </header>

        {error && <div className="performance-message">{error}</div>}

        <section className="performance-grid">
          {metricCards.map((metric) => (
            <article className="performance-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
              <div className="performance-meter" aria-hidden="true">
                <i style={{ width: `${Math.min((metric.raw / metric.max) * 100, 100)}%` }} />
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
};

export default SystemPerformanceDashboard;
