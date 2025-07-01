import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/income', label: 'Income' },
    { path: '/fingenie', label: 'FinGenie' }, 
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">FinGenie</h2>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
