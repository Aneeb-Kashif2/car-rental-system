import React, { useEffect } from 'react';

// A simple custom alert dialog component
const AlertDialog = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';

  useEffect(() => {
    // Automatically close the alert after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Adjust duration as needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="flex-1">
        <p className="font-semibold">{type === 'success' ? 'Success!' : 'Error!'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="text-white text-xl font-bold leading-none">
        &times;
      </button>
    </div>
  );
};

export default AlertDialog;
