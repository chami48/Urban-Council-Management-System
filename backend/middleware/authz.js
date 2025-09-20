// backend/middleware/authz.js
const { getSession } = require("../sessionLite");

// 1) Base auth (you already had this)
function requireAuth(req, res, next) {
  const sid = req.cookies?.sid;
  const sess = sid ? getSession(sid) : null;
  if (!sess) return res.status(401).json({ message: "Unauthenticated" });
  req.user = sess.user; // { _id, name, email, role }
  next();
}

// 2) Role gate — use after requireAuth
function allowRoles(...roles) {
  // if you pass no roles, it allows everyone who is authenticated
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, allowRoles };
