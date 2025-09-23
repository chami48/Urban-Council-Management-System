const express = require("express");
const router = express.Router();
const { calculateTax } = require("../controller/taxController");

// GET /calculateTax/:propertyNo
router.get("/:propertyNo", calculateTax);

module.exports = router;
