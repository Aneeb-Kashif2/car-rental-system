import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Your payment was successful!");

  useEffect(() => {
    setMessage("Your booking is confirmed and payment was successful! Redirecting to your bookings...");

    const timer = setTimeout(() => {
      navigate('/bookings');
    }, 3000); // Redirect after 3 seconds, giving webhook time to process

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-green-200">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mt-4 mb-2">Payment Successful!</h1>
        <p className="text-gray-700 text-lg mb-6">{message}</p>
        <button
          onClick={() => navigate('/bookings')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out"
        >
          Go to My Bookings Now
        </button>
      </div>
    </motion.div>
  );
}
