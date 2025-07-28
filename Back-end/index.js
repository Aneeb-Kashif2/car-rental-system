require("dotenv").config();

const express = require("express");
const { connectToMongoDB } = require("./connect");
const carRoutes = require("./routes/carRoutes");
const cors = require("cors");
const userRoutes = require("./routes/UserLoginAndSignupRoute");
const bookingRoutes = require("./routes/bookingRoutes");
const PORT = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // Import payment routes
const { handleWebhook } = require("./controller/paymentController"); // Import handleWebhook directly

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// IMPORTANT: Define the webhook route FIRST.
// We are NO LONGER using express.raw() here. The raw body will be read manually inside handleWebhook.
app.post("/api/payment/webhook", handleWebhook);

// Now, apply express.json() globally for all other routes that expect JSON.
// This must come AFTER the specific webhook route definition.
app.use(express.json());
app.use(cookieParser());

// Now, mount your other routes
// paymentRoutes still contains /create-checkout-session, but /webhook is now handled above.
app.use("/api/payment", paymentRoutes);

app.use('/api/cars', carRoutes);
app.use("/", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);


app.get("/test", (req, res) => {
  res.send("everything is fine");
});

connectToMongoDB(process.env.MONGO_URL)
  .then(() => {
    console.log("MONGO CONNECTED");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

  

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
