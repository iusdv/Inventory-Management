import React from 'react';
import authService from '../services/authService';

const Navbar = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="navbar">
      <h1>Inventory Management System</h1>
      <div className="navbar-user">
        <span>Welcome, {user?.name || 'User'}</span>
      </div>
    </div>
  );
};

export default Navbar;
