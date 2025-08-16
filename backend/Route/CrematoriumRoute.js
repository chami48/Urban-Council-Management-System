const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllCrematoriumBookings,
  addCrematoriumBooking,
  updateCrematoriumBookingStatus,
} = require("../Controlers/CrematoriumController");

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

// Routes
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

module.exports = router;
