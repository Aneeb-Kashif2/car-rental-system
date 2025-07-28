import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(''); // 'success', 'error', 'submitting'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // In a real application, you would send this data to your backend here.
    // For now, we'll simulate a submission.
    console.log('Contact form submitted:', formData);

    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
      setTimeout(() => setFormStatus(''), 3000); // Clear status after 3 seconds
    }, 1500);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.section
      className="text-gray-600 body-font relative bg-gray-50 min-h-screen pt-24"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="container px-5 py-12 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative shadow-lg">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder="0"
            title="map"
            marginHeight="0"
            marginWidth="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Rawalpindi,%20Pakistan&ie=UTF8&t=&z=14&iwloc=B&output=embed"
            style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
          ></iframe>
          <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
              <p className="mt-1">123 Car Rental Blvd, Rawalpindi, Punjab, Pakistan</p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
              <a className="text-blue-500 leading-relaxed">info@geargo.com</a>
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
              <p className="leading-relaxed">+92 3XX XXXXXXX</p>
            </div>
          </div>
        </div>
        <motion.div
          className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 p-8 rounded-lg shadow-lg relative overflow-hidden" // Added relative and overflow-hidden
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Background image for the form section */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm" // Subtle background
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542362543-d021c1722f87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
          ></div>
          <h2 className="text-gray-900 text-3xl mb-1 font-extrabold title-font relative z-10">Get In Touch</h2>
          <p className="leading-relaxed mb-5 text-gray-600 relative z-10">We'd love to hear from you!</p>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10"> {/* Added relative z-10 */}
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded-lg text-lg shadow-md transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </motion.button>
            {formStatus === 'success' && (
              <p className="text-green-500 mt-3">Message sent successfully!</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-500 mt-3">Failed to send message. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}
