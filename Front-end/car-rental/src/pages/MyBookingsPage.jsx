import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For making API requests

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view your bookings.");
          setLoading(false);
          return;
        }

        // Make sure your API endpoint matches your backend route
        // e.g., if your backend route for getMyBookings is /api/bookings/my
       const response = await axios.get("http://localhost:8000/api/bookings/my-bookings", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching my bookings:", err);
        setError(err.response?.data?.message || "Failed to fetch bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{booking.carId.brand} {booking.carId.name}</h2>
              <p className="text-gray-700">From: {new Date(booking.startDate).toLocaleDateString()}</p>
              <p className="text-gray-700">To: {new Date(booking.endDate).toLocaleDateString()}</p>
              <p className="text-gray-700">Amount: ${booking.payment_amount}</p>
              <p className="text-gray-700">Status: <span className={`font-medium ${
                booking.booking_status === 'Confirmed' ? 'text-green-600' :
                booking.booking_status === 'Pending' ? 'text-yellow-600' :
                'text-red-600'
              }`}>{booking.booking_status}</span></p>
              {/* Add more booking details as needed */}
              <p className="text-sm text-gray-500 mt-2">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}