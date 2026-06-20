import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut, FiHome, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            💰 ExpenseSplit
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/dashboard" className="hover:text-blue-100 flex items-center gap-2">
              <FiHome /> Dashboard
            </Link>
            <Link to="/groups" className="hover:text-blue-100 flex items-center gap-2">
              <FiUsers /> Groups
            </Link>
            <Link to="/payments" className="hover:text-blue-100 flex items-center gap-2">
              <FiDollarSign /> Payments
            </Link>
            <Link to="/reports" className="hover:text-blue-100 flex items-center gap-2">
              <FiBarChart2 /> Reports
            </Link>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2">
              <FiLogOut /> Logout
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FiMenu size={24} />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link to="/dashboard" className="block hover:text-blue-100 py-2">Dashboard</Link>
            <Link to="/groups" className="block hover:text-blue-100 py-2">Groups</Link>
            <Link to="/payments" className="block hover:text-blue-100 py-2">Payments</Link>
            <Link to="/reports" className="block hover:text-blue-100 py-2">Reports</Link>
            <button onClick={handleLogout} className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
