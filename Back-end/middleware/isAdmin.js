// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  try {
    // req.user should be populated by the authenticateUser middleware
    if (req.user && req.user.role === "admin") {
      return next(); // User is an admin, proceed
    }
    // If not an admin or no user object
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  } catch (err) {
    console.error("Admin Middleware Error:", err);
    res.status(500).json({ message: "Server error in admin middleware" });
  }
};

module.exports = {
  isAdmin
};