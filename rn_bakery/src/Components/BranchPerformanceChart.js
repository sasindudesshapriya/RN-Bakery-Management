// BranchPerformanceChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BranchPerformanceChart = ({ branchData }) => {
  const data = {
    labels: branchData.map(branch => branch.name),
    datasets: [
      {
        label: 'Sales',
        data: branchData.map(branch => branch.sales),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
      <h2>Branch Performance Chart</h2>
      <div style={{ position: 'relative', height: '400px', width: '100%', padding: '10px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BranchPerformanceChart;
