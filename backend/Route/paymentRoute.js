const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

// -------- Property Tax --------
router.post("/", paymentController.addPayment);
router.get("/:propertyNo", paymentController.getPaymentsByProperty);
router.get("/:propertyNo/year/:year", paymentController.getTotalPaidForYear);

// -------- Business License --------
router.post("/license", paymentController.addLicensePayment);
router.get("/license/:licenseId", paymentController.getPaymentsByLicense);

module.exports = router;
