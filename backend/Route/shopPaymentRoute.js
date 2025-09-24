const express = require("express");
const router = express.Router();
const shopPaymentController = require("../controller/shopPaymentController");

// Shop Rent Payment Routes
router.get("/:shopId", shopPaymentController.getShopPaymentDetails);
router.get("/:shopId/payments", shopPaymentController.getPaymentsByShop);

module.exports = router;
