import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllCars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchAdminCars = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/all-cars`, { // Updated to use VITE_API_URL
          headers: { Authorization: `Bearer ${token}` }, // Send token in header
          withCredentials: true // Important for sending cookies if token is in cookie
        });
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching admin cars:", err);
        setError(err.response?.data?.message || "Failed to fetch cars.");
      }
    };
    fetchAdminCars();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-xl font-bold mb-4">Error: {error}</h1>
        <p>You may not have permission to view this page or your session has expired.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Cars (Admin View)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.length > 0 ? (
          cars.map(car => (
            <div key={car._id} className="border p-4 rounded shadow bg-white">
              <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded mb-2" />
              <h2 className="font-semibold text-lg">{car.name}</h2>
              <p>Brand: {car.brand}</p>
              <p>Rent/Day: ${car.rentPerDay}</p>
              {/* Add more car details if needed */}
            </div>
          ))
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
}
