// SessionComparisonChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SessionComparisonChart = ({ sessionData }) => {
  const data = {
    labels: ['Morning', 'Evening'],
    datasets: [
      {
        label: 'items',
        data: [sessionData.morning, sessionData.evening],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <h2>Session Comparison Chart</h2>
      <div style={{ position: 'relative', height: '400px', width: '100%', padding: '10px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default SessionComparisonChart;
