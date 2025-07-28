// controller/adminController.js
const User = require("../models/User");
const Car = require("../models/Car");
const Booking = require("../models/CarBooking");

// view all users
async function viewAllUsers(req, res) {
    try {
        const users = await User.find().select('-password'); // Exclude passwords for security
        res.status(200).json(users);

    }
    catch (err) {
        console.error("Fetch All Users Error:", err);
        res.status(500).json({ message: "Error fetching users" }); // Changed 'errors' to 'users' for clarity
    }
}

const getAllBookings = async (req, res) => {
  try {
    // Populate 'carId' from Booking, assuming Booking schema has a 'carId' reference to 'Car'
    // Populate 'userId' if you want user details in bookings
    const bookings = await Booking.find()
      .populate("carId", "name brand rentPerDay")
      .populate("userId", "name email"); // Assuming 'userId' in Booking refers to 'User'

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch All Bookings Error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

const getAllCars = async (req , res) => {
    try {
        // Cars themselves don't typically have a 'carId' field to populate.
        // You just want to find all car documents.
        const cars = await Car.find(); // Correct: Just find all cars

        res.status(200).json(cars);
    }
    catch (err) { // Correctly caught as 'err'
        console.error("Error fetching all cars (Admin):", err); // Log the actual error
        res.status(500).json({ message: 'Failed to fetch cars', error: err }); // Pass 'err' in the response
    }
};

// Add a new car
const addCar = async (req, res) => {
  try {
    const { name, image, brand, rentPerDay, capacity } = req.body;

    // Basic validation
    if (!name || !image || !brand || !rentPerDay || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCar = new Car({
      name,
      image,
      brand,
      rentPerDay,
      capacity,
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (err) { // Changed 'error' to 'err' for consistency if you prefer
    console.error("Error adding car:", err);
    // You might want to send specific validation errors from Mongoose here
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Failed to add car", error: err.message }); // Send error message
  }
};

module.exports ={
    getAllBookings,
    viewAllUsers,
    getAllCars,
    addCar
}