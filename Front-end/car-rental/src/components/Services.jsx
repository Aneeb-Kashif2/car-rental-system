import React from 'react';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  const services = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
      title: "Wide Vehicle Selection",
      description: "Choose from a diverse fleet of cars, from economy to luxury, to suit every need and budget."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
        </svg>
      ),
      title: "Easy Online Booking",
      description: "Our intuitive platform makes booking your desired car quick and hassle-free, anytime, anywhere."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available around the clock to assist you with any queries or issues."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <path d="M3 18v-6a9 9 0 0118 0v6"></path>
          <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
        </svg>
      ),
      title: "Flexible Rental Periods",
      description: "Rent a car for a day, a week, or longer – our flexible options are designed to fit your schedule."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "Comprehensive Insurance",
      description: "Drive with peace of mind knowing all our rentals come with comprehensive insurance coverage."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="text-blue-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
        </svg>
      ),
      title: "Affordable Rates",
      description: "Enjoy competitive pricing and transparent billing with no hidden fees, ensuring great value."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="text-gray-600 body-font bg-gray-50 py-24">
      <div className="container px-5 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold title-font text-gray-900 mb-4 tracking-tight">
            Why Choose GearGo?
          </h1>
          <p className="text-lg leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-600">
            Experience unparalleled convenience and reliability with our top-notch car rental services.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-blue-500 inline-flex"></div>
          </div>
        </div>

        <motion.div
          className="flex flex-wrap -m-4 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% in view
        >
          {services.map((service, index) => (
            <motion.div className="p-4 md:w-1/3 sm:w-1/2 w-full" key={index} variants={itemVariants}>
              <div className="border-2 border-gray-200 px-4 py-6 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                {service.icon}
                <h2 className="title-font font-bold text-xl text-gray-900 mt-4 mb-2">
                  {service.title}
                </h2>
                <p className="leading-relaxed text-gray-700">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
