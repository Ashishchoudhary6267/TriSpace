const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate a user via JWT.
 * Expects 'Authorization: Bearer <token>' header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // The header is typically 'Bearer TOKEN_STRING', so we split it by space
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the token payload (id, email, role) to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Middleware to restrict access to Admins only.
 * Must be placed AFTER authenticateToken in the route middleware chain.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin
};
