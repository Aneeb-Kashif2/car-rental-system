import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Ensure Link is imported if used
import AlertDialog from "../components/AlertDialog";
import { motion } from "framer-motion"; // Import motion for animations

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "", // Will be a number
    cnic: "", // New CNIC field
  });

  // State for custom alert dialog
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure age is sent as a number
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      const res = await axios.post("http://localhost:8000/signup", dataToSend);

      setAlertMessage(res.data.message || "Signup successful!");
      setAlertType("success");
      setShowAlert(true);

      // Navigate to login after a short delay to show the alert
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Adjust delay as needed
    } catch (err) {
      console.error("Signup error:", err);
      setAlertMessage(
        err.response?.data?.message || "Signup failed! Please try again."
      );
      setAlertType("error");
      setShowAlert(true);
    }
  };

  // --- Animation Variants (NEW) ---
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden md:flex">
        {/* Left Side - Signup Form */}
        <motion.div
          className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <input
              name="email"
              placeholder="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <input
              name="age"
              type="number"
              placeholder="Age (Min 18)"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <input
              name="cnic"
              type="text"
              placeholder="CNIC Number (13 digits)"
              value={formData.cnic}
              onChange={handleChange}
              required
              minLength="13"
              maxLength="13"
              pattern="\d{13}"
              title="CNIC must be exactly 13 digits (numbers only)."
              className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <motion.button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.02, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </form>
          {/* Link to Login page (if you have one) */}
          <div className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in here
            </Link>
          </div>
        </motion.div>

        {/* Right Side - Car Image */}
        <motion.div
          className="md:w-1/2 bg-cover bg-center hidden md:block" // Hidden on small screens
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1575971846465-b74ce124036f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // New high-quality image
          }}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-center h-full bg-black bg-opacity-40 p-8">
            <h2 className="text-white text-4xl font-extrabold text-center leading-tight">
              Start Your Journey <br /> With Us
            </h2>
          </div>
        </motion.div>
      </div>

      {showAlert && (
        <AlertDialog
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}