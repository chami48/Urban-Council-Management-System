const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Controller
const ComplaintController = require("../controller/ComplaintsController");

// Routes
router.get("/", ComplaintController.getAllComplaints);

router.post(
  "/",
  upload.array("Attach_Files", 5), // up to 5 files
  ComplaintController.addComplaint
);

router.get("/:id", ComplaintController.getComplaintById);
router.put("/:id", upload.array("Attach_Files", 5), ComplaintController.updateComplaint);
router.delete("/:id", ComplaintController.deleteComplaint);

module.exports = router;
