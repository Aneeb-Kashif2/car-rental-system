const express = require("express");
const router = express.Router();
// Only import createCheckoutSession here, handleWebhook is imported in app.js now
const { createCheckoutSession } = require("../controller/paymentController");
const { authenticateUser } = require("../middleware/auth");

// Route for creating Stripe Checkout Sessions
router.post("/create-checkout-session", authenticateUser, createCheckoutSession);

// The /webhook route is now handled directly in app.js with manual raw body parsing.
// Do NOT define it here with express.raw() or any other body parser.

module.exports = router;
