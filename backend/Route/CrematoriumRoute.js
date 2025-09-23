const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllCrematoriumBookings,
  addCrematoriumBooking,
  updateCrematoriumBookingStatus,
  checkAvailability,
} = require("../controller/CrematoriumController");

// If you have auth middleware, you can enable it like this:
// const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads/crematorium_images");

// Ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET all bookings (supports filtering by userId/applicantEmail via query params)
router.get("/", /* requireAuth, */ getAllCrematoriumBookings);

// Create booking (with files)
router.post(
  "/",
  /* requireAuth, */
  upload.fields([
    { name: "deathCertificateImage", maxCount: 1 },
    { name: "beOrderImage", maxCount: 1 },
  ]),
  addCrematoriumBooking
);

// Update status
router.patch("/update-status/:id", /* requireAuth, */ updateCrematoriumBookingStatus);

// Availability check
router.post("/check-availability", checkAvailability);

module.exports = router;
