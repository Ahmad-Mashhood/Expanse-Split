import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    success: 'bg-green-100 text-green-700 border-green-400',
    error: 'bg-red-100 text-red-700 border-red-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    info: 'bg-blue-100 text-blue-700 border-blue-400'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${bgColor[type]}`}>
      <div className="flex items-center gap-2">
        <FiAlertCircle size={20} />
        <span>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-auto font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
