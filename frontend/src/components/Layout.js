import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { FiBell, FiSearch, FiCheck, FiInfo } from 'react-icons/fi';
import { notificationService } from '../services/api';

const Layout = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      const notifs = response.data.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search expenses, groups, or friends..." 
              className="w-full bg-gray-100/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 transition-colors rounded-full ${showNotifications ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
            >
              <FiBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <FiBell className="mx-auto text-gray-300 text-3xl mb-2" />
                      <p className="text-gray-500 text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                        onClick={() => !notif.read && markAsRead(notif._id)}
                      >
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                          {notif.read ? <FiCheck /> : <FiInfo />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Notifications</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
