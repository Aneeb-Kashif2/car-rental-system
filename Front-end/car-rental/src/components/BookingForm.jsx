import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertDialog from "./AlertDialog";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ car, onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    father_name: "",
    licence_number: "",
    cnic_number: "",
    phone_number: "",
    address: "",
    booking_period_from: "",
    booking_period_to: "",
    payment_amount: car.rentPerDay || 0,
    payment_method: "Cash", // Default to Cash
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const { booking_period_from, booking_period_to } = formData;
    if (booking_period_from && booking_period_to && car.rentPerDay) {
      const fromDate = new Date(booking_period_from);
      const toDate = new Date(booking_period_to);

      if (toDate < fromDate) {
        setFormData((prev) => ({
          ...prev,
          payment_amount: car.rentPerDay || 0,
        }));
        return;
      }

      const timeDiff = toDate.getTime() - fromDate.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

      setFormData((prev) => ({
        ...prev,
        payment_amount: car.rentPerDay * days,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        payment_amount: car.rentPerDay || 0,
      }));
    }
  }, [formData.booking_period_from, formData.booking_period_to, car.rentPerDay]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setAlertMessage("You must be logged in to book a car.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const fromDate = new Date(formData.booking_period_from);
    const toDate = new Date(formData.booking_period_to);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      setAlertMessage("Booking start date cannot be in the past.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (fromDate > toDate) {
      setAlertMessage("Booking end date cannot be before start date.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const dataToProcess = {
      customer_name: formData.customer_name,
      father_name: formData.father_name,
      licence_number: formData.licence_number,
      cnic_number: formData.cnic_number,
      phone_number: formData.phone_number,
      address: formData.address,
      startDate: formData.booking_period_from,
      endDate: formData.booking_period_to,
      payment_amount: parseFloat(formData.payment_amount),
      payment_method: formData.payment_method,
      carId: car._id,
    };

    // Only "Credit Card" triggers Stripe Checkout
    if (formData.payment_method === "Credit Card") {
      setAlertMessage("Redirecting to secure payment page...");
      setAlertType("info");
      setShowAlert(true);

      try {
        const res = await axios.post(
          "http://localhost:8000/api/payment/create-checkout-session",
          dataToProcess,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.url) {
          window.location.href = res.data.url;
          onClose();
        } else {
          setAlertMessage("Failed to get Stripe checkout URL.");
          setAlertType("error");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error initiating Stripe Checkout Session:", error);
        setAlertMessage(
          error.response?.data?.error || "Failed to initiate payment. Please try again."
        );
        setAlertType("error");
        setShowAlert(true);
      }
    } else {
      // "Cash" payment method directly proceeds to booking in the database
      try {
        const res = await axios.post(
          "http://localhost:8000/api/bookings", // This is your existing booking endpoint
          dataToProcess,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAlertMessage(res.data.message || "Booking successful!");
        setAlertType("success");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          onClose();
          // Optionally navigate to bookings page or home after successful cash booking
          navigate('/bookings');
        }, 1500);
      } catch (error) {
        console.error("Booking error:", error);
        setAlertMessage(
          error.response?.data?.message || "Something went wrong. Please try again!"
        );
        setAlertType("error");
        setShowAlert(true);
      }
    }
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContentVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { y: "100vh", opacity: 0 },
  };

  // isOnlinePayment is true only for "Credit Card"
  const isOnlinePayment = formData.payment_method === "Credit Card";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm brightness-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1502877338535-766e1342923c?q=80&w=2070&auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>

        <motion.div
          className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] md:max-h-[80vh]"
          variants={modalContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Book <span className="text-blue-600">{car.name}</span>
          </h2>
          <p className="text-center text-gray-600 mb-6 text-lg">
            Daily Rent: <span className="font-bold text-green-600">${car.rentPerDay}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="customer_name"
                placeholder="Your Name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="father_name"
                placeholder="Father's Name"
                value={formData.father_name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="licence_number"
                placeholder="License Number (15 digits)"
                value={formData.licence_number}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength="15"
                maxLength="15"
                pattern="\d{15}"
                title="License number must be exactly 15 digits."
              />
              <input
                type="text"
                name="cnic_number"
                placeholder="CNIC Number (13 digits)"
                value={formData.cnic_number}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength="13"
                maxLength="13"
                pattern="\d{13}"
                title="CNIC number must be exactly 13 digits."
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number (11 digits)"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength="11"
                maxLength="11"
                pattern="\d{11}"
                title="Phone number must be exactly 11 digits."
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {/* Date Inputs with Labels */}
              <div>
                <label htmlFor="booking_period_from" className="block text-gray-700 font-medium mb-1">From Date:</label>
                <input
                  type="date"
                  id="booking_period_from"
                  name="booking_period_from"
                  value={formData.booking_period_from}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="booking_period_to" className="block text-gray-700 font-medium mb-1">To Date:</label>
                <input
                  type="date"
                  id="booking_period_to"
                  name="booking_period_to"
                  value={formData.booking_period_to}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <label className="block">
              <span className="text-gray-700 font-medium">Total Payment Amount:</span>
              <input
                type="text"
                name="payment_amount"
                value={`$${parseFloat(formData.payment_amount).toFixed(2)}`}
                readOnly
                className="mt-1 block w-full border p-3 rounded-lg bg-gray-100 font-bold text-xl text-green-700 cursor-not-allowed"
              />
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              {/* "Bank Transfer" option has been removed */}
            </select>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isOnlinePayment ? "Proceed to Payment" : "Confirm Booking"}
              </motion.button>
              <motion.button
                onClick={onClose}
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05, boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
          >
            <AlertDialog
              message={alertMessage}
              type={alertType}
              onClose={() => setShowAlert(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
