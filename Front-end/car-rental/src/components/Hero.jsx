import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Assuming React Router for navigation

export default function Hero() {
  // Animation variants for staggered, car-themed entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger children animations by 0.2 seconds
        delayChildren: 0.3, // Delay the start of children animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -100 }, // Start from left, invisible
    visible: {
      opacity: 1,
      x: 0, // Animate to original position
      transition: {
        type: "spring", // Use a spring physics animation for a smoother, more natural feel
        damping: 10,    // Reduces oscillation
        stiffness: 100, // Controls the "springiness"
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: 0.8, // Delay button animation slightly more
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <section
      className="relative text-white body-font bg-cover bg-center h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1686730540270-93f2c33351b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyfGVufDB8fDB8fHww')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-10 rounded-lg text-center max-w-3xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
        >
          Your Next Adventure Awaits
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl mb-8 opacity-90 font-light"
        >
          Effortless car rentals for every journey. Discover our premium fleet
          and drive into an unforgettable experience with style and comfort.
        </motion.p>
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/book-now">
            <motion.button
              whileHover="hover"
              className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition duration-300 ease-in-out w-full sm:w-auto"
            >
              Book Your Ride Now
            </motion.button>
          </Link>
          <Link to="/view-cars">
            <motion.button
              whileHover="hover"
              className="bg-white text-gray-900 hover:bg-gray-100 py-3 px-8 rounded-full text-lg font-semibold shadow-lg border border-gray-300 transition duration-300 ease-in-out w-full sm:w-auto"
            >
              Explore Our Fleet
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}