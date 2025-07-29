import React, { useState } from "react";
import axios from "axios";

export default function AddCar() {
  const [car, setCar] = useState({
    name: "",
    brand: "",
    rentPerDay: "",
    capacity: "", // Make sure this matches your model
    image: ""
  });

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/cars`, // Updated endpoint to use VITE_API_URL
        car,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      alert("Car added successfully!");
      setCar({
        name: "",
        brand: "",
        rentPerDay: "",
        capacity: "",
        image: ""
      });
    } catch (err) {
      console.error("Error adding car:", err);
      console.error("Error details:", err.response?.data); // Add this to see server response
      alert(`Failed to add car: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={car.name}
          onChange={handleChange}
          placeholder="Car Name"
          className="input input-bordered w-full"
          required
        />
        <input
          name="brand"
          value={car.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="input input-bordered w-full"
          required
        />
        <input
          name="rentPerDay"
          type="number"
          value={car.rentPerDay}
          onChange={handleChange}
          placeholder="Rent Per Day"
          className="input input-bordered w-full"
          required
        />
        <input
          name="capacity"
          type="number"
          value={car.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="input input-bordered w-full"
          required
        />
        <input
          name="image"
          value={car.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Add Car
        </button>
      </form>
    </div>
  );
}
