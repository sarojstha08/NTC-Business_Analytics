// ============================================================
// Authentication & Authorization Middleware
// ============================================================

const jwt = require("jsonwebtoken");

/**
 * Verify JWT token from Authorization header
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token." });
  }
}

/**
 * Restrict access to ADMIN role only
 */
function authorizeAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
