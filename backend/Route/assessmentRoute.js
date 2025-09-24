const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessmentController");
const { assessmentValidation } = require("../Validation/assessmentValidation");
const validate = require("../middleware/validate");

// IMPORTANT: More specific routes should come BEFORE generic ones
router.get('/propertyNo/:propertyNo', assessmentController.getAssessmentByPropertyNo);
router.get("/", assessmentController.getAllAssessments);
router.post("/", assessmentController.addAssessment);
router.post("/", validate(assessmentValidation), assessmentController.addAssessment);
router.get("/:id", assessmentController.getAssessmentById);
router.put("/:id", validate(assessmentValidation), assessmentController.updateAssessment);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/:id", assessmentController.deleteAssessment);

module.exports = router;