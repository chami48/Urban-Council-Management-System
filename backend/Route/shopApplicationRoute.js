const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); 
const {
  applyForShop,
  getAllApplications,
  getPendingApplications,
  approveShop,
  rejectShop
} = require("../controller/shopApplicationController");

// Citizen applies with file upload
router.post("/apply", upload.array("documents", 5), applyForShop); // max 5 files

// Officer views applications
router.get("/", getAllApplications);
router.get("/pending", getPendingApplications);

// Officer decisions
router.post("/approve/:id", approveShop);
router.post("/reject/:id", rejectShop);

module.exports = router;
