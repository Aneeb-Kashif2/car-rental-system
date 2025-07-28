// controller/handleUserSignup.js (or wherever your handleUserSignup function is located)
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password, age, cnic } = req.body; // <<< ADD 'cnic' HERE

    // --- Input Validation ---
    if (!name || !email || !password || !age || !cnic) { // <<< Include cnic in required fields check
      return res.status(400).json({ message: "All fields are required: name, email, password, age, cnic." });
    }

    // Validate Age (must be a number and at least 18)
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return res.status(400).json({ message: "Age must be a number and at least 18 years old." });
    }

    // Validate CNIC (must be exactly 13 digits)
    if (typeof cnic !== 'string' || cnic.length !== 13 || !/^\d{13}$/.test(cnic)) {
      return res.status(400).json({ message: "CNIC must be exactly 13 digits." });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Check if CNIC already exists
    const existingUserByCnic = await User.findOne({ cnic });
    if (existingUserByCnic) {
      return res.status(409).json({ message: "CNIC already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      age: parsedAge, // <<< Use the parsed number for age
      cnic, // <<< Pass the cnic
      role: "user"
    });

    return res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup Error:", err); // Log the full error object for better debugging
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: `Validation failed: ${messages.join(', ')}` });
    }
    // Handle duplicate key errors (e.g., if unique constraint fails for email/cnic)
    if (err.code === 11000) { // MongoDB duplicate key error code
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `This ${field} is already registered.` });
    }
    return res.status(500).json({ message: "Signup failed due to a server error. Please try again later." });
  }
}

module.exports = {
  handleUserSignup
};