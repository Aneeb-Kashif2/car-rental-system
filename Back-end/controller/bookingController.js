// controller/bookingController.js
const Booking = require("../models/CarBooking");
const Car = require("../models/Car");
const User = require("../models/User"); // Ensure User model is imported if you're populating it

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      customer_name,
      father_name,
      licence_number,
      cnic_number,
      phone_number,
      address,
      startDate, // Changed from booking_period_from to match frontend
      endDate,   // Changed from booking_period_to to match frontend
      payment_amount,
      payment_method,
      carId // Changed from car_id to match frontend
    } = req.body;

    // Get userId from the authenticated user (populated by authenticateUser middleware)
    const userId = req.user ? req.user.id : null;

    // --- Server-side Input Validation ---
    // Updated validation to use correct variable names
    if (
      !customer_name || !father_name || !licence_number || !cnic_number ||
      !phone_number || !address || !startDate || !endDate || // Use startDate, endDate
      !payment_amount || !payment_method || !carId || !userId // Use carId
    ) {
      return res.status(400).json({ message: "All required fields are missing or incomplete." });
    }

    // Date Validation
    const parsedStartDate = new Date(startDate); // Use parsedStartDate
    const parsedEndDate = new Date(endDate);     // Use parsedEndDate
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day for comparison

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date format." });
    }
    if (parsedStartDate < today) {
      return res.status(400).json({ message: "Start date cannot be in the past." });
    }
    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    // Check Car Existence and Availability
    const car = await Car.findById(carId); // Use carId
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }
    if (!car.isAvailable) {
      return res.status(409).json({ message: "Car is currently not available for booking." });
    }

    // Check for overlapping bookings for the specific car
    const overlappingBookings = await Booking.find({
      carId: carId, // Use carId
      booking_status: { $in: ["Pending", "Confirmed"] },
      $or: [
        { startDate: { $lt: parsedEndDate }, endDate: { $gt: parsedStartDate } }, // Use parsed dates
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: "Car is already booked for part of the selected period." });
    }

    // Create new booking
    const newBooking = new Booking({
      customer_name,
      father_name,
      licence_number,
      cnic_number,
      phone_number,
      address,
      startDate: parsedStartDate, // Use validated Date objects
      endDate: parsedEndDate,     // Use validated Date objects
      payment_amount,
      payment_method,
      carId: carId, // Use carId
      userId: userId, // Associate booking with the authenticated user
      booking_status: "Pending" // Default status is Pending, but explicitly set for clarity
    });

    await newBooking.save();

    // Mark car as unavailable immediately after successful booking
    await Car.findByIdAndUpdate(carId, { isAvailable: false }); // Use carId

    res.status(201).json({
      message: "Booking successful",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Create Booking Error:", err);
    // Handle Mongoose validation errors (e.g., from schema's match/required)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: `Validation failed: ${messages.join(', ')}` });
    }
    res.status(500).json({ message: "Server error during booking creation." });
  }
};

// GET ALL BOOKINGS (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("carId", "name brand rentPerDay")
      .populate("userId", "name email"); // Populate user details

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch All Bookings Error (Admin):", err);
    res.status(500).json({ message: "Error fetching all bookings." });
  }
};

// GET MY BOOKINGS (User specific)
const getMyBookings = async (req, res) => {
  try {
    // req.user.id is populated by the authenticateUser middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const bookings = await Booking.find({ userId: req.user.id })
      .populate("carId", "name brand rentPerDay"); // Populate car details

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch My Bookings Error:", err);
    res.status(500).json({ message: "Error fetching your bookings." });
  }
};

// UPDATE BOOKING STATUS (Admin Panel Usage)
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Basic validation for status
  if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid booking status provided." });
  }

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const originalStatus = booking.booking_status; // Store original status

    // Update the booking status
    booking.booking_status = status;
    await booking.save();

    // Logic to update car availability based on booking status change
    if (originalStatus !== "Cancelled" && status === "Cancelled") {
      // If booking was active and is now cancelled, make the car available
      await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
    } else if (originalStatus === "Cancelled" && status === "Confirmed") {
      // If a cancelled booking is re-confirmed, try to make car unavailable
      const car = await Car.findById(booking.carId);
      if (car) {
        const otherActiveBookings = await Booking.find({
          carId: booking.carId,
          _id: { $ne: booking._id }, // Exclude the current booking
          booking_status: { $in: ["Pending", "Confirmed"] },
          $or: [
            { startDate: { $lt: booking.endDate }, endDate: { $gt: booking.startDate } },
          ],
        });

        if (otherActiveBookings.length === 0) {
          await Car.findByIdAndUpdate(booking.carId, { isAvailable: false });
        } else {
          console.warn(`Car ${booking.carId} has conflicting active bookings. Cannot set to unavailable upon re-confirmation of booking ${booking._id}.`);
        }
      }
    } else if (status === "Confirmed" && originalStatus === "Pending") {
        await Car.findByIdAndUpdate(booking.carId, { isAvailable: false });
    }

    res.status(200).json({ message: "Booking status updated successfully", booking: booking });
  } catch (err) {
    console.error("Update Booking Status Error:", err);
    res.status(500).json({ message: "Error updating booking status." });
  }
};

// DELETE BOOKING (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await Booking.findByIdAndDelete(bookingId);

    const activeBookingsForCar = await Booking.find({
      carId: booking.carId,
      booking_status: { $in: ["Pending", "Confirmed"] }
    });

    if (activeBookingsForCar.length === 0) {
      await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
    }

    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (err) {
    console.error("Delete Booking Error:", err);
    res.status(500).json({ message: "Error deleting booking." });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
};
