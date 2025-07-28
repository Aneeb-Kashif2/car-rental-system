import React, { useState } from "react";
import Nav from "../components/Nav"; // Nav is already imported globally in App.js now
import Hero from "../components/Hero";
import { useCars } from "../context/CarContext";
import BookingForm from "../components/BookingForm";
import TestimonialsSection from "../components/TestimonialsSection"; // Import new TestimonialsSection
import { motion } from "framer-motion";
import ServicesSection from "../components/Services";

export default function Home() {
  const { cars, loading } = useCars();
  const [selectedCar, setSelectedCar] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <>
      {/* Nav is now in App.js, so it's removed from here */}
      <Hero />

      <ServicesSection /> {/* Integrated Services Section */}

      <section className="text-gray-600 body-font bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold title-font text-gray-900 mb-4 tracking-tight">
              Our Premium Fleet
            </h1>
            <p className="text-lg leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-600">
              Discover the perfect car for your journey from our extensive collection of reliable and stylish vehicles.
            </p>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-700 text-lg">Loading cars, please wait...</p>
          ) : (
            <motion.div
              className="flex flex-wrap -m-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cars.map((car) => (
                <motion.div className="p-4 md:w-1/3" key={car._id} variants={itemVariants}>
                  <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                    <img
                      className="lg:h-64 md:h-48 h-56 w-full object-cover object-center"
                      src={car.image || "https://images.unsplash.com/photo-1583120409747-d5861193d5f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                      alt={car.name}
                    />
                    <div className="p-6 bg-white">
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
                        {car.brand}
                      </h2>
                      <h1 className="title-font text-2xl font-bold text-gray-900 mb-3">
                        {car.name}
                      </h1>
                      <p className="leading-relaxed mb-4 text-gray-700">
                        <span className="font-semibold">Capacity:</span> {car.capacity} Seater <br />
                        <span className="font-semibold">Rent/Day:</span> <span className="text-green-600 text-xl font-bold">${car.rentPerDay}</span>
                      </p>
                      <div className="flex items-center flex-wrap">
                        <motion.button
                          onClick={() => setSelectedCar(car)}
                          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center justify-center"
                          whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Book Now
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <TestimonialsSection /> {/* Integrated Testimonials Section */}

      {selectedCar && (
        <BookingForm
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </>
  );
}
