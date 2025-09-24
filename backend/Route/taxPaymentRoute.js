const express = require("express");
const router = express.Router();
const { savePayment, getHistoryByNIC, getStats } = require("../controller/paymentController");

// Unified save for any type (shop_rent, property_tax, license_fee, penalty, etc.)
router.post("/save-payment", savePayment);

// Optional: history by NIC
router.get("/history/:nicNumber", getHistoryByNIC);

// Optional: stats
router.get("/stats", getStats);

module.exports = router;
