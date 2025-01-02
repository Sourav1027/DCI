import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/sidebar';

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Layout;