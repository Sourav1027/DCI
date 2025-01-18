// routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../EntryScreen/Login/login';
import Sidebar from "../sidebar/sidebar";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<Sidebar />} />
      
      </Routes>
    </Router>
  );
};

export default AppRoutes;