// routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../EntryScreen/Login/login';
import Sidebar from "../sidebar/sidebar";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<Sidebar />} />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      
      </Routes>
    </Router>
  );
};

export default AppRoutes;