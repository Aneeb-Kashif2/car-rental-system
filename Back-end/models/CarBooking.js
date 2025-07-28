// models/CarBooking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  father_name: { type: String, required: true },
  licence_number: {
    type: String,
    required: true,
    match: [/^\d{15}$/, 'Licence number must be exactly 15 digits.'], // Assuming 15 digits
  },
  cnic_number: {
    type: String,
    required: true,
    match: [/^\d{13}$/, 'CNIC number must be exactly 13 digits.'], // Assuming 13 digits
  },
  phone_number: {
    type: String,
    required: true,
    match: [/^\d{11}$/, 'Phone number must be exactly 11 digits.'], // Assuming 11 digits
  },
  address: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  payment_amount: { type: Number, required: true, min: 0 },
  payment_method: { type: String, required: true },
  booking_status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // <<< MAKE REQUIRED
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);