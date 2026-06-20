import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiDollarSign, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Groups', path: '/groups', icon: <FiUsers /> },
    { name: 'Payments', path: '/payments', icon: <FiDollarSign /> },
    { name: 'Reports', path: '/reports', icon: <FiBarChart2 /> },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen shadow-xl sticky top-0 h-screen transition-all duration-300">
      <div className="p-6 flex items-center gap-3 bg-gray-800/50 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30">
          💰
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">ExpenseSplit</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <div className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 bg-gray-800/30 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
        >
          <FiLogOut />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
