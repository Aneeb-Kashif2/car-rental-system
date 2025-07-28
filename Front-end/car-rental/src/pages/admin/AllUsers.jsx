import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/admin/all-users", {
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true
});
      setUsers(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Registered Users</h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id} className="p-4 border rounded bg-gray-100">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
