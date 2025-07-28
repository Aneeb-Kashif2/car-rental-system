import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to check auth status
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Initial check when component mounts
    checkAuthStatus();

    // Listen for a custom 'authChange' event
    window.addEventListener('authChange', checkAuthStatus);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update state immediately
    // Dispatch custom event to notify other components (like Nav itself)
    window.dispatchEvent(new Event('authChange'));
    navigate("/login");
  };

  return (
    <header className="bg-black text-white body-font shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 relative">
        {/* Centered Brand */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <a
            className="text-2xl font-[Playfair Display] font-bold tracking-wider transition duration-500 ease-in-out hover:text-indigo-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            GearGo
          </a>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-6 ml-auto">
          <a onClick={() => navigate("/")} className="hover:text-gray-300 transition duration-300 hover:scale-105 cursor-pointer">Home</a>
          <a onClick={() => navigate("/about")} className="hover:text-gray-300 transition duration-300 hover:scale-105 cursor-pointer">About Us</a>
          <a onClick={() => navigate("/contact")} className="hover:text-gray-300 transition duration-300 hover:scale-105 cursor-pointer">Contact Us</a>

          {isLoggedIn ? (
            <>
              <a onClick={() => navigate("/bookings")} className="hover:text-gray-300 transition duration-300 hover:scale-105 cursor-pointer">My Bookings</a>
              <button
                onClick={handleLogout}
                className="ml-4 bg-white text-black px-5 py-2 rounded transition duration-300 hover:bg-gray-200 hover:-translate-y-1 hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/signup")}
              className="ml-4 bg-white text-black px-5 py-2 rounded transition duration-300 hover:bg-gray-200 hover:-translate-y-1 hover:scale-105"
            >
              Sign Up
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
