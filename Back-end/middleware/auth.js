const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = null;

    // Check Bearer token from Authorization header
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback: Look for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, return an error
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded user data to the request
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticateUser };
