const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessmentController");

// IMPORTANT: More specific routes should come BEFORE generic ones
router.get('/propertyNo/:propertyNo', assessmentController.getAssessmentByPropertyNo);
router.get("/", assessmentController.getAllAssessments);
router.post("/", assessmentController.addAssessment);
router.get("/:id", assessmentController.getAssessmentById);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/:id", assessmentController.deleteAssessment);

module.exports = router;