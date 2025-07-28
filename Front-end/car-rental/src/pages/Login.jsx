import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Import environment variable
const API_BASE = import.meta.env.VITE_API_URL;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use API_BASE instead of localhost
      const response = await axios.post(`${API_BASE}/login`, formData, {
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful!");

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden md:flex flex-row-reverse">
        <motion.div
          className="md:w-1/2 bg-cover bg-center hidden md:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549740431-7e87b7a59a7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-center h-full bg-black bg-opacity-40 p-8">
            <h2 className="text-white text-4xl font-extrabold text-center leading-tight">
              Welcome Back! <br /> Drive Away Soon
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Sign In to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <motion.button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.02, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </form>
          <div className="text-sm text-center mt-4">
            Don't have an account yet?{" "}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up here
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
