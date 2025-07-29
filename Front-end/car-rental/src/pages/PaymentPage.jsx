import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertDialog from '../components/AlertDialog';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  // State for payment method specific inputs
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: '',
    expiryDate: '', // MM/YY format
    cvc: '',
    cardholderName: '',
  });
  const [bankTransferDetails, setBankTransferDetails] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '', // Or IBAN/SWIFT for international
  });

  useEffect(() => {
    const storedData = localStorage.getItem('pendingBookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      setAlertMessage("No pending booking found. Redirecting...");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/');
      }, 2000);
    }
    setLoading(false);
  }, [navigate]);

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankTransferChange = (e) => {
    const { name, value } = e.target;
    setBankTransferDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validatePaymentInputs = () => {
    if (bookingData.payment_method === "Credit Card") {
      const { cardNumber, expiryDate, cvc, cardholderName } = creditCardDetails;
      if (!cardNumber || !expiryDate || !cvc || !cardholderName) {
        setAlertMessage("Please fill in all credit card details.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
      // Basic format validation (can be much more robust)
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setAlertMessage("Invalid card number. Must be 16 digits.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setAlertMessage("Invalid expiry date. Use MM/YY format.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
      if (!/^\d{3,4}$/.test(cvc)) {
        setAlertMessage("Invalid CVC. Must be 3 or 4 digits.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
    } else if (bookingData.payment_method === "Bank Transfer") {
      const { bankName, accountNumber, routingNumber } = bankTransferDetails;
      if (!bankName || !accountNumber || !routingNumber) {
        setAlertMessage("Please fill in all bank transfer details.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
      // Basic validation
      if (!/^\d{9,18}$/.test(accountNumber)) { // Example: 9-18 digits for account
        setAlertMessage("Invalid account number.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
      if (!/^\d{9}$/.test(routingNumber)) { // Example: 9 digits for routing
        setAlertMessage("Invalid routing number.");
        setAlertType("error");
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };

  const handleSubmitPayment = async () => {
    if (!bookingData) {
      setAlertMessage("No booking data to process.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Validate payment specific inputs
    if (!validatePaymentInputs()) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setAlertMessage("You must be logged in to complete the booking.");
      setAlertType("error");
      setShowAlert(true);
      setLoading(false);
      return;
    }

    try {
      // In a real Stripe integration, you would typically:
      // 1. Send creditCardDetails/bankTransferDetails to Stripe's API to get a token.
      //    e.g., const { token: stripeToken } = await stripe.createToken(cardElement);
      // 2. Then, send this stripeToken along with bookingData to your backend.
      //    Your backend would then use the stripeToken to make a charge with Stripe.

      // For this simulation, we proceed directly to booking submission
      // as if the payment gateway processed the details successfully.
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`, // Your backend endpoint for booking, updated to use VITE_API_URL
        bookingData, // This is the original booking data, payment details are for UI only here
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertMessage(res.data.message || "Payment successful and booking confirmed!");
      setAlertType("success");
      setShowAlert(true);

      localStorage.removeItem('pendingBookingData'); // Clear the pending booking data
      setCreditCardDetails({ cardNumber: '', expiryDate: '', cvc: '', cardholderName: '' });
      setBankTransferDetails({ bankName: '', accountNumber: '', routingNumber: '' });

      setTimeout(() => {
        setShowAlert(false);
        navigate('/bookings'); // Redirect to user's bookings page
      }, 2000);

    } catch (error) {
      console.error("Payment and booking error:", error);
      setAlertMessage(
        error.response?.data?.message || "Payment failed. Please try again!"
      );
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading payment details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return null; // Handled by the redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg text-center border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Payment</h1>
        <p className="text-gray-600 mb-4">
          Payment Method: <span className="font-semibold text-blue-700">{bookingData.payment_method}</span>
        </p>
        <p className="text-2xl font-semibold text-green-600 mb-6">
          Total Amount: ${parseFloat(bookingData.payment_amount).toFixed(2)}
        </p>

        {/* Display Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Summary:</h3>
          <p><strong>Car:</strong> {bookingData.car_id}</p> {/* Placeholder, ideally populate car name */}
          <p><strong>Period:</strong> {new Date(bookingData.booking_period_from).toLocaleDateString()} to {new Date(bookingData.booking_period_to).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> {bookingData.customer_name}</p>
        </div>

        {/* Conditional Payment Forms */}
        {bookingData.payment_method === "Credit Card" && (
          <div className="space-y-4 mb-6 text-left">
            <h3 className="text-xl font-semibold text-gray-800">Credit Card Details</h3>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={creditCardDetails.cardNumber}
                onChange={handleCreditCardChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                maxLength="19" // 16 digits + 3 spaces
                pattern="[\d ]{16,19}"
                title="Credit card number (16 digits)"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={creditCardDetails.expiryDate}
                  onChange={handleCreditCardChange}
                  placeholder="MM/YY"
                  className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength="5"
                  pattern="(0[1-9]|1[0-2])\/\d{2}"
                  title="Expiry date in MM/YY format"
                  required
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={creditCardDetails.cvc}
                  onChange={handleCreditCardChange}
                  placeholder="XXX"
                  className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength="4"
                  pattern="\d{3,4}"
                  title="3 or 4 digit CVC"
                  required
                />
              </div>
              <div className="col-span-3"> {/* Full width for cardholder name */}
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={creditCardDetails.cardholderName}
                  onChange={handleCreditCardChange}
                  placeholder="Name on Card"
                  className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {bookingData.payment_method === "Bank Transfer" && (
          <div className="space-y-4 mb-6 text-left">
            <h3 className="text-xl font-semibold text-gray-800">Bank Transfer Details</h3>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={bankTransferDetails.bankName}
                onChange={handleBankTransferChange}
                placeholder="e.g., Bank of America"
                className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={bankTransferDetails.accountNumber}
                onChange={handleBankTransferChange}
                placeholder="e.g., 1234567890"
                className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                pattern="\d{9,18}" // Example pattern for account numbers
                title="Bank account number (digits only)"
                required
              />
            </div>
            <div>
              <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">Routing Number / IBAN / SWIFT</label>
              <input
                type="text"
                id="routingNumber"
                name="routingNumber"
                value={bankTransferDetails.routingNumber}
                onChange={handleBankTransferChange}
                placeholder="e.g., 0123456789 (Routing) or GBxxBANKxxxxxxxxx (IBAN)"
                className="mt-1 block w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
        )}

        {/* Payment Processing Button */}
        <motion.button
          onClick={handleSubmitPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out"
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? "Processing Payment..." : "Submit Payment & Complete Booking"}
        </motion.button>

        <motion.button
          onClick={() => {
            localStorage.removeItem('pendingBookingData'); // Clear data if user cancels
            navigate('/'); // Go back to home
          }}
          className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out"
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          Cancel Payment
        </motion.button>

        <p className="text-xs text-gray-500 mt-4">
          Note: This is a simulated payment. In a real application, your entered details would be securely processed by a payment gateway like Stripe.
        </p>
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
    </div>
  );
}
