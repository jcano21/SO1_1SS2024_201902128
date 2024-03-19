import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CPUUsageChart = () => {
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/cpu');
        const data = await response.json();
        setCpuUsage(data.cpu_usage);
      } catch (error) {
        console.error('Error fetching CPU usage:', error);
      }
    };

    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '500px' }}>
      <CircularProgressbar
        value={cpuUsage}
        text={`${cpuUsage.toFixed(2)}%`}
        styles={{
          path: { stroke: `rgba(62, 152, 199, ${cpuUsage / 100})` },
          text: { fill: '#f88', fontSize: '16px' },
        }}
      />
    </div>
  );
};

export default CPUUsageChart;