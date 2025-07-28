// routes/adminRoutes.js
const express = require("express");
const {
  getAllBookings,
  viewAllUsers,
  getAllCars, // This getAllCars is for admin-specific access
  addCar,
} = require("../controller/adminController");
const { authenticateUser } = require("../middleware/auth"); // Assuming auth.js
const { isAdmin } = require("../middleware/isAdmin"); // Correct import path

const router = express.Router(); // Changed to 'router' for clarity

// All these routes require authentication AND admin role
router.get("/all-bookings", authenticateUser, isAdmin, getAllBookings);
router.get("/all-users", authenticateUser, isAdmin, viewAllUsers);
router.get("/all-cars", authenticateUser, isAdmin, getAllCars); // Admin-specific car listing
router.post("/cars", authenticateUser, isAdmin, addCar);

module.exports = router;