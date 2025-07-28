import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-gray-800 p-10 rounded-xl shadow-2xl animate-fade-in">
        <h1 className="text-5xl font-extrabold text-white mb-12 text-center tracking-wide">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section for "View All" Links */}
          <div className="flex flex-col space-y-6">
            <Link
              to="/admin/users"
              className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center text-xl border border-green-700 hover:border-green-500 animate-slide-in-left"
            >
              All Users
            </Link>
            <Link
              to="/admin/cars"
              className="p-6 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center text-xl border border-yellow-700 hover:border-yellow-500 animate-slide-in-left animation-delay-100"
            >
              All Cars
            </Link>
            <Link
              to="/admin/bookings"
              className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center text-xl border border-red-700 hover:border-red-500 animate-slide-in-left animation-delay-200"
            >
              All Bookings
            </Link>
          </div>

          {/* Right Section for "Add" Links */}
          <div className="flex flex-col space-y-6 justify-center">
            <Link
              to="/admin/cars/add"
              className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center text-xl border border-blue-700 hover:border-blue-500 animate-slide-in-right"
            >
              Add Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}