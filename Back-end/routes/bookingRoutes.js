const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking
} = require("../controller/bookingController");

const {authenticateUser} = require("../middleware/auth");

// Protect routes
router.post("/", authenticateUser, createBooking);
router.get("/my-bookings", authenticateUser, getMyBookings);
router.get("/all", authenticateUser, getAllBookings); // Maybe restrict this to admin
router.put("/:id/status", authenticateUser, updateBookingStatus);
router.delete("/:id", authenticateUser, deleteBooking);

module.exports = router;
