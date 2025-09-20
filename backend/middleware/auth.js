// middleware/auth.js

// Dummy isAdmin middleware (always allows access)
const isAdmin = (req, res, next) => {
  console.log("⚠️ WARNING: Using dummy auth - No real security checks!");
  next(); // Just proceed to the next middleware/route
};

module.exports = { isAdmin };