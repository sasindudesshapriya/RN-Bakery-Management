// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeeklySalesChart from './WeeklySalesChart';
import BranchPerformanceChart from './BranchPerformanceChart';
import SessionComparisonChart from './SessionComparisonChart';
import './Dashboard.css';

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-items');
        setTableData(response.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const calculateWeeklyData = () => {
    const issued = tableData.reduce((total, item) => total + parseInt(item.issuedQuantity || 0), 0);
    const returned = tableData.reduce((total, item) => total + parseInt(item.returnedQuantity || 0), 0);
    return { issued, returned };
  };

  const calculateBranchData = () => {
    const branchSales = tableData.reduce((acc, item) => {
      if (!acc[item.branch]) acc[item.branch] = 0;
      acc[item.branch] += parseInt(item.issuedQuantity || 0);
      return acc;
    }, {});
    return Object.keys(branchSales).map(branch => ({
      name: branch,
      sales: branchSales[branch]
    }));
  };

  const calculateSessionData = () => {
    const sessions = tableData.reduce((acc, item) => {
      acc[item.session] = (acc[item.session] || 0) + parseInt(item.issuedQuantity || 0);
      return acc;
    }, {});
    return {
      morning: sessions['morning'] || 0,
      evening: sessions['evening'] || 0
    };
  };

  return (
    <div className="dashboard">
      <div className="chart-container">
        <div className="chart-wrapper">
          <WeeklySalesChart weeklyData={calculateWeeklyData()} />
        </div>
        <div className="chart-wrapper">
          <BranchPerformanceChart branchData={calculateBranchData()} />
        </div>
        <div className="chart-wrapper">
          <SessionComparisonChart sessionData={calculateSessionData()} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
