import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "GearGo made my last trip incredibly smooth. The car was pristine, and the booking process was a breeze. Highly recommend!",
      author: "Sarah L.",
      city: "Lahore"
    },
    {
      quote: "Fantastic service! I needed a car on short notice, and GearGo delivered. Their customer support is truly 24/7 and very helpful.",
      author: "Ahmed K.",
      city: "Islamabad"
    },
    {
      quote: "Affordable rates and a great selection of cars. I've used them multiple times now and always had a positive experience.",
      author: "Fatima B.",
      city: "Karachi"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="text-gray-600 body-font bg-white py-24">
      <div className="container px-5 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold title-font text-gray-900 mb-4 tracking-tight">
            What Our Customers Say
          </h1>
          <p className="text-lg leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-600">
            Hear directly from those who've experienced the GearGo difference.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-blue-500 inline-flex"></div>
          </div>
        </div>

        <motion.div
          className="flex flex-wrap -m-4 justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% in view
        >
          {testimonials.map((testimonial, index) => (
            <motion.div className="p-4 lg:w-1/3 md:w-1/2 w-full" key={index} variants={itemVariants}>
              <div className="h-full bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.023 975.023">
                  <path d="M925.023,487.511c0,256.59-208.433,465.023-465.023,465.023S-5,744.101-5,487.511S203.433,22.488,460.023,22.488 S925.023,230.921,925.023,487.511z M460.023,30.011c-251.68,0-457.511,205.831-457.511,457.511s205.831,457.511,457.511,457.511 s457.511-205.831,457.511-457.511S711.703,30.011,460.023,30.011z M495.023,487.511c0,15.68-12.82,28.5-28.5,28.5h-100 c-15.68,0-28.5-12.82-28.5-28.5v-100c0-15.68,12.82-28.5,28.5-28.5h100c15.68,0,28.5,12.82,28.5,28.5V487.511z M495.023,487.511" />
                </svg>
                <p className="leading-relaxed mb-6 text-gray-800 italic">"{testimonial.quote}"</p>
                <a className="inline-flex items-center">
                  <span className="flex-grow flex flex-col">
                    <span className="title-font font-bold text-gray-900 text-lg">{testimonial.author}</span>
                    <span className="text-gray-500 text-sm">{testimonial.city}</span>
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
