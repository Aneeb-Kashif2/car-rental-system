const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const CarBooking = require("../models/CarBooking");
const Car = require("../models/Car");
const User = require("../models/User");

exports.createCheckoutSession = async (req, res) => {
  try {
    const {
      customer_name,
      father_name,
      licence_number,
      cnic_number,
      phone_number,
      address,
      startDate,
      endDate,
      payment_amount,
      payment_method,
      carId,
    } = req.body;

    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date format in booking details." });
    }
    if (parsedStartDate < today) {
      return res.status(400).json({ message: "Booking start date cannot be in the past." });
    }
    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "Booking end date must be after start date." });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found for booking." });
    }
    if (!car.isAvailable) {
      return res.status(409).json({ message: "Car is currently not available for booking." });
    }

    const overlappingBookings = await CarBooking.find({
      carId: carId,
      booking_status: { $in: ["Pending", "Confirmed"] },
      $or: [
        { startDate: { $lt: parsedEndDate }, endDate: { $gt: parsedStartDate } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: "Car is already booked for part of the selected period." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car Rental Booking - ${customer_name}`,
              description: `Car: ${car.name}, From: ${startDate}, To: ${endDate}`,
            },
            unit_amount: Math.round(payment_amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      metadata: {
        customer_name,
        father_name,
        licence_number,
        cnic_number,
        phone_number,
        address,
        startDate,
        endDate,
        payment_amount: payment_amount.toString(),
        payment_method,
        carId: carId.toString(),
        userId: userId.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Stripe checkout failed.", details: err.message });
  }
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handleWebhook = async (req, res) => {
  // Manually read the raw body from the request stream
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', async () => {
    console.log('--- Webhook Request Received (Manual Read) ---');
    console.log('Request Headers:', req.headers);
    console.log('req.body (should be empty here):', req.body); // Should be empty as no express.json() for this path
    console.log('Manually read rawBody:', rawBody ? rawBody.substring(0, 200) + '...' : 'undefined or empty');

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Use the manually read rawBody for signature verification
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Stripe Checkout Session Completed:', session.id);

        const {
          customer_name,
          father_name,
          licence_number,
          cnic_number,
          phone_number,
          address,
          startDate,
          endDate,
          payment_amount,
          payment_method,
          carId,
          userId,
        } = session.metadata;

        try {
          const existingBooking = await CarBooking.findOne({ stripeCheckoutSessionId: session.id });
          if (existingBooking) {
            console.log(`Booking for session ${session.id} already exists. Skipping duplicate webhook event.`);
            return res.status(200).json({ received: true, message: "Booking already processed." });
          }

          const newBooking = new CarBooking({
            customer_name,
            father_name,
            licence_number,
            cnic_number,
            phone_number,
            address,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            payment_amount: parseFloat(payment_amount),
            payment_method,
            carId: carId,
            userId: userId,
            booking_status: "Confirmed",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
          });

          await newBooking.save();
          console.log('Booking successfully created in DB:', newBooking._id);

          await Car.findByIdAndUpdate(carId, { isAvailable: false });
          console.log(`Car ${carId} marked as unavailable in DB.`);

        } catch (dbError) {
          console.error("Error saving booking or updating car status from webhook:", dbError);
          return res.status(500).json({ received: true, message: "Error processing booking after payment." });
        }
        break;
      case 'payment_intent.succeeded':
        console.log('Stripe Payment Intent Succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object;
        console.log('Stripe Payment Intent Failed:', paymentIntentFailed.id, paymentIntentFailed.last_payment_error);
        break;
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  });
};
