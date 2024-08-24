import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './Components/HomePage';
import FormComponent from './Components/FormComponent';
import ParentTable from './Components/ParentTable';
import Dashboard from './Components/Dashboard';
import HeaderComponent from './Components/HeaderComponent';

import './App.css';


function App() {
  const weeklyData = {
    issued: 1200,
    returned: 300,
  };

  const branchData = [
    { name: 'Branch 1', sales: 500 },
    { name: 'Branch 2', sales: 700 },
    { name: 'Branch 3', sales: 800 },
  ];

  const sessionData = {
    morning: 600,
    evening: 900,
  };

    return (
      
      <Router>
      <HeaderComponent /> 
      <div className='body'>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/form" element={<FormComponent />} />
            <Route path="/table-view" element={<ParentTable />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
  </Router>
      );
    };

export default App;
