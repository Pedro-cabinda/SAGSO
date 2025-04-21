// src/components/LayoutPadrao.jsx
import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';

const LayoutPadrao = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '24px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutPadrao;
