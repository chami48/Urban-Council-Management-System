const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");


const {
  applyForShop,
  getAllApplications,
  getPendingApplications,
  approveShop,
  rejectShop
} = require("../controller/shopApplicationController");

// Citizen applies with validation + file upload
router.post(
  "/apply",
  upload.array("documents", 5),
  applyForShop
);

// Officer views applications
router.get("/", getAllApplications);

// Officer decisions
router.post("/approve/:id", approveShop);
router.post("/reject/:id", rejectShop);

module.exports = router;
