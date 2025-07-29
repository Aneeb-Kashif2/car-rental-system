import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // Added error state for consistency

  useEffect(() => {
    const fetchUsers = async () => { // Renamed 'fetch' to 'fetchUsers' for clarity
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/all-users`, { // Updated to use VITE_API_URL
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching all users:", err);
        setError(err.response?.data?.message || "Failed to fetch users."); // Set error message
      }
    };
    fetchUsers();
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
      <h1 className="text-xl font-bold mb-4">All Registered Users</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user._id} className="p-4 border rounded bg-gray-100">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
