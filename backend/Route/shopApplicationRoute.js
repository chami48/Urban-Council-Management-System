const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  applyForShop,
  getAllApplications,
  getPendingApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  approveShop,
  rejectShop
} = require("../controller/shopApplicationController");

// Citizen applies
router.post("/apply", upload.array("documents", 5), applyForShop);

// Citizen views own application by ID
router.get("/:id", getApplicationById);

// Citizen updates
router.put("/update/:id", upload.array("documents", 5), updateApplication);

// Citizen deletes
router.delete("/:id", deleteApplication);

// Officer views
router.get("/", getAllApplications);
router.get("/pending", getPendingApplications);

// Officer decisions
router.post("/approve/:id", approveShop);
router.post("/reject/:id", rejectShop);

module.exports = router;
