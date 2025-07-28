import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Bookings</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking._id} className="border p-4 rounded bg-gray-50 shadow">
            <p><strong>Name:</strong> {booking.customer_name}</p>
            <p><strong>CNIC:</strong> {booking.cnic_number}</p>
            <p><strong>Car:</strong> {booking.carId?.name || "N/A"}</p>
            <p><strong>Period:</strong> {booking.startDate} to {booking.endDate}</p>
            <p><strong>Amount:</strong> Rs. {booking.payment_amount}</p>
            <p><strong>Status:</strong> {booking.booking_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
