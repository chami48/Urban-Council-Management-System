const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Crematorium = require("../Model/Crematorium");

const {
  getAllCrematoriumBookings,
  addCrematoriumBooking,
  updateCrematoriumBookingStatus,
} = require("../controller/CrematoriumController");

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

// ✅ Existing routes
router.get("/", getAllCrematoriumBookings);
router.post(
  "/",
  upload.fields([
    { name: "deathCertificateImage", maxCount: 1 },
    { name: "beOrderImage", maxCount: 1 },
  ]),
  addCrematoriumBooking
);
router.patch("/update-status/:id", updateCrematoriumBookingStatus);

// ✅ New availability check route
router.post("/check-availability", async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existingBooking = await Crematorium.findOne({ cremationDate: new Date(date) });

    if (existingBooking) {
      return res.json({ available: false, message: "❌ Crematorium already booked for this date" });
    }

    res.json({ available: true, message: "✅ Crematorium available for booking" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
