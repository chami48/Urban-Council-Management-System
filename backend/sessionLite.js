// backend/sessionLite.js
const crypto = require("crypto");

// super tiny cookie parser
function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((acc, part) => {
    const [k, v] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(v || "");
    return acc;
  }, {});
}

// in-memory session store (lost on server restart)
const sessions = new Map(); // sid -> { user, expires }

function newSession(user, ttlMs = 60 * 60 * 1000) {
  const sid = crypto.randomBytes(16).toString("hex");
  sessions.set(sid, { user, expires: Date.now() + ttlMs });
  return sid;
}

function getSession(sid) {
  const s = sessions.get(sid);
  if (!s) return null;
  if (Date.now() > s.expires) {
    sessions.delete(sid);
    return null;
  }
  return s;
}

function destroySession(sid) {
  sessions.delete(sid);
}

module.exports = { parseCookies, sessions, newSession, getSession, destroySession };
