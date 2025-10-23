import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/groups', label: 'Groups', icon: '👨‍👩‍👧‍👦' },
    { path: '/brands', label: 'Brands', icon: '🏷️' },
    { path: '/categories', label: 'Categories', icon: '📁' },
    { path: '/stores', label: 'Stores', icon: '🏪' },
    { path: '/attributes', label: 'Attributes', icon: '🎨' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/company', label: 'Company', icon: '🏢' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>📦 Inventory System</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          </li>
        ))}
        <li>
          <a href="#logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
