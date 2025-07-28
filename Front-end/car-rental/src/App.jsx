import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import MyBookingsPage from "./pages/MyBookingsPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import About from "./pages/About"; // Import the About component
import Contact from "./pages/Contact"; // Import the Contact component
import Footer from "./components/Footer"; // Import the Footer component

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddCar from "./pages/admin/AddCar";
import AllUsers from "./pages/admin/AllUsers";
import AllCars from "./pages/admin/AllCars";
import AllBookings from "./pages/admin/AllBookings"; // Corrected import name

// Protected Route Component
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <Router>
      <Nav /> {/* Global navigation component */}
      <main className="flex-grow"> {/* Added main tag for layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes - Wrapped with ProtectedAdminRoute */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/cars/add" element={<ProtectedAdminRoute><AddCar /></ProtectedAdminRoute>} />
          <Route path="/admin/users" element={<ProtectedAdminRoute><AllUsers /></ProtectedAdminRoute>} />
          <Route path="/admin/cars" element={<ProtectedAdminRoute><AllCars /></ProtectedAdminRoute>} />
          <Route path="/admin/bookings" element={<ProtectedAdminRoute><AllBookings /></ProtectedAdminRoute>} />
        </Routes>
      </main>
      <Footer /> {/* Global footer component */}
    </Router>
  );
}

export default App;
