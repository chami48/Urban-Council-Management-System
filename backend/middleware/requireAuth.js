// backend/middleware/requireAuth.js
const { getSession } = require("../sessionLite");

module.exports = function requireAuth(req, res, next) {
  const sid = req.cookies?.sid;
  const sess = sid ? getSession(sid) : null;
  if (!sess) return res.status(401).json({ message: "Unauthenticated" });
  // make user available to handlers
  req.user = sess.user;
  next();
};
