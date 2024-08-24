import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklySalesChart = ({ weeklyData }) => {
  const { issued, returned } = weeklyData;

  const data = {
    labels: ['Issued', 'Returned'],
    datasets: [
      {
        label: 'Items',
        data: [issued, returned],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
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
      <h2>Weakly Sales Chart</h2>
      <div style={{ position: 'relative', height: '400px', width: '100%', padding: '10px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklySalesChart;
